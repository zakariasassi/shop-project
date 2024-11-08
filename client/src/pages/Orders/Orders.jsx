import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Table, Tag, Modal, Button, Typography, Space, Row, Col, Card,Divider, Image, Alert } from 'antd';
import { getAllByUserID } from '../../api/Orders'; // Adjust the path as needed
import OrderInvoice from '../OrderInvoice/OrderInvoice';
import NoData from './../../components/NoData/NoData';
import Loading from './../../components/Loading/Loading';
import { IMAGE_URL } from '../../constant/URL';

const { Title, Text } = Typography;

const statusColors = {
  accepted: "green",
  pending: "yellow",
  canceled: "red",
  processing: "blue",
  shipping: "purple",
  delivered: "cyan",
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, error, isLoading } = useQuery('userOrders', getAllByUserID);


  if (isLoading) return <Loading />
  if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;
  if (!data || data.length === 0) return <NoData />

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: 'رقم الطلب',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'حالة الطلب',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status.toLowerCase()]}>{status}</Tag>
      ),
    },
    {
      title: 'إجمالي قيمة الطلب',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount} د.ل`,
    },
    {
      title: 'تاريخ الطلب',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div dir='rtl' className='w-[80%] m-auto'>
      <Title level={2}>طلباتي</Title>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        pagination={false}
      />
  <Modal
      bodyStyle={{ direction: 'rtl' }} // Ensure RTL direction inside the modal
      title={`تفاصيل الطلب: ${selectedOrder?.id}`}
      open={isModalOpen}
      onCancel={closeModal}
      footer={[
        <Button key="close" onClick={closeModal}>
          إغلاق
        </Button>,
      ]}
    >
      {selectedOrder && (
        <div dir="rtl" style={{ padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Title level={2} style={{ textAlign: 'center', color: '#04E0BC' }}>فاتورة الطلب</Title>
          
          <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
            <Col span={12}>
              <Card>
                <Text strong>رقم الطلب: </Text>
                <Text>{selectedOrder.id}</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Text strong>تاريخ الطلب: </Text>
                <Text>{new Date(selectedOrder.createdAt).toLocaleDateString()}</Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
            <Col span={12}>
              <Card>
                <Text strong>طريقة الدفع: </Text>
                <Text>{selectedOrder.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'المحفظة الخاصة'}</Text>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Text strong>المجموع الكلي: </Text>
                <Text>{selectedOrder.totalAmount} د.ل</Text>
              </Card>
            </Col>
          </Row>

          <Divider>تفاصيل الشحن</Divider>
          <Card style={{ marginBottom: '1rem' }}>
            <Text strong>الاسم الكامل: </Text>{selectedOrder?.shippingDetails?.fullName}<br />
            <Text strong>العنوان: </Text>{selectedOrder?.shippingDetails?.address}<br />
            <Text strong>رقم الهاتف: </Text>{selectedOrder?.shippingDetails?.phone}<br />
            <Text strong>البريد الإلكتروني: </Text>{selectedOrder?.shippingDetails?.email}<br />
            <Text strong>طريقة الشحن: </Text>{selectedOrder?.shippingDetails?.shippingMethod}
          </Card>

          <Divider>تفاصيل العناصر</Divider>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {selectedOrder.OrderItems.map((item) => (
              <Card key={item.id} style={{ marginBottom: '1rem' }}>
                <Row gutter={[16, 16]}>
                  <Col span={18}>
                    <Text strong>{item.Product.TradeName}</Text><br />
                    <Text>الكمية: {item.quantity}</Text><br />
                    <Text>السعر: {item.price} د.ل</Text>
                  </Col>
                  <Col span={6}>
                    <Image
                      src={IMAGE_URL + `images/${item.Product.ProductImages[0].imageUrl}`}
                      alt={item.Product.TradeName}
                      width={80}
                      height={80}
                      style={{ borderRadius: '8px' }}
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </div>
      )}
    </Modal>
    </div>
  );
};

export default Orders;
