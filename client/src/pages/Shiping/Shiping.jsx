import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { URL } from '../../constant/URL';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Form, Input, Button, Typography, Select } from 'antd';
import { useAtom } from 'jotai';
import { countCart } from '../../state/atom/cartAtom';

const { Option } = Select;
const { Title } = Typography;

function Shipping() {
  const [count, setCount] = useAtom(countCart);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const location = useLocation();
  const navigate = useNavigate();



  const orderDetails = location.state.orderData;
  const alldata = location.state.alldata;
  const discount = location.state.discount

  const showAlert = (data) => {
    Swal.fire({
      title: 'رصيد المحفظة غير كافي',
      text: data.message,
      icon: 'warning',
      confirmButtonText: 'موافق',
    });
  };

  const libyanCitiesArabic = [
    "طرابلس",
    "بنغازي",
    "مصراتة",
    "الزاوية",
    "زليتن",
    "الخمس",
    "طبرق",
    "اجدابيا",
    "سبها",
    "درنة",
    "البيضاء",
    "غريان",
    "المرج",
    "شحات",
    "العوينات",
    "الكفرة",
    "نالوت",
    "بني وليد",
    "سرت",
    "زنتان",
    "غات",
    "مزدة",
    "مرزق",
  ];

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    city: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${URL}order`, orderData, {
        headers: {
          authorization: `Bearer ` + token,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 402) {
        throw new Error(response.data.message || 'Payment required');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation(createOrder, {
    onSuccess: (data) => {
      orderDetails.discount = discount;
      orderDetails.data = data;
      queryClient.invalidateQueries('order');

      if (data.state === false) {
        return showAlert(data);
      }
      setCount(0)
      navigate('/order-confirmation', {
        state: { orderDetails, shippingDetails: shippingInfo, alldata },
      });
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error('Error:', error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (value) => {
    setShippingInfo((prev) => ({ ...prev, city: value }));
  };

  const handleSubmit = () => {
    setErrorMessage(''); // Clear previous error message
    mutation.mutate({
      ...orderDetails,
      shippingInfo,
      cartId: alldata.cart.id,
    });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      className="w-[80%] m-auto"
      initialValues={shippingInfo}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        تفاصيل الشحن
      </Title>
      {errorMessage && (
        <div style={{ marginBottom: '16px', color: 'red' }}>{errorMessage}</div>
      )}
      <Form.Item
        label="الاسم الكامل"
        name="fullName"
        rules={[{ required: true, message: 'الاسم الكامل مطلوب' }]}
      >
        <Input
          name="fullName"
          value={shippingInfo.fullName}
          onChange={handleChange}
          placeholder="الاسم الكامل"
        />
      </Form.Item>
      <Form.Item
        label="العنوان"
        name="address"
        rules={[{ required: true, message: 'العنوان مطلوب' }]}
      >
        <Input
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          placeholder="العنوان"
        />
      </Form.Item>
      <Form.Item
        label="رقم الهاتف"
        name="phone"
        rules={[{ required: true, message: 'رقم الهاتف مطلوب' }]}
      >
        <Input
          name="phone"
          value={shippingInfo.phone}
          onChange={handleChange}
          placeholder="رقم الهاتف"
        />
      </Form.Item>
      <Form.Item
        label="البريد الإلكتروني"
        name="email"
        rules={[
          { required: true, message: 'البريد الإلكتروني مطلوب' },
          { type: 'email', message: 'البريد الإلكتروني غير صالح' },
        ]}
      >
        <Input
          name="email"
          value={shippingInfo.email}
          onChange={handleChange}
          placeholder="البريد الإلكتروني"
        />
      </Form.Item>

      <Form.Item
        label="المدينة"
        name="city"
        rules={[{ required: true, message: 'المدينة مطلوبة' }]}
      >
        <Select
          style={{ height: '50px' }}
          placeholder="اختر المدينة"
          value={shippingInfo.city}
          onChange={handleCityChange}
        >
          {libyanCitiesArabic.map((city, index) => (
            <Option key={index} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          تأكيد الطلب
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Shipping;
