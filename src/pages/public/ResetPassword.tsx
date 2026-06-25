import { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Radio
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import api from '../../Utils/ApiCalls/Api';
import type { ResetPasswordForm } from '../interf/RegisterInterfaces';
import { FiCheckCircle } from 'react-icons/fi';

const { Title, Text } = Typography;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  // const [resetMethod, setResetMethod] = useState<'EMAIL' | 'SMS'>('EMAIL');
  // const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [otpType, setOtpType] = useState<'EMAIL' | 'SMS' | 'WHATSAPP'>('EMAIL');
  const [otpSent, setOtpSent] = useState(false);

  const [isUserVerified, setIsUserVerified] = useState(false);
  // const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [targetContact, setTargetContact] = useState('');

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const timerRef = useRef<number | null>(null);

  const handleOtpTypeChange = (e: any) => {
    setOtpType(e.target.value);
    setOtpSent(false);
    form.resetFields(['email', 'phone', 'otp']);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setTimeLeft(180); // 3 minutes = 180 seconds
    setOtpSent(true);
  };

  const callVerifyEmail = async (channel: string, value: string) => {
    if (!value) return;

    try {
      const payload = {
        email: channel === 'email' ? value : undefined,
        phone: channel === 'sms' ? value : undefined,
        channel: channel
      };

      const response = await api.post(
        '/auth/valid-user',
        payload
      );

      if (response.data) {
        message.success('User exists');
        setIsUserVerified(true);
      } else {
        setIsUserVerified(false);
        setOtpSent(false);
        message.error('User not found');
      }
    } catch (error: any) {
      setIsUserVerified(false);
      setOtpSent(false);
      message.error(
        error?.response?.data?.message ||
        'User verification failed'
      );
    }
  };

  const handleRequestOtp = async () => {
    try {
      console.log(" Start handleRequestOtp  ");
      const activeField = otpType === 'EMAIL' ? 'email' : 'phone';
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

      const response = await api.post('/auth/reset-password-otp', payload);
      console.log(" After Response data  /reset-password-otp " + response.data);
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

  const handleResetPassword = async (
    values: ResetPasswordForm
  ) => {
    setLoading(true);

    try {
      const payload =
        otpType === 'EMAIL'
          ? {
            email: values.email,
            channel: 'email',
            newPassword: values.newPassword,
            otp: values.otp
          }
          : {
            phone: values.phone,
            channel: 'sms',
            newPassword: values.newPassword,
            otp: values.otp
          };

      const response = await api.patch(
        '/auth/reset-password',
        payload
      );

      message.success(response.data.message || 'Password updated successfully');

      form.resetFields();

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);

    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
        'Failed to update password'
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
      // localStorage.clear();
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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5'
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 10
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24
          }}
        >
          <Title level={3}>
            Reset Password
          </Title>

          <Text type="secondary">
            Select channel to reset your password.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
        // onFinish={handleResetPassword}
        >
          <Form.Item
            label="Reset Password Via"
            style={{ marginBottom: '16px' }}
          >
            <Radio.Group
              value={otpType}
              onChange={handleOtpTypeChange}
              size="small"
            >
              <Radio value="EMAIL">
                EMAIL
              </Radio>

              <Radio value="SMS">
                SMS
              </Radio>
            </Radio.Group>
          </Form.Item>

          {otpType === 'EMAIL' ? (
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message:
                    'Please enter email address'
                },
                {
                  type: 'email',
                  message:
                    'Please enter a valid email'
                }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter email address"
                onBlur={(e) =>
                  callVerifyEmail('email', e.target.value)
                }
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="Mobile Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message:
                    'Please enter mobile number'
                },
                {
                  pattern:
                    /^\+?[1-9]\d{1,14}$/,
                  message:
                    'Must match E.164 format (Example: +919876543210)'
                }
              ]}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined />}
                placeholder="+919876543210"
                onBlur={(e) =>
                  callVerifyEmail('sms', e.target.value)
                }
              />
            </Form.Item>
          )}

          {(isUserVerified) && (
            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Button
                type="primary"
                // htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<FiCheckCircle />}
                onClick={() => {
                  handleRequestOtp();
                  // message.success('OTP sent successfully');
                  // setIsOtpVerified(true);
                }}
              >
                Generate OTP
              </Button>
            </Form.Item>
          )}

          {(otpSent) && (
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
                      // disabled={timeLeft === 0}
                    />
                  </Form.Item>

                  {/* Clean spacing container hosting target switcher link and the anti-flood resend link layout */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => { setIsUserVerified(false); setOtpSent(false); setTimeLeft(0); }}
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

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter new password'
                  }
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message:
                      'Please confirm password'
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue(
                          'newPassword'
                        ) === value
                      ) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          'Passwords do not match'
                        )
                      );
                    }
                  })
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                />
              </Form.Item>
              {/* </>
          )} */}

              <Form.Item
                style={{
                  marginTop: 24
                }}
              >
                <Button
                  type="primary"
                  // htmlType="submit"
                  onClick={async () => {
                    try {
                      const values = await form.validateFields();
                      await handleResetPassword(values as ResetPasswordForm);
                    } catch (err) {
                      // validation failed - do nothing
                    }
                  }}
                  block
                  size="large"
                  loading={loading}
                >
                  Verify & Update Password
                </Button>
              </Form.Item>
            
            </>
          )}

          <Form.Item
            style={{
              textAlign: 'center',
              marginBottom: 0
            }}
          >
            <Button
              type="link"
              onClick={() =>
                navigate('/')
              }
            >
              Back to Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}