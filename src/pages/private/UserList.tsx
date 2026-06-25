import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  message,
  Row,
  Col
} from 'antd';
import api from "../../Utils/ApiCalls/Api";

const { Option } = Select;

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  deposit: number;
  usedDeposit: number;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    isActive: null as boolean | null
  });

  const loadUsers = async (
    currentPage = page,
    currentSize = size
  ) => {
    try {
      setLoading(true);

      const response = await api.post(
        `/auth/users?page=${currentPage}&size=${currentSize}`,
        filters
      );

      const result = response.data.data;

      setUsers(result.content || []);
      setTotal(result.totalElements || 0);
    } catch (error: any) {
      console.error(error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/auth/${id}/status`, {
        isActive: !isActive
      });

      message.success(
        !isActive
          ? "User activated successfully"
          : "User deactivated successfully"
      );

      loadUsers(); // refresh table
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'N/A'
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   render: (active: boolean) =>
    //     active ? (
    //       <Tag color="green">ACTIVE</Tag>
    //     ) : (
    //       <Tag color="red">INACTIVE</Tag>
    //     )
    // }
    {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (_: boolean, record: any) => (
      <Button
        danger={record.isActive}
        type="primary"
        onClick={() =>
          updateStatus(record.userId, record.isActive)
        }
      >
        {record.isActive ? "Deactivate" : "Activate"}
      </Button>
    )
  }
];

  return (
    <Card title="User Management">
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={3}>
          <Input
            placeholder="Search Name"
            value={filters.name}
            onChange={(e) =>
              setFilters({
                ...filters,
                name: e.target.value
              })
            }
          />
        </Col>

        <Col span={3}>
          <Input
            placeholder="Search Email"
            value={filters.email}
            onChange={(e) =>
              setFilters({
                ...filters,
                email: e.target.value
              })
            }
          />
        </Col>

        <Col span={3}>
          <Select
            placeholder="Select Role"
            style={{ width: '100%' }}
            allowClear
            value={filters.role || undefined}
            onChange={(value) =>
              setFilters({
                ...filters,
                role: value || ''
              })
            }
          >
            <Option value="ADMIN">ADMIN</Option>
            <Option value="USER">USER</Option>
          </Select>
        </Col>

        <Col span={3}>
          <Input
            placeholder="Search Phone"
            value={filters.phone}
            onChange={(e) =>
              setFilters({
                ...filters,
                phone: e.target.value
              })
            }
          />
        </Col>

      <Col span={3}>
        <Select
          placeholder="Select Status"
          allowClear
          style={{ width: '100%' }}
          value={filters.isActive?.toString()}
          onChange={(value) =>
            setFilters({
              ...filters,
              isActive:
                value === 'true'
                  ? true
                  : value === 'false'
                  ? false
                  : null
            })
          }
        >
          <Option value="true">ACTIVE</Option>
          <Option value="false">INACTIVE</Option>
        </Select>
      </Col>

        <Col span={6}>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setPage(1);
                loadUsers(1, size);
              }}
            >
              Search
            </Button>

            <Button
              onClick={() => {
                const reset = {
                  name: '',
                  email: '',
                  role: '',
                  phone: '',
                  isActive: null
                };

                setFilters(reset);
                setPage(1);

                setTimeout(() => {
                  loadUsers(1, size);
                }, 0);
              }}
            >
              Reset
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        rowKey="userId"
        loading={loading}
        columns={columns}
        dataSource={users}
        pagination={{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          showTotal: (total) =>
            `Total ${total} users`
        }}
        onChange={(pagination) => {
          const current = pagination.current || 1;
          const pageSize = pagination.pageSize || 10;

          setPage(current);
          setSize(pageSize);

          loadUsers(current, pageSize);
        }}
      />
    </Card>
  );
}