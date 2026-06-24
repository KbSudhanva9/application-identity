import { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Card, Radio, message } from 'antd';
import { FiMail, FiPhone, FiLock, FiCheckCircle, FiSend } from 'react-icons/fi';
import api from '../../../Utils/ApiCalls/Api';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [otpType, setOtpType] = useState<'EMAIL' | 'SMS'|'WHATSAPP'>('EMAIL');
  const [otpSent, setOtpSent] = useState(false);
  const [targetContact, setTargetContact] = useState('');

  // 1. Core States for tracking time and locking layout windows
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<number | null>(null);


  // 2. Clear background intervals safely if components unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  // 3. The 3-Minute (180s) Timer Countdown Engine
  useEffect(() => {
    localStorage.clear();
    if (timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0; // Locks UI elements synchronously on 0
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft]);

  // 4. Time formatter helper string (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 5. Trigger this helper inside your successful OTP API response block
  const startTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setTimeLeft(180); // 3 minutes = 180 seconds
    setOtpSent(true);
  };


  const [form] = Form.useForm();

  // Handle switching between password login and OTP login workflows
  const handleAuthMethodChange = (e: any) => {
    setAuthMethod(e.target.value);
    setOtpSent(false);
    form.resetFields(['email', 'phoneNumber', 'password', 'otp']);
  };

  // Handle switching between Email and SMS channels inside the OTP workflow
  const handleOtpTypeChange = (e: any) => {
    setOtpType(e.target.value);
    setOtpSent(false);
    form.resetFields(['email', 'phoneNumber', 'otp']);
  };

  // Step 1: Trigger exact backend payload to generate OTP
  const handleRequestOtp = async () => {
    try {
      console.log(" Start handleRequestOtp  ");
      const activeField = otpType === 'EMAIL' ? 'email' : 'phoneNumber';
      const values = await form.validateFields([activeField]);
      setLoading(true);
      console.log(" handleRequestOtp  " + JSON.stringify(values));
      const contactValue = values[activeField];
      setTargetContact(contactValue);

      // Create payload dynamically matching your backend key requirement
      /*const payload = otpType === 'EMAIL'
        ? { email: contactValue, channel: 'email' }
        : { phone: contactValue, channel: 'sms' }; */
        const payload = {
EMAIL: { email: contactValue, channel: 'email' },
  SMS: { phone: contactValue, channel: 'sms' },
  WHATSAPP: { phone: contactValue, channel: 'whatsapp' }
}[otpType];
      console.log(" Before Response data  /request-otp " + JSON.stringify(payload));
      // POST Request directly to your exact URL definition
      const response = await api.post('/auth/request-otp', payload);
      console.log(" After Response data  /request-otp " + response.data);
      message.success(response?.data?.message || `OTP successfully sent!`);
      setOtpSent(true);
      startTimer();
    } catch (error: any) {
      console.error('OTP Generation Error:', error);
      const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to generate verification code.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
    console.log(" Ending handleRequestOtp  ");
  };
  // Step 2: Trigger final validation payload for password or OTP verification
  const handleFinalValidationSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("Entering handleFinalValidationSubmit() authMethod ", JSON.stringify(authMethod));
      let endpoint = '';
      let payload = {};

      if (authMethod === 'password') {
        endpoint = '/auth/login';
        payload = {
          email: values.email,
          password: values.password
        };
      } else {
        endpoint = '/auth/verify-otp';
       /* payload = otpType === 'EMAIL'
          ? { email: targetContact, otp: values.otp, channel: 'email' }
          : { phone: targetContact, otp: values.otp };*/
          payload =  {
EMAIL: { email: targetContact, otp: values.otp, channel: 'email' },
  SMS: { phone: targetContact, otp: values.otp,channel: 'sms' },
  WHATSAPP: { phone: targetContact, otp: values.otp, channel: 'whatsapp' }
}[otpType];
      }

      console.log("handleFinalValidationSubmit() " + JSON.stringify(payload));
      const response = await api.post(endpoint, payload);
      const result = response.data;

      console.log("handleFinalValidationSubmit()  AFter api call " + JSON.stringify(result));
      message.success('Validation passed. Redirecting...');

      // Save your Access Token if returned in the response payload structure
      if (result?.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
      }

      // DYNAMIC REDIRECT CHECK:
      // If the backend sends 'redirectUrl', go there. Otherwise, fallback safely to '/home'
      if (result && result.data && result.data.redirectUrl) {
        window.location.href = result.data.redirectUrl + `?sessionId=${encodeURIComponent(result.data.sessionId)}`;
      }
      // else if (result && result.redirectUrl) {
      // window.location.href = result.redirectUrl; // Check if it's directly on the root object
      // } 
      else {
        window.location.href = '/'; // Fallback application route
      }

    } catch (error: any) {
      console.log("🕵️‍♂️ Debugging /auth/verify-otp Failure:", error.response);
      //  console.error('Validation Pipeline Failure:', JSON.stringify( error));
      const errorMsg = error.response?.data?.message || error.response?.data || 'Validation rejected.';
      message.error(errorMsg);

      console.log("⚠️ Error Message text: " + error.message);
      console.log(" API RETURN MESSAGE : " + error.response?.data);

    } finally {
      setLoading(false);
    }
  };


  // Step 2: Trigger final validation payload for password or OTP verification
  /*
  const handleFinalValidationSubmit = async (values: any) => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (authMethod === 'password') {
        endpoint = '/auth/login';
        payload = {
          email: values.email,
          password: values.password
        };
      } else {
        // Matches your exact URL definition
        endpoint = '/verify-otp';

        // Formulates payload matching your exact key structures dynamically
        payload = otpType === 'EMAIL' 
          ? { email: targetContact, otp: values.otp }
          : { phoneNumber: targetContact, otp: values.otp };
      }

      const response = await api.post(endpoint, payload);
      const result = response.data;

      message.success('Validation passed. Redirecting...');

      if (result?.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
      }
   //   window.location.href = '/home';
     window.location.href = profileResult.data.redirectUrl;
    } catch (error: any) {
      console.error('Validation Pipeline Failure:', error);
      const errorMsg = error.response?.data?.message || error.response?.data || 'Validation rejected.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
*/
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f7fa' }}>
      <Card
        title={<div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>Identity Access Management</div>}
        style={{ width: 420, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
      >
        <Form form={form} name="dynamic_auth_form" layout="vertical" onFinish={handleFinalValidationSubmit} requiredMark={false}>

          {/* Main Mode Switcher */}
          <Form.Item label="Authentication Method" style={{ marginBottom: '20px' }}>
            <Radio.Group value={authMethod} onChange={handleAuthMethodChange} optionType="button" buttonStyle="solid" block>
              <Radio.Button value="password">Password</Radio.Button>
              <Radio.Button value="otp">OTP</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Workflow A: Password Field Setup */}
          {authMethod === 'password' && (
            <>
              <Form.Item label="Email Address" name="email" rules={[{ required: true, message: 'Provide email!' }, { type: 'email', message: 'Invalid format!' }]}>
                <Input prefix={<FiMail style={{ color: '#bfbfbf' }} />} placeholder="name@example.com" size="large" />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Input password!' }]}>
                <Input.Password prefix={<FiLock style={{ color: '#bfbfbf' }} />} placeholder="Enter your password" size="large" />
              </Form.Item>
            </>
          )}

          {/* Workflow B: OTP Channel Setup */}
          {authMethod === 'otp' && (
            <>
              <Form.Item label="Select OTP Mode" style={{ marginBottom: '16px' }}>
                <Radio.Group value={otpType} onChange={handleOtpTypeChange} size="small" disabled={otpSent && timeLeft > 0}>
                  <Radio value="EMAIL">EMAIL</Radio>
                  <Radio value="SMS">SMS</Radio>
                  <Radio value="WHATSAPP">WHATSAPP</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Toggle Input field dynamically based on Mode selection */}
              {otpType === 'EMAIL' ? (
                <Form.Item label="Enter Email Address" name="email" rules={[{ required: true, message: 'Email required!' }, { type: 'email', message: 'Invalid email structure!' }]}>
                  <Input prefix={<FiMail style={{ color: '#bfbfbf' }} />} placeholder="name@example.com" size="large" disabled={otpSent && timeLeft > 0} />
                </Form.Item>
              ) : (
                <Form.Item label="Enter Mobile Number" name="phoneNumber" rules={[{ required: true, message: 'Phone number required!' }, { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Must match global E.164 standard!' }]}>
                  <Input prefix={<FiPhone style={{ color: '#bfbfbf' }} />} placeholder="+1234567890" size="large" disabled={otpSent && timeLeft > 0} />
                </Form.Item>
              )}

              {/* Dedicated "Generate OTP" button for SMS/EMAIL */}
              {!otpSent && (
                <Form.Item style={{ marginTop: '16px' }}>
                  <Button type="dashed" loading={loading} block size="large" icon={<FiSend />} onClick={handleRequestOtp}>
                    Generate OTP
                  </Button>
                </Form.Item>
              )}

              {/* OTP Code Entry block - revealed after generation success */}
              {otpSent && (
                <>
                  <Form.Item
                    // ⏱️ Places your dynamic title text and color-coded countdown inline
                    label={
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span>Enter Verification OTP Code</span>
                        {/* 🔴 Text snaps from soft blue (#1890ff) to error warning red (#ff4d4f) dynamically */}
                        <span style={{ color: timeLeft > 0 ? '#1890ff' : '#ff4d4f', fontSize: '13px', fontWeight: 500 }}>
                          {timeLeft > 0 ? `Expires in: ${formatTime(timeLeft)}` : 'Expired! Please resend.'}
                        </span>
                      </div>
                    }
                    name="otp"
                    rules={[
                      { required: true, message: 'Input the code!' },
                      { len: 5, message: 'Code must be exactly 5 digits!' }
                    ]}
                  >
                    {/* 🔒 Input block automatically locks down interaction on 00:00 */}
                    <Input.OTP
                      size="large"
                      length={5}
                      formatter={(str) => str.replace(/\D/g, '')}
                      disabled={timeLeft === 0}
                    />
                  </Form.Item>

                  {/* Clean spacing container hosting target switcher link and the anti-flood resend link layout */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => { setOtpSent(false); setTimeLeft(0); }}
                      style={{ padding: 0 }}
                    >
                      Change target destination
                    </Button>

                    <Button
                      type="link"
                      size="small"
                      onClick={handleRequestOtp}
                      disabled={timeLeft > 0 || loading} // 🔄 Unlocks routing link strictly when timer hits 0
                      style={{ padding: 0 }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Final Validation Action Button Control node */}
          {(authMethod === 'password' || otpSent) && (
            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={authMethod === 'otp' && timeLeft === 0} // 🔒 Stops click actions on expiry
                block
                size="large"
                icon={<FiCheckCircle />}
                style={
                  authMethod === 'otp'
                    ? {
                      // 🟢 Dynamic Green background automatically turns safe grey on expiry
                      backgroundColor: timeLeft === 0 ? '#f5f5f5' : '#52c41a',
                      borderColor: timeLeft === 0 ? '#d9d9d9' : '#52c41a',
                      color: timeLeft === 0 ? 'rgba(0, 0, 0, 0.25)' : '#fff'
                    }
                    : {}
                }
              >
                Validate & Sign In
              </Button>
            </Form.Item>
          )}
<Form.Item style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1890ff' }}>
                Register here
              </Link>
            </span>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );

}

export default Login;
