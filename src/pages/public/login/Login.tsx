import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
// Importing React Icons for form visual inputs
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '../../../Utils/ApiCalls/Api';
// import axios from 'axios';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getIP = async () => {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();

    console.log(data.ip);
  };

  // hello test

  const getSystemDetails = async () => {
    const details: Record<string, any> = {};

    // Browser & Device Information
    details.userAgent = navigator.userAgent;
    details.platform = navigator.platform;
    details.language = navigator.language;
    details.languages = navigator.languages;
    details.cookieEnabled = navigator.cookieEnabled;
    details.onLine = navigator.onLine;
    details.hardwareConcurrency = navigator.hardwareConcurrency; // CPU cores
    details.deviceMemory = (navigator as any).deviceMemory || "N/A"; // RAM in GB (Chrome)
    details.vendor = navigator.vendor;

    // Screen Information
    details.screenWidth = window.screen.width;
    details.screenHeight = window.screen.height;
    details.availWidth = window.screen.availWidth;
    details.availHeight = window.screen.availHeight;
    details.colorDepth = window.screen.colorDepth;
    details.pixelDepth = window.screen.pixelDepth;

    // Timezone
    details.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Current URL
    details.currentUrl = window.location.href;

    // Public IP
    try {
      const ipResponse = await fetch(
        "https://api.ipify.org?format=json"
      );
      const ipData = await ipResponse.json();
      details.publicIp = ipData.ip;
    } catch (e) {
      details.publicIp = "Unable to fetch";
    }

    // Geolocation
    try {
      const location = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          // cast resolve to the expected callback type so TS knows the resolved value
          resolve as PositionCallback,
          reject as PositionErrorCallback
        );
      });

      details.latitude = location.coords.latitude;
      details.longitude = location.coords.longitude;
      details.accuracy = location.coords.accuracy;
    } catch (e) {
      details.location = "Permission denied";
    }

    console.log(details);
    return details;
  };

  // Triggered when Ant Design form passes client-side validation rules
  const handleLoginSubmit = async (values: any) => {
  setLoading(true);
  try {
    // 1. Fire the login request
    const response = await api.post('/auth/login', {
      email: values.email,
      password: values.password,
    });

    const result = response.data; 

    // Safe Check: Ensure tokens exist in the response payload before writing to disk
    if (result && result.data && result.data.accessToken) {
      
      // Save tokens securely to your browser's localStorage
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      
      message.success(result.message || 'Login successful!');

      // 2. Chained Call: Fetch User Profile details using the brand new token
      try {
        // Use standard 'axios' here to bypass request interceptor synchronization delays.
        // Prepend '/api' to cleanly hit your Vite dev server proxy target
        const profileResponse = await api.get('/auth/profile', {
          headers: { 
            'Authorization': `Bearer ${result.data.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        const profileResult = profileResponse.data;

        // Extract and assign permissions directly from the expected profile JSON data node
        if (profileResult && profileResult.data && profileResult.data.role) {
          localStorage.setItem('role', profileResult.data.role);
          
          // Optional: Store other useful profile parameters for your Layouts/Header
          localStorage.setItem('userName', profileResult.data.name);
          localStorage.setItem('userId', profileResult.data.userId);

          window.location.href = profileResult.data.redirectUrl + `?token=${encodeURIComponent(result.data.accessToken)}`;

        } else {
          console.warn('Profile fetched, but no user role was found in the payload structure.');
        }

      } catch (profileError: any) {
        // Suppress complete failure: Allow application entry but warn about missing state roles
        console.error('Chained profile execution failed:', profileError);
        message.warning('Logged in successfully, but failed to synchronize your user profile role.');
      }

      // 3. Complete pipeline and redirect user to the dashboard view node
      // navigate('/home');
      // navigate('https://www.google.com/'); 

      // window.location.href = 'https://www.google.com?utm_token='+result.data.accessToken;

      // window.location.href =`https://www.google.com?utm_source=chatgpt.com`
      
      // `https://www.google.com?token=${encodeURIComponent(result.data.accessToken)}`;

    } else {
      message.error('Authentication response structural failure: Access token not sent by server.');
    }

  } catch (error: any) {
    // Gracefully handle rejection states (e.g. 401 Unauthorized, 403 Forbidden, or server offline)
    console.error('Authentication Pipeline Error:', error);
    const errorMsg = error.response?.data?.message || 'Invalid credentials or server connection issue.';
    message.error(errorMsg);
  } finally {
    setLoading(false);
  }
};
  // useEffect(() => {
  //   // getSystemDetails().then((data) => {
  //     // console.log(data);
  //   });
  // }, []);



  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#f5f7fa' 
    }}>
      <Card 
        title={
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600 }}>
            Welcome Back
          </div>
        } 
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
      >
        <Form
          name="springboot_auth_form"
          layout="vertical"
          // onFinish={getSystemDetails}
          onFinish={handleLoginSubmit}
          requiredMark={false}
        >
          {/* Email Form Field */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please provide your account email!' },
              { type: 'email', message: 'Please enter a valid email syntax!' }
            ]}
          >
            <Input 
              prefix={<FiMail style={{ color: '#bfbfbf' }} />} 
              placeholder="name@example.com" 
              size="large"
            />
          </Form.Item>

          {/* Password Form Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<FiLock style={{ color: '#bfbfbf' }} />} 
              placeholder="Enter your security password" 
              size="large"
            />


            {/* <Input.OTP separator={<span>-</span>} /> */}

          </Form.Item>

          {/* Submit Action Button */}
          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              icon={<FiLogIn />}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
