import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { URL } from '../../../constants/URL';
import { Table, Tag, Spin, Empty } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const fetchCards = async ({ pageParam = 1 }) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${URL}cards?page=${pageParam}&limit=50`, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return data;
};

function ManageCards() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery('cards', fetchCards, {
    getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
  });

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('cardNumber');

  const observerElem = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (observerElem.current) {
      observer.observe(observerElem.current);
    }
    return () => {
      if (observerElem.current) {
        observer.unobserve(observerElem.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <Spin size="large" />;
  if (error) return <div>Error: {error.message}</div>;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedData = data?.pages?.flatMap((page) => page.cards)?.sort((a, b) => {
    const isAscending = sortOrder === 'asc';
    switch (sortColumn) {
      case 'cardNumber':
      case 'cardType':
        return isAscending ? a[sortColumn].localeCompare(b[sortColumn]) : b[sortColumn].localeCompare(a[sortColumn]);
      case 'balance':
        return isAscending ? a.balance - b.balance : b.balance - a.balance;
      case 'expirationDate':
        return isAscending ? new Date(a.expirationDate) - new Date(b.expirationDate) : new Date(b.expirationDate) - new Date(a.expirationDate);
      case 'usedState':
      case 'state':
        return isAscending ? (a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1) : (a[sortColumn] === b[sortColumn] ? 0 : b[sortColumn] ? 1 : -1);
      default:
        return 0;
    }
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      align: 'center',
    },
    {
      title: 'رقم الكرت',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      sorter: true,
      sortOrder: sortColumn === 'cardNumber' ? sortOrder : false,
      render: (text) => (
        <span>
          {text}
          {sortColumn === 'cardNumber' && (sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      onHeaderCell: (column) => ({
        onClick: () => handleSort('cardNumber'),
      }),
    },
    {
      title: 'النوع',
      dataIndex: 'cardType',
      key: 'cardType',
      sorter: true,
      sortOrder: sortColumn === 'cardType' ? sortOrder : false,
      render: (text) => (
        <span>
          {text}
          {sortColumn === 'cardType' && (sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      onHeaderCell: (column) => ({
        onClick: () => handleSort('cardType'),
      }),
    },
    {
      title: 'القيمة',
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      sortOrder: sortColumn === 'balance' ? sortOrder : false,
      render: (text) => (
        <span>
          {text} د.ل
          {sortColumn === 'balance' && (sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      onHeaderCell: (column) => ({
        onClick: () => handleSort('balance'),
      }),
    },
    {
      title: 'حالة الاستعمال',
      dataIndex: 'usedState',
      key: 'usedState',
      render: (text) => (
        <Tag color={text ? 'red' : 'green'}>
          {text ? 'مستعمل' : 'غير مستعمل'}
        </Tag>
      ),
      sorter: true,
      sortOrder: sortColumn === 'usedState' ? sortOrder : false,
      onHeaderCell: (column) => ({
        onClick: () => handleSort('usedState'),
      }),
    },
    {
      title: 'حالة التفعيل',
      dataIndex: 'state',
      key: 'state',
      render: (text) => (
        <Tag color={text ? 'green' : 'red'}>
          {text ? 'مفعل' : 'غير مفعل'}
        </Tag>
      ),
      sorter: true,
      sortOrder: sortColumn === 'state' ? sortOrder : false,
      onHeaderCell: (column) => ({
        onClick: () => handleSort('state'),
      }),
    },
    {
      title: 'تاريخ الانتهاء',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      sorter: true,
      sortOrder: sortColumn === 'expirationDate' ? sortOrder : false,
      render: (text) => (
        <span>
          {new Date(text).toLocaleDateString()}
          {sortColumn === 'expirationDate' && (sortOrder === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
        </span>
      ),
      onHeaderCell: (column) => ({
        onClick: () => handleSort('expirationDate'),
      }),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {sortedData && sortedData.length > 0 ? (
        <div>
          <Table
            columns={columns}
            dataSource={sortedData}
            rowKey="id"
            pagination={false}
            scroll={{ x: true }}
          />
          <div ref={observerElem} />
          {isFetchingNextPage && <Spin size="large" />}
        </div>
      ) : (
        <Empty description="لا توجد كروت." />
      )}
    </div>
  );
}

export default ManageCards;
