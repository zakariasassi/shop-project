import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Input, Button, Space, DatePicker } from 'antd';
import axios from 'axios';
import { URL } from '../../constants/URL';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const TopSoldProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([dayjs().startOf('year'), dayjs()]);

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}reports/gettopsellingproducts?from=${startDate}&to=${endDate}`  , {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      fetchData(startDate, endDate);
    }
  };

  useEffect(() => {
    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');
    fetchData(startDate, endDate);
  }, [dates]);

  const columns = [
    {
      title: 'Product Name',
      dataIndex: ['Product', 'TradeName'],
      key: 'productName',
    },
    {
      title: 'Total Quantity Sold',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: 'Price',
      dataIndex: ['Product', 'price'],
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Details',
      key: 'details',
      render: (text, record) => (
        <Card title={record.Product.TradeName} style={{ width: '100%' }}>
          <p><strong>Scientific Name:</strong> {record.Product.ScientificName}</p>
          <p><strong>Price:</strong> ${record.Product.price}</p>
          <p><strong>Discount:</strong> {record.Product.discountPercentage}%</p>
          <p><strong>Availability:</strong> {record.Product.availability ? 'Available' : 'Not Available'}</p>
        </Card>
      ),
    },
  ];

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ marginBottom: '20px' }}>
        <RangePicker
          defaultValue={dates}
          format="YYYY-MM-DD"
          onChange={handleDateChange}
        />
        <Button type="primary" onClick={() => handleDateChange(dates)}>Fetch Data</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="ProductId"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TopSoldProducts;
