import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, DatePicker, message } from 'antd';
import moment from 'moment';
import { URL } from '../../constants/URL';
import * as XLSX from 'xlsx'; // Import XLSX library
import { saveAs } from 'file-saver'; // Import file-saver library

const { RangePicker } = DatePicker;

function SoldProductAmount() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([null, null]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
      const response = await axios.get(URL + `reports/getUnitsSoldPerProduct${query}`  , {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const handleSearch = () => {
    if (dates[0] && dates[1]) {
      fetchData(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
    } else {
      message.warning('Please select both start and end dates');
    }
  };

  const handleExport = () => {
    // Create a new workbook and add a worksheet with the table data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Units Sold Per Product');
    
    // Generate buffer and create a Blob object
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save the file using file-saver
    saveAs(fileBlob, 'UnitsSoldPerProduct.xlsx');
  };

  const columns = [
    { title: 'Product ID', dataIndex: 'ProductId', key: 'ProductId' },
    { title: 'Product Name', dataIndex: 'ProductName', key: 'ProductName' },
    { title: 'Product Price', dataIndex: 'ProductPrice', key: 'ProductPrice' },
    { title: 'Total Units Sold', dataIndex: 'totalUnitsSold', key: 'totalUnitsSold' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Units Sold Per Product</h2>
      <div style={{ marginBottom: '20px' }}>
        <RangePicker
          format="YYYY-MM-DD"
          onChange={handleDateChange}
          value={dates}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{ marginLeft: '10px' }}
        >
          Search
        </Button>
        <Button
          type="default"
          onClick={handleExport}
          style={{ marginLeft: '10px' }}
        >
          Export to Excel
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ProductId"
      />
    </div>
  );
}

export default SoldProductAmount;
