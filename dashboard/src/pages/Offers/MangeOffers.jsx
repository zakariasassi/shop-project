import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { URL, IMAGE_URL } from "../../constants/URL";
import { getProducts } from "../../api/Products";
import { MdDeleteForever } from "react-icons/md";
import { FaStop } from "react-icons/fa";
import { Button, Card, Col, Row, Modal, Typography, Input, Form, Spin, Checkbox, List, Image } from "antd";

const { Title, Text } = Typography;





const token = window.localStorage.getItem('token');






const createOffer = async (offerData) => {
  const formData = new FormData();
  formData.append("title", offerData.title);
  formData.append("description", offerData.description);
  formData.append("startDate", offerData.startDate);
  formData.append("endDate", offerData.endDate);
  if (offerData.coverImage) {
    formData.append("cover", offerData.coverImage);
  }
  formData.append("discountPercentage", offerData.discountPercentage || "");
  formData.append("discountAmount", offerData.discountAmount || "");
  formData.append("productIds", JSON.stringify(offerData.productIds || []));

  const { data } = await axios.post(URL + "offers", formData, {
    headers : {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ` + token,
    }
  });
  return data;
};

const fetchOffers = async () => {
  try {
    const { data } = await axios.get(`${URL}offers/admin` , {
      headers: {
        authorization: `Bearer ` + token,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};




const deleteOffer = async (id) => {
  await axios.delete(`${URL}offers/${id}` , {
    headers : {
      authorization: `Bearer ` + token,

    }
  });
};

const activateOffer = async (id) => {
  await axios.put(`${URL}offers/activate/${id}` , {
    headers : {
      authorization: `Bearer ` + token,

    }
  });
};

const deactivateOffer = async (id) => {
  await axios.put(`${URL}offers/deactivate/${id}` , {
    headers : {
      authorization: `Bearer ` + token,

    }
  });
};





const ProductSelectionModal = ({ isOpen, onRequestClose, products = [], selectedProductIds, onSelectProduct }) => {
  console.log(products); // Log products to check its structure
  return (
    <Modal
      title="اختر المنتجات"
      open={isOpen}
      onCancel={onRequestClose}
      onOk={onRequestClose}
      width={800}
    >
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={products.products} // Ensure products is an array
        renderItem={product => (
          <List.Item>
            <Card cover={<Image src={IMAGE_URL + "images/" + product.ProductImages[0]?.imageUrl} height={200} />}>
              <Card.Meta
                title={`اسم المنتج : ${product.TradeName}`}
                description={`سعر: ${product.price} د.ل`}
              />
              <Checkbox
                checked={selectedProductIds.includes(product.id)}
                onChange={() => onSelectProduct(product.id)}
                className="mt-2"
              >
                Select
              </Checkbox>
            </Card>
          </List.Item>
        )}
      />
    </Modal>
  );
};


function ManageOffers() {

  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImage: null,
    discountPercentage: "",
    discountAmount: "",
    productIds: [],
  });


  
  const { data: offers, isLoading: offersLoading, error: offersError } = useQuery("offers", fetchOffers);
  const { data: products, isLoading: loadingProducts, error: errorLoadingProducts } = useQuery({
    queryFn: () => getProducts("product"),
    queryKey: "products",
  });



  const createMutation = useMutation(createOffer, {
    onSuccess: () => {
      queryClient.invalidateQueries("offers");
    },
  });

  const deleteMutation = useMutation(deleteOffer, {
    onSuccess: () => {
      queryClient.invalidateQueries("offers");
    },
  });

  const deactivateMutation = useMutation(deactivateOffer, {
    onSuccess: () => {
      queryClient.invalidateQueries("offers");
    },
  });

  const activateMutation = useMutation(activateOffer, {
    onSuccess: () => {
      queryClient.invalidateQueries("offers");
    },
  });


  if (offersLoading || loadingProducts) return <Spin size="large" />;
  if (offersError || errorLoadingProducts) return <div>Error: {offersError?.message || errorLoadingProducts?.message}</div>;


  

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;
    setNewOffer((prevOffer) => ({
      ...prevOffer,
      [name]: files ? files[0] : value,
      productIds:
        name === "productIds"
          ? checked
            ? [...prevOffer.productIds, value]
            : prevOffer.productIds.filter((id) => id !== value)
          : prevOffer.productIds,
    }));
  };

  const handleSelectProduct = (id) => {
    setNewOffer((prevOffer) => ({
      ...prevOffer,
      productIds: prevOffer.productIds.includes(id)
        ? prevOffer.productIds.filter((pid) => pid !== id)
        : [...prevOffer.productIds, id],
    }));
  };

  const handleSubmit = () => {
    createMutation.mutate(newOffer);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleDeactivate = (id) => {
    deactivateMutation.mutate(id);
  };

  const handleActivate = (id) => {
    activateMutation.mutate(id);
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mt-8">
        <Title level={3}>عرض جديد</Title>
        <Form layout="vertical">
          <Form.Item label="العنوان">
            <Input
              name="title"
              value={newOffer.title}
              onChange={handleChange}
              placeholder="العنوان"
            />
          </Form.Item>
          <Form.Item label="وصف">
            <Input.TextArea
              name="description"
              value={newOffer.description}
              onChange={handleChange}
              placeholder="وصف"
            />
          </Form.Item>
          <Form.Item label="صورة الغلاف">
            <Input
              type="file"
              name="coverImage"
              onChange={handleChange}
            />
          </Form.Item>
          <Button
            type="primary"
            className="mb-4"
            onClick={() => setModalOpen(true)}
          >
            اختر المنتج
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            اضافة
          </Button>
        </Form>
      </div>

      <Row gutter={16} className="mt-4">
  {offers?.map((offer) => (
    <Col span={8} key={offer.id}>
      <Card
        title={offer.title}
        // extra={offer.state ? <Text type="success">Active</Text> : <Text type="danger">Inactive</Text>}
        cover={offer.image ? <Image src={IMAGE_URL + "offers/" + offer.image} height={200} /> : null}
        actions={[
          <Button
            type="danger"
            icon={<MdDeleteForever />}
            onClick={() => handleDelete(offer.id)}
            key="delete"
          >
            حذف
          </Button>,
        ]}
      >
        <Card.Meta
          description={offer.description}
        />
      </Card>
    </Col>
  ))}
</Row>

<ProductSelectionModal
  isOpen={isModalOpen}
  onRequestClose={() => setModalOpen(false)}
  products={products}
  selectedProductIds={newOffer.productIds}
  onSelectProduct={handleSelectProduct}
/>



    </div>
  );
}

export default ManageOffers;
