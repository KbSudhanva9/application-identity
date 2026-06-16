import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
// Importing React Icons for form visual inputs
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '../../../Utils/ApiCalls/Api';
// import axios from 'axios';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        } else {
          console.warn('Profile fetched, but no user role was found in the payload structure.');
        }

      } catch (profileError: any) {
        // Suppress complete failure: Allow application entry but warn about missing state roles
        console.error('Chained profile execution failed:', profileError);
        message.warning('Logged in successfully, but failed to synchronize your user profile role.');
      }

      // 3. Complete pipeline and redirect user to the dashboard view node
      navigate('/home');

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
