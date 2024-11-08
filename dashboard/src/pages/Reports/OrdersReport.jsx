import React, { useState } from 'react';
import { Table, Spin, Alert, Button, DatePicker, Space, Select, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { URL } from '../../constants/URL';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrdersData = async (startDate, endDate, status) => {
    try {
      setLoading(true);
      const response = await axios.get(URL + `reports/ordersreport?from=${startDate}&to=${endDate}&status=${status}` , {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleFetchData = () => {
    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');
    fetchOrdersData(startDate, endDate, status);
  };

  const handleRowClick = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleRowClick(record)}>View Items</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ marginBottom: '20px' }}>
        <RangePicker
          defaultValue={dates}
          format="YYYY-MM-DD"
          onChange={handleDateChange}
        />
        <Select
          placeholder="Select Status"
          style={{ width: 200 }}
          onChange={handleStatusChange}
        >
          <Option value="">All</Option>
          <Option value="pending">انتظار</Option>
          <Option value="accepted">قبول</Option>
          <Option value="canceled">رفض</Option>
          <Option value="processing">قيد التنفيذ</Option>
          <Option value="shipping">جاري التوصيل</Option>
          <Option value="delivered">تم التوصيل</Option>
        </Select>
        <Button type="primary" onClick={handleFetchData}>Fetch Data</Button>
      </Space>

      {loading && <Spin tip="Loading..." />}
      {error && <Alert message="Error" description={error} type="error" />}
      {!loading && !error && (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title="Order Items"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={'100%'}
      >
        {selectedOrder && selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
          <Table
            columns={[
              {
                title: 'Product ID',
                dataIndex: ['Product', 'id'],
                key: 'productId',
              },
              {
                title: 'Trade Name',
                dataIndex: ['Product', 'TradeName'],
                key: 'tradeName',
              },
              {
                title: 'Scientific Name',
                dataIndex: ['Product', 'ScientificName'],
                key: 'scientificName',
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (text) => `$${text.toFixed(2)}`,
              },
              {
                title: 'Total Price',
                key: 'totalPrice',
                render: (_, record) => `$${(record.quantity * record.price).toFixed(2)}`,
              },
            ]}
            dataSource={selectedOrder.OrderItems.map((item) => ({
              ...item,
              key: item.Product.id,
            }))}
            rowKey="Product.id"
            pagination={false}
          />
        ) : (
          <p>No items found for this order.</p>
        )}
      </Modal>
    </div>
  );
};

export default OrdersReport;
