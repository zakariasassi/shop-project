import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, Input, Select, Button, Upload, Row, Col, message } from "antd";
import { MdOutlinePriceChange } from "react-icons/md";
import { getMainCategories } from "../../../api/MainCategory";
import { getSubCategories } from "../../../api/SubCategory";
import { getBrandCategories } from "../../../api/BrandCategory";
import { createProducts } from "../../../api/Products";
import { permissionsAtom, rolesAtom } from "../../../state/rolesAtom";
import { useAtom } from "jotai";
import LoadingOverlay from 'react-loading-overlay';
import Loading from './../../../components/Loading/Loading';

const { TextArea } = Input;
const { Option } = Select;

function CreateProduct() {


  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);

  const hasRole = (roleName) => roles.some((role) => role.role_name === roleName);
  const hasPermission = (permissionName) => permissions.includes(permissionName);



  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [productData, setProductData] = useState({
    TradeName: "",
    prodcutCode: "",
    price: "",
    PackageType: "",
    Size: "",
    shortDescription: "",
    fullDescription: "",
    howUse: "",
    images: [],
    MainCategoryId: "",
    SubCategoryId: "",
    BrandCategoryId: "",
  });

  // Fetch main-categories
  const {
    data: Maincategories,
    isLoading: LoadingMaincategories,
    error: errorMaincategories,
  } = useQuery({
    queryKey: ["categories", "main-category"],
    queryFn: ({ queryKey }) => getMainCategories(queryKey[1]),
  });

  // Fetch sub-categories
  const {
    data: SubCategorys,
    isLoading: LoadingSubCategories,
    error: errorSubCategories,
  } = useQuery({
    queryKey: ["categories", "sub-category"],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  // Fetch brand-categories
  const {
    data: Brandcategories,
    isLoading: LoadingBrandcategories,
    error: errorBrandcategories,
  } = useQuery({
    queryKey: ["categories", "brand-category"],
    queryFn: ({ queryKey }) => getBrandCategories(queryKey[1]),
  });

  const handleInputsChanges = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, name) => {
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (info) => {
    setProductData((prevState) => ({
      ...prevState,
      images: info.fileList,
    }));
  };

  const createProductMutation = useMutation(createProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products", "product"]);
      message.success("Product created successfully!");
    },
    onError: () => {
      message.error("Error creating product.");
    },
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("TradeName", productData.TradeName);
    formData.append("prodcutCode", productData.prodcutCode);
    formData.append("price", productData.price);
    formData.append("PackageType", productData.PackageType);
    formData.append("Size", productData.Size);
    formData.append("shortDescription", productData.shortDescription);
    formData.append("fullDescription", productData.fullDescription);
    formData.append("howUse", productData.howUse);
    formData.append("MainCategoryId", productData.MainCategoryId);
    formData.append("SubCategoryId", productData.SubCategoryId);
    formData.append("BrandCategoryId", productData.BrandCategoryId);

    if (productData.images) {
      productData.images.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }

    createProductMutation.mutate({ data: formData, point: "product" });
  };

  if ( createProductMutation.isLoading || LoadingMaincategories || LoadingSubCategories || LoadingBrandcategories)
    return (
        <>
          <Loading/>
        </>
    );
  if (errorMaincategories || errorSubCategories || errorBrandcategories)
    return <div>Error loading categories</div>;

  return (

    <>

        <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={productData}
    >
      <p className="mb-3 font-bold text-teal-500">بيانات المنتج</p>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="الاسم التجاري" name="TradeName">
            <Input
              placeholder=" الاسم التجاري"
              value={productData.TradeName}
              onChange={handleInputsChanges}
              name="TradeName"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="كود المنتج" name="prodcutCode">
            <Input
              type="number"
              placeholder="كود المنتج"
              value={productData.prodcutCode}
              onChange={handleInputsChanges}
              name="prodcutCode"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="التصنيف الرئيسي" name="MainCategoryId">
            <Select
              placeholder="التصنيف الرئيسي"
              onChange={(value) =>
                handleSelectChange(value, "MainCategoryId")
              }
              value={productData.MainCategoryId}
            >
              {Maincategories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="التصنيف الفرعي" name="SubCategoryId">
            <Select
              placeholder="التصنيف الفرعي"
              onChange={(value) =>
                handleSelectChange(value, "SubCategoryId")
              }
              value={productData.SubCategoryId}
            >
              {SubCategorys?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="العلامة التجارية" name="BrandCategoryId">
            <Select
              placeholder="العلامة التجارية"
              onChange={(value) =>
                handleSelectChange(value, "BrandCategoryId")
              }
              value={productData.BrandCategoryId}
            >
              {Brandcategories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="سعر المنتج" name="price">
            <Input
              prefix={<MdOutlinePriceChange />}
              type="number"
              placeholder="سعر المنتج"
              value={productData.price}
              onChange={handleInputsChanges}
              name="price"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="نوع التعبئة" name="PackageType">
            <Select
              placeholder="نوع التعبئة"
              onChange={(value) => handleSelectChange(value, "PackageType")}
              value={productData.PackageType}
            >
              <Option value="عبوة ">عبوة </Option>
              <Option value="كيس">كيس</Option>
              <Option value="شريط ">شريط </Option>
              <Option value="باكو">باكو</Option>
              <Option value="قطعة ">قطعة </Option>
              <Option value="أنبول ">أنبول </Option>
              <Option value="كبسولة">كبسولة</Option>
              <Option value="حبة">حبة</Option>
              <Option value="علبة">علبة</Option>

            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="الحجم" name="Size">
            <Select
              placeholder="الحجم"
              onChange={(value) => handleSelectChange(value, "Size")}
              value={productData.Size}
            >
              <Option value="350ml">صغير</Option>
              <Option value="200ml">متوسط</Option>
              <Option value="150ml">كبير</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <p className="mb-3 font-bold text-teal-500">تفاصيل المنتج</p>
      <Form.Item label="وصف مختصر للمنتج" name="shortDescription">
        <TextArea
          placeholder="وصف مختصر للمنتج"
          value={productData.shortDescription}
          onChange={handleInputsChanges}
          name="shortDescription"
        />
      </Form.Item>
      <Form.Item label="وصف تام للمنتج" name="fullDescription">
        <TextArea
          placeholder="وصف تام للمنتج"
          value={productData.fullDescription}
          onChange={handleInputsChanges}
          name="fullDescription"
        />
      </Form.Item>
      <Form.Item label="مكونات المنتج" name="howUse">
        <TextArea
          placeholder="مكونات المنتج"
          value={productData.howUse}
          onChange={handleInputsChanges}
          name="howUse"
        />
      </Form.Item>
      <Form.Item label="صور المنتج">
        <Upload
          multiple
          listType="picture"
          beforeUpload={() => false}
          onChange={handleFileChange}
          fileList={productData.images}
        >
          <Button>تحميل الصور</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
      <Button
  disabled={createProductMutation.isLoading}
  loading={createProductMutation.isLoading}
  type="primary"
  htmlType="submit"
>
  إنشاء المنتج
</Button>

      </Form.Item>
    </Form>
    </>

  );
}

export default CreateProduct;
