import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../../api/Admin';
import { IMAGE_URL } from '../../../constants/URL';
import Loading from '../../../components/Loading/Loading';

const AdminManagement = () => {
    const queryClient = useQueryClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [form] = Form.useForm();
    const [adminData, setAdminData] = useState([]);

    // Fetch all admins
    const { data: admins, isLoading, error } = useQuery('admins', () => getAdmins('admin'), {
        onError: () => {
            message.error('Failed to fetch admins');
        },
        onSuccess: (data) => {
            setAdminData(data);
        },
    });

    // Mutation for adding/updating admin
    const adminMutation = useMutation({
        mutationFn: async (admin) => {
            if (currentAdmin) {
                return await updateAdmin({ id: currentAdmin.id, updated: admin, point: 'admin' });
            } else {
                return await createAdmin({ data: admin, point: 'admin' });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries('admins');
            handleCancel();
            message.success(currentAdmin ? 'Admin updated successfully' : 'Admin created successfully');
        },
        onError: () => {
            message.error('Failed to save admin');
        },
    });

    // Mutation for deleting an admin
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteAdmin({ id, point: 'admin' }),
        onSuccess: () => {
            queryClient.invalidateQueries('admins');
            message.success('Admin deleted successfully');
        },
        onError: () => {
            message.error('Failed to delete admin');
        },
    });

    const showModal = (admin = null) => {
        setCurrentAdmin(admin);
        form.resetFields();
        if (admin) {
            form.setFieldsValue({
                ...admin,
                image: admin.image ? [{ uid: '-1', name: admin.image.name, status: 'done', url: admin.image.url }] : [],
            });
        }
        setIsModalVisible(true);
    };

    const handleAddOrUpdate = (values) => {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('fullName', values.fullName);
        formData.append('phone', values.phone);
        formData.append('email', values.email);
        formData.append('password', values.password);

        // Handle uploaded image
        if (values.image && values.image.length > 0) {
            const file = values.image[0].originFileObj;
            formData.append('image', file);
        }

        adminMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentAdmin(null);
    };

    const columns = [
        {
            title: 'اسم المستخدم',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'الاسم ',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'الهاتف',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'البريد',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'الصورة',
            dataIndex: 'image',
            key: 'image',
            render: (text, admin) => admin.image ? (
                <Image
                    width={100} // Set desired width
                    src={ IMAGE_URL + "adminimage/" + admin.image} // Adjust the source to your image URL or path
                    alt={admin.fullName}
                />
            ) : (
                <span>No Image</span>
            ),
        },
        {
            title: 'اجراء',
            key: 'actions',
            render: (text, admin) => (
                <span>
                    <Button onClick={() => showModal(admin)}>تعديل</Button>
                    <Button onClick={() => handleDelete(admin.id)} style={{ marginLeft: 8 }}>
                        حدف
                    </Button>
                </span>
            ),
        },
    ];
    React.useEffect(() => {
        console.log('Admin Data:', adminData);
    }, [adminData]);

    if (isLoading) return <div><Loading/></div>;
    if (error) return <div>Error loading admins: {error.message}</div>;


    return (
        <div>
            <Button type="primary" onClick={() => showModal()}>
                اضافة مستخدم لوحة تحكم
            </Button>
            <Table dataSource={adminData} columns={columns} rowKey="id" />
            <Modal
                title={currentAdmin ? 'تعديل' : 'اضافة '}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleAddOrUpdate}>
                    <Form.Item name="username" label="اسم المستخدم" rules={[{ required: true, message: "ادخل اسم المستخدم"}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="fullName" label="الاسم الثلاثي" rules={[{ required: true, message: 'ادخل الاسم الثلاثي' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="الهاتف" rules={[{ required: true, message: 'ادخل رفم الهاتف' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="كلمة المرور" rules={[{ required: true, message: 'ادخل كلمة المرور' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="البريد" rules={[{ required: true, message: 'ادخل البريد الالكتروني' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            beforeUpload={() => false} // Prevent automatic upload
                            listType="picture-card"
                            maxCount={1}
                            
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            اضافة
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminManagement;
