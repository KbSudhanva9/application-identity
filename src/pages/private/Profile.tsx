import { Avatar, Card, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function Profile() {
  const userName = localStorage.getItem('userName') || 'Guest';
  const userId = localStorage.getItem('userId') || '-';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 16
        }}
      >
        <Space
          size={20}
          align="center"
        >
          <Avatar
            size={72}
            style={{
              backgroundColor: '#1677ff'
            }}
            icon={<UserOutlined />}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>

          <div>
            <Title
              level={4}
              style={{ marginBottom: 0 }}
            >
              {userName}
            </Title>

            <Text type="secondary">
              User ID: {userId}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}