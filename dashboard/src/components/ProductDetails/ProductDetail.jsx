import React from "react";
import { Modal, Image, Descriptions, Button, Row, Col } from "antd";
import { IMAGE_URL } from "../../constants/URL";

const ProductDetail = ({ product, onClose }) => {

  return (
    <Modal
      open={true}
      footer={null}
      onCancel={onClose}
      width={1200}
      centered
      className="product-detail-modal"
    >
      <div className="product-detail-container">
        <Row gutter={16}>
          {/* Image Gallery */}
          <Col span={8}>
            <Image.PreviewGroup>
              <Image
                src={IMAGE_URL + `images/${product?.ProductImages[0]?.imageUrl}`}
                alt={product.TradeName}
                className="main-image"
                style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              />
              <div className="additional-images" style={{ marginTop: '16px' }}>
                {product?.ProductImages?.map((image, index) => (
                  <Image
                    key={index}
                    src={IMAGE_URL + `images/${image.imageUrl}`}
                    alt={`Additional image `}
                    preview={false}
                    style={{ width: '100px', height: '100px', borderRadius: '4px', marginRight: '8px' }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </Col>

          {/* Product Details */}
          <Col span={16}>
            <h2 className="product-title">{product.TradeName}</h2>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="السعر">{product.price} د.ل</Descriptions.Item>
              <Descriptions.Item label="الحجم">{product.Size}</Descriptions.Item>
              <Descriptions.Item label="الوصف القصير">{product.shortDescription}</Descriptions.Item>
              <Descriptions.Item label="الوصف كامل">{product.fullDescription}</Descriptions.Item>
              <Descriptions.Item label="الاستعمال">{product.howUse}</Descriptions.Item>
              <Descriptions.Item label="التصنيف الرئيسي">{product.MainCategory?.name}</Descriptions.Item>
              <Descriptions.Item label="التصنيف الفرعي">{product.SubCategory?.name}</Descriptions.Item>
              <Descriptions.Item label="العلامة التجارية">{product?.BrandCategory?.name}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ProductDetail;
