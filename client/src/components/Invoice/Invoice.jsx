import React, { forwardRef } from 'react';
import { Typography, Row, Col, Card, Image, Divider } from 'antd';
import { IMAGE_URL } from '../../constant/URL';

const { Title, Text } = Typography;

const Invoice = forwardRef(({ orderDetails, shippingDetails, alldata }, ref) => {
  const {
    orderId,
    paymentMethod,
    totalAmount,
    orderDate,
    items,
  } = orderDetails;

  console.log(shippingDetails);

  return (
    <div dir='rtl'  ref={ref} style={{ padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <Title level={2} style={{ textAlign: 'center' }} className='text-primary' >فاتورة الطلب</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
        <Col span={12}>
          <Card>
            <Text strong>رقم الطلب: </Text>
            <Text>{orderDetails.data.id}</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Text strong>تاريخ الطلب: </Text>
            <Text>{new Date(orderDetails.data.createdAt).toLocaleDateString()}</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
        <Col span={12}>
          <Card>
            <Text strong>طريقة الدفع: </Text>
            <Text>{paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'المحفظة الخاصة'}</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Text strong>المجموع الكلي: </Text>
            <Text>{alldata.total} د.ل</Text>
          </Card>
          <Card>
            <Text strong>المجموع بعد الخصم: </Text>
            <Text>{orderDetails.total} د.ل</Text>

          </Card>
        </Col>
      </Row>

      <Divider>تفاصيل الشحن</Divider>
      <Card style={{ marginBottom: '1rem' }}>
        <Text strong>الاسم الكامل: </Text>{shippingDetails.fullName}<br />
        <Text strong>المدينة : </Text>{shippingDetails.city}<br />
        <Text strong>العنوان: </Text>{shippingDetails.address}<br />
        <Text strong>رقم الهاتف: </Text>{shippingDetails.phone}<br />
        <Text strong>البريد الإلكتروني: </Text>{shippingDetails.email}<br />


        {/* <Text strong>طريقة الشحن: </Text>{"توصيل بري"} */}
      </Card>

      <Divider>تفاصيل العناصر</Divider>
      {items?.map((item, index) => (
        <Card key={index} style={{ marginBottom: '1rem' }}>
          <Row gutter={[16, 16]}>
            <Col span={18}>
              <Text strong>{item.TradeName}</Text><br />
              <Text>الكمية: {item.quantity}</Text><br />
              <Text>السعر: {item.price} د.ل</Text>
            </Col>
            <Col span={6}>
              <Image
                src={ IMAGE_URL +  `images/${item.Product.ProductImages[0].imageUrl}`}
                alt={item.TradeName}
                width={80}
                height={80}
                style={{ borderRadius: '8px' }}
              />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
});

export default Invoice;
