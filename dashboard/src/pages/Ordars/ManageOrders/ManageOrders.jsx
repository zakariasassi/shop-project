import React, { useEffect, useState } from "react";
import {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  UpdateOrderStatus,
} from "../../../api/Orders";
import moment from "moment";
import { FaEdit, FaStop } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast, Toaster } from "react-hot-toast";
import { URL } from "../../../constants/URL";
import Loading from "../../../components/Loading/Loading";
import { Table, Input, Button, Select, Tag, Space, Card, Typography, Popconfirm, message } from "antd";
import { permissionsAtom, rolesAtom } from "../../../state/rolesAtom";
import { useAtom } from "jotai";
import { Modal, Descriptions } from "antd";


const { Option } = Select;
const { Title, Text } = Typography;

const statusColors = {
  accepted: "green",
  pending: "gold",
  canceled: "red",
  processing: "blue",
  shipping: "purple",
  delivered: "cyan",
};

export default function ManageOrders() {
  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);


  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);



const showModal = (order) => {
  setSelectedOrder(order);
  setIsModalVisible(true);
};

const handleCancel = () => {
  setIsModalVisible(false);
  setSelectedOrder(null);
};



  const hasRole = (roleName) =>
    roles.some((role) => role.role_name === roleName);
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);

  const [orderState, setOrders] = useState([]);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomerPhone, setSearchCustomerPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", "order", page, limit],
    queryFn: ({ queryKey }) => getOrder(queryKey[1], queryKey[2], queryKey[3]),
    keepPreviousData: true,
  });

  console.log(ordersData);

  const { mutate: deleteOrderMutation, isLoading: deleteOrderLoading } = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", "order"]);
    },
  });

  const { mutate: updateOrderStatusMutation, isLoading: updateOrderStatusLoading } = useMutation(UpdateOrderStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", "order"]);
    },
  });

  const handleDeleteOrder = (id) => {
    deleteOrderMutation({ id, point: "order" });
  };

  const handelChangeStatus = (state, id) => {
    updateOrderStatusMutation({ id, state, point: "changestatus" });
  };

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData.orders);
    }
  }, [ordersData]);

  const filteredOrders = orderState?.filter((order) => {
    const matchesOrderId =
      searchOrderId === "" || order.id.toString().includes(searchOrderId);
    const matchesCustomerPhone =
      searchCustomerPhone === "" ||
      order.Customer.phone.includes(searchCustomerPhone);
    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesOrderId && matchesCustomerPhone && matchesStatus;
  });

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "رقم الطلبية",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "العميل",
      dataIndex: ["Customer", "username"],
      key: "username",
    },
    {
      title: "الاسم بالكامل",
      dataIndex: ["Customer", "fullName"],
      key: "fullName",
    },
    {
      title: "تليفون العميل",
      dataIndex: ["Customer", "phone"],
      key: "phone",
    },
    {
      title: "تاريخ الطلب",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "تفاصيل الطلبية",
      key: "details",
      render: (text, record) => (
        <Button onClick={() => showModal(record)}>عرض التفاصيل</Button>
      ),
    },
  ];
  

  if (hasRole('suber user') || hasRole('customer service one')) {
    columns.push({
      title: "تغيير الحالة",
      key: "changeStatus",
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          value={record.status}
          onChange={(value) => handelChangeStatus(value, record.id)}
        >
          <Option value="pending">انتظار</Option>
          <Option value="accepted">قبول</Option>
          <Option value="canceled">رفض</Option>
          <Option value="processing">قيد التنفيذ</Option>
          <Option value="shipping">جاري التوصيل</Option>
          <Option value="delivered">تم التوصيل</Option>
        </Select>
      )
    });
  }

  if (deleteOrderLoading || updateOrderStatusLoading || isLoading) {
    return <Loading />;
  }

  return (
    <>
       <Card className="p-4">
      <Toaster />
      <Title level={2}>إدارة الطلبات</Title>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space wrap>
          <Input
            placeholder="رقم الطلبية"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            placeholder="رقم العميل"
            value={searchCustomerPhone}
            onChange={(e) => setSearchCustomerPhone(e.target.value)}
            style={{ width: 200 }}
          />
          {(hasRole('suber user') || hasRole('customer service one')) && (
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 200 }}
              placeholder="حالة الطلبية"
            >
              <Option value="">الكل</Option>
              <Option value="pending">انتظار</Option>
              <Option value="accepted">قبول</Option>
              <Option value="canceled">رفض</Option>
              <Option value="processing">قيد التنفيذ</Option>
              <Option value="shipping">جاري التوصيل</Option>
              <Option value="delivered">تم التوصيل</Option>
            </Select>
          )}
        </Space>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: ordersData?.totalPages * limit,
            onChange: (page) => setPage(page),
            showSizeChanger: false,
          }}
        />
      </Space>
    </Card>

