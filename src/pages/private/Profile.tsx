import { Avatar, Card, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function Profile() {
  const userName = localStorage.getItem('userName') || 'Guest';
  const userId = localStorage.getItem('userId') || '-';
  const role = localStorage.getItem('role') || '-';
  const accessToken = localStorage.getItem('accessToken') || '-';

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
              Role: {role}
            </Text>
            <br />

            <Text type="secondary">
              User ID: {userId}
            </Text>
          </div>
        </Space>
      </Card>

      <Card
        style={{
          width: 450,
          borderRadius: 16,
          marginLeft: 20
        }}
      >
        <Title
          level={4}
          style={{ marginBottom: 20 }}
        >
          Access Token
        </Title>
        <Text
          style={{
            wordBreak: 'break-all'
          }}
        >
          {accessToken}
        </Text>
      </Card>

    </div>
  );
}