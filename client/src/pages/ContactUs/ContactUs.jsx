import React from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, message } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { URL } from '../../constant/URL';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ContactUs = () => {
  const token = window.localStorage.getItem('token');
  
  const onFinish = async (values) => {
    try {
      // Send form data to the backend
      const response = await axios.post( URL +  '/api/contactus', values, {
        headers: {
          'Content-Type': 'application/json',
          authorization : 'Bearer ' + token
        },
      });
      message.success(response.data.message);
    } catch (error) {
      console.error('Error submitting the form:', error);
      message.error('Failed to send the message. Please try again later.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          اتصل بنا
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Text strong>عنوان المكتب:</Text>
              <Text block>123 شارع الأزهار, طرابلس</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <PhoneOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Text strong>الهاتف:</Text>
              <Text block>+218 91 123 4567</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Text strong>البريد الإلكتروني:</Text>
              <Text block>info@example.com</Text>
            </Card>
          </Col>
        </Row>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <Form.Item
            label="الاسم الكامل"
            name="fullName"
            rules={[{ required: true, message: 'يرجى إدخال اسمك الكامل!' }]}
          >
            <Input placeholder="أدخل اسمك الكامل" />
          </Form.Item>

          <Form.Item
            label="البريد الإلكتروني"
            name="email"
            rules={[
              { required: true, message: 'يرجى إدخال بريدك الإلكتروني!' },
              { type: 'email', message: 'يرجى إدخال بريد إلكتروني صالح!' },
            ]}
          >
            <Input placeholder="أدخل بريدك الإلكتروني" />
          </Form.Item>

          <Form.Item
            label="رسالتك"
            name="message"
            rules={[{ required: true, message: 'يرجى إدخال رسالتك!' }]}
          >
            <TextArea rows={4} placeholder="أدخل رسالتك" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              إرسال الرسالة
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactUs;