<Modal
title="تفاصيل الطلبية"
visible={isModalVisible}
onCancel={handleCancel}
footer={null}
width={800}
>
{selectedOrder && (
  <Descriptions bordered layout="vertical">
    <Descriptions.Item label="رقم الطلبية">
      {selectedOrder.id}
    </Descriptions.Item>
    <Descriptions.Item label="اسم العميل">
      {selectedOrder.Customer.fullName}
    </Descriptions.Item>
    <Descriptions.Item label="هاتف العميل">
      {selectedOrder.Customer.phone}
    </Descriptions.Item>
    <Descriptions.Item label="طريقة الدفع">
      {selectedOrder.paymentMethod}
    </Descriptions.Item>
    <Descriptions.Item label="الحالة">
      <Tag color={statusColors[selectedOrder.status]}>
        {selectedOrder.status}
      </Tag>
    </Descriptions.Item>
    <Descriptions.Item label="العنوان">
      {selectedOrder.Shipping.address}
    </Descriptions.Item>
    <Descriptions.Item label="مدينة الشحن">
      {selectedOrder.Shipping.city}
    </Descriptions.Item>
    <Descriptions.Item label="هاتف الشحن">
      {selectedOrder.Shipping.phone}
    </Descriptions.Item>
    <Descriptions.Item label="عناصر الطلب">
      {selectedOrder.OrderItems.map((item) => (
        <div key={item.id}>
          <p>اسم المنتج: {item.Product.TradeName}</p>
          <p>الكمية: {item.quantity}</p>
          <p>السعر: {item.price}</p>
          <hr />
        </div>
      ))}
    </Descriptions.Item>
  </Descriptions>
)}
</Modal>
    </>

  );
}

const handlePrintOrder = (order) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Order ${order.id} فاتورة</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
          }
          h1, h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .order-info, .customer-info, .items-list {
            margin-bottom: 20px;
          }
          .items-list img {
            max-width: 50px;
            height: auto;
            margin-right: 10px;
            vertical-align: middle;
          }
          .items-list ul {
            list-style: none;
            padding: 0;
          }
          .items-list li {
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <h1>Order ${order.id} تفاصيل</h1>
        <div class="order-info">
          <h2>بيانات الطلب</h2>
          <p>قيمة الفاتورة: ${order.totalAmount}</p>
          <p>الحالة: ${order.status}</p>
          <p>تاريخ الطلب: ${moment(order.createdAt).format("YYYY-MM-DD")}</p>
        </div>
        <div class="customer-info">
          <h2>بيانات العميل</h2>
          <p>الاسم: ${order.Customer.fullName}</p>
          <p>الهاتف: ${order.Customer.phone}</p>
          <p>البريد : ${order.Customer.email}</p>
        </div>
        <div class="items-list">
          <h2>المنتجات</h2>
          <ul>
            ${order.OrderItems.map(
              (item) => `
            
              <li>
                <img src="${
                  "http://localhost:3000/" +
                  "images/" +
                  item.Product.images.split(",")[0]
                }" alt="${item.Product.TradeName}" />
                <span>${item.Product.TradeName}</span> -
                <span>${item.quantity}</span> x
                <span>${item.price}</span>
              </li>
            `
            ).join("")}
          </ul>
        </div>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
