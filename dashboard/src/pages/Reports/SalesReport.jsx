import React, { useState } from 'react';
import { Table, Spin, Alert, Button, DatePicker, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { URL } from '../../constants/URL';

const { RangePicker } = DatePicker;

const SalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]);

  const fetchSalesData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.get(URL +`reports/salesreport?from=${startDate}&to=${endDate}`  , {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log(response);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {


    if (dates) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      console.log(startDate , endDate);
      fetchSalesData(startDate, endDate);
    }
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
  ];

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
    </div>
  );
};

export default SalesReport;
