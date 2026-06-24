import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  // Select,
  message,
  Typography
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined
} from '@ant-design/icons';

import api from '../../Utils/ApiCalls/Api';
import { Link } from 'react-router-dom';
import type { RegisterForm } from '../interf/RegisterInterfaces';

const { Title } = Typography;


const Register =() => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "USER",
        phone: values.phone.trim()
      };

      const response = await api.post(
        '/auth/register',
        payload
      );

      message.success(
        response.data.message ||
          'Registration successful.'
      );
      navigate('/login', { replace: true }); 
      form.resetFields();
    } catch (error: any) {
      console.error('Registration Error:', error);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to register user.';

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa'
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 12
        }}
      >
        <Title
          level={3}
          style={{
            textAlign: 'center',
            marginBottom: 30
          }}
        >
          Create Account
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter your name.'
              },
              {
                //pattern: 3,
                message:
                  'Name must contain at least 3 characters.'
              }
            ]}
          >
            <Input
              size="large"
              placeholder="Enter full name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your email.'
              },
              {
                type: 'email',
                message:
                  'Please enter a valid email address.'
              }
            ]}
          >
            <Input
              size="large"
              placeholder="user@gmail.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter a password.'
              },
              {
               /* pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                message:
                  'Password must contain uppercase, lowercase, number and special character.'*/
              }
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message:
                  'Please confirm your password.'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue('password') === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'Passwords do not match.'
                    )
                  );
                }
              })
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          {/* <Form.Item
            label="Role"
            name="role"
            initialValue="USER"
            rules={[
              {
                required: true,
                message: 'Please select a role.'
              }
            ]}
          >
            <Select
              size="large"
              placeholder="Select role"
            >
              <Select.Option value="USER">
                USER
              </Select.Option>

              <Select.Option value="ADMIN">
                ADMIN
              </Select.Option>
            </Select>
          </Form.Item> */}

            <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please enter phone number.'
              },
              {
      pattern: /^\+?[1-9]\d{1,14}$/,
      message: 'Must match global E.164 standard.'
    }
            ]}
          >
            <Input
              size="large"
              placeholder="+1234567890"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            style={{
              marginTop: 30,
              marginBottom: 0
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Register
            </Button>
          </Form.Item>

          <Form.Item style={{ marginTop: 16, textAlign: 'right' }}>
            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
              {' '}
              <Link to="/" style={{ color: '#1890ff' }}>
                Login
              </Link>
            </span>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
 
export default Register;