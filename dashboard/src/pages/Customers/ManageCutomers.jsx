import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../api/Customer';
import { FaUserPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Button, Card, Input, Table, Space, Spin, Typography, Modal, message } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { permissionsAtom, rolesAtom } from '../../state/rolesAtom';
import { useAtom } from 'jotai';


const { Title } = Typography;

function ManageCustomers() {

  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);

  const hasRole = (roleName) =>
    roles.some((role) => role.role_name === roleName);
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);



  const queryClient = useQueryClient();
  const { data: customers, isLoading, error } = useQuery('customers', fetchCustomers);
  const [newCustomer, setNewCustomer] = useState({ username: '', phone: '', password: '' });
  const [editCustomer, setEditCustomer] = useState(null);

  const createMutation = useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      message.success('Customer created successfully');
      setNewCustomer({ username: '', phone: '', password: '' });
    },
  });

  const updateMutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      message.success('Customer updated successfully');
    },
  });

  const deleteMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
      message.success('Customer deleted successfully');
    },
  });

  const handleCreate = () => {
    createMutation.mutate(newCustomer);
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this customer?',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({ ...editCustomer, username: 'newUsername' });
    setEditCustomer(null);
  };

  if (isLoading) return <div className="text-center text-gray-600"><Spin /> Loading...</div>;
  if (error) return <div className="text-center text-red-600">An error occurred: {error.message}</div>;

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title : 'walletBalance',
      dataIndex :'walletBalance',
      key : 'walletBalance',
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<FaEdit />}
            onClick={() => handleEdit(record)}
          />
         {
          hasPermission('مدير') && <Button
            icon={<FaTrashAlt />}
            type="danger"
            onClick={() => handleDelete(record.id)}
          />
         }
        </Space>
      ),
    },
  ];

  return (
    <div className="container p-6 mx-auto">
      <Title level={2} className="mb-6">Manage Customers</Title>

      <Card
        title="Add Customer"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Input
          placeholder="Username"
          value={newCustomer.username}
          onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
          prefix={<UserOutlined />}
          style={{ marginBottom: '16px' }}
        />
        <Input
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          prefix={<PhoneOutlined />}
          style={{ marginBottom: '16px' }}
        />
        <Input.Password
          placeholder="Password"
          value={newCustomer.password}
          onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
          prefix={<LockOutlined />}
          style={{ marginBottom: '24px' }}
        />
        <Button
          type="primary"
          icon={<FaUserPlus />}
          onClick={handleCreate}
          loading={createMutation.isLoading}
        >
          Create
        </Button>
      </Card>

      <Card title="Customer List" bordered={false}>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
        />
      </Card>

      {editCustomer && (
        <Modal
          title="Edit Customer"
          visible={!!editCustomer}
          onOk={handleUpdate}
          onCancel={() => setEditCustomer(null)}
        >
          <Input
            value={editCustomer.username}
            onChange={(e) => setEditCustomer({ ...editCustomer, username: e.target.value })}
            placeholder="Username"
            style={{ marginBottom: '16px' }}
          />
          <Input
            value={editCustomer.phone}
            onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
            placeholder="Phone"
            style={{ marginBottom: '16px' }}
          />
          <Input.Password
            value={editCustomer.password}
            onChange={(e) => setEditCustomer({ ...editCustomer, password: e.target.value })}
            placeholder="Password"
            style={{ marginBottom: '16px' }}
          />
        </Modal>
      )}
    </div>
  );
}

export default ManageCustomers;
