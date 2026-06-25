import { useState } from 'react';
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

const { Title, Text } = Typography;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const [resetMethod, setResetMethod] =
    useState<'EMAIL' | 'SMS'>('EMAIL');

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const callVerifyEmail = async (channel: string,value: string) => {
  if (!value) return;

  try {
    // const response = await api.get(
    //   `/auth/valid-user`
    // );

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
    } else {
      message.error('User not found');
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
      'User verification failed'
    );
  }
};

  const handleResetMethodChange = (e: any) => {
    setResetMethod(e.target.value);

    form.resetFields([
      'email',
      'phoneNumber'
    ]);
  };

  const handleResetPassword = async (
    values: ResetPasswordForm
  ) => {
    setLoading(true);

    try {
      const payload =
        resetMethod === 'EMAIL'
          ? {
              email: values.email,
              newPassword: values.newPassword
            }
          : {
              phoneNumber: values.phoneNumber,
              newPassword: values.newPassword
            };

      const response = await api.post(
        '/auth/reset-password',
        payload
      );

      message.success(
        response.data.message ||
          'Password updated successfully'
      );

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
          onFinish={handleResetPassword}
        >
          <Form.Item
            label="Reset Password Via"
            style={{ marginBottom: '16px' }}
          >
            <Radio.Group
              value={resetMethod}
              onChange={handleResetMethodChange}
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

          {resetMethod === 'EMAIL' ? (
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
              name="phoneNumber"
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

          <Form.Item
            style={{
              marginTop: 24
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Update Password
            </Button>
          </Form.Item>

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