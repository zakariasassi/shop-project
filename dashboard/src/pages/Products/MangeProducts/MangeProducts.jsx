import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdDiscount } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import ProductDetail from "../../../components/ProductDetails/ProductDetail";
import { IMAGE_URL, URL } from "../../../constants/URL";
import { permissionsAtom, rolesAtom } from "../../../state/rolesAtom";
import { deleteProducts, getProducts, updateProducts } from "../../../api/Products";
import { getMainCategories } from "../../../api/MainCategory";
import { getSubCategories } from "../../../api/SubCategory";
import { getBrandCategories } from "../../../api/BrandCategory";
import { Modal, Form, InputNumber } from 'antd';

function MangeProducts() {
  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [prodactsResulte , setProductsResulte] = useState([]);
  const [productData, setProductData] = useState({
    TradeName: "",
    ScientificName: "",
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hasRole = (roleName) => roles.some((role) => role.role_name === roleName);

  const { data: Products, isLoading: LoadingProducts } = useQuery({
    
    queryKey: ["products", "product"],
    queryFn: ({ queryKey }) => getProducts(queryKey[1], queryKey[2]),

  });

  useEffect(() => {
    setProductsResulte(Products)

  },[Products])

  const { data: MaincategoriesUpdate } = useQuery({
    queryKey: ["categories", "main-category"],
    queryFn: ({ queryKey }) => getMainCategories(queryKey[1]),
  });

  const { data: SubCategorysUpdate } = useQuery({
    queryKey: ["categories", "sub-category"],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  const { data: BrandcategoriesUpdate } = useQuery({
    queryKey: ["categories", "brand-category"],
    queryFn: ({ queryKey }) => getBrandCategories(queryKey[1]),
  });

  const deleteCategoryMutation = useMutation(deleteProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products", "product"]);
      toast.success("Product deleted successfully");
    },
  });

  const updateCategoryMutation = useMutation(updateProducts, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products", "product"]);
      toast.success("Product updated successfully");
      setCurrentEdit(null);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation.mutate({ id, point: "product" });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prev) => ({ ...prev, images: files }));
  };
  
  const handleUpdate = () => {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'images') {
        formData.append(key, value);
      }
    });


    if(productData.images != Products.ProductImages){
      productData.images.forEach((file) => {
        formData.append('images', file); // Appending files directly
      });
    }
 
  
    updateCategoryMutation.mutate({
      id: currentEdit.id,
      updated: formData,
      point: "product",
    });
  }



   const handelFilterProducts = () => {
      console.log(prodactsResulte);
   }
  

  const handleInputsChanges = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (product) => {
    setCurrentEdit(product);
    setProductData(product);
  };

  const handleStatusChange = (e, id) => {
    updateCategoryMutation.mutate({
      id,
      updated: { availability: e.target.value },
      point: "product/state",
    });
  };

  const [open, setOpen] = useState(false);

  const handelShowDiscount =  (product) => {
    setSelectedProduct(product);
    setOpen(true);
  }


  const applayDiscount = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        URL + `product/discount`,
        {
          discontValue: discount,
          productID: selectedProduct.id,
        },
        {
          headers: {
            authorization: `Bearer ` + token,
          },
        }
      )
      .then(() => {
        toast.success("Discount applied successfully");
        setOpen(false);
        queryClient.invalidateQueries(["products", "product"]);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };


  
  if (LoadingProducts) return <div className="flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <div className="container p-5 mx-auto">
      <div className="flex justify-between mb-5">
        {hasRole("suber user") && (
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => navigate("/create-product")}
          >
            اضافة منتج جديد
          </button>
        )}
      </div>

      <div className="w-full">
        <div>
          <input onChange={handelFilterProducts}  className="w-2/5 p-2 border rounded " placeholder="الاسم التجاري" />
        </div>

      </div>

      <table className="min-w-full ">
        <thead>
          <tr>
            <th className="p-2 ">الاسم التجاري</th>
            <th className="p-2 ">الكود </th>
            <th className="p-2 ">السعر</th>
            <th className="p-2 ">تاريخ الاضافة</th>
            <th className="p-2 ">تاريخ التعديل</th>
            <th className="p-2 ">التصنيف الرئيسي</th>
            <th className="p-2 ">التصنيف الفرعي</th>
            <th className="p-2 ">العلامة التجارية</th>
            {(hasRole('suber user') || hasRole("items inserter one")) && (
              <th className="p-2 ">متوفر \ غير متوفر</th>
            )}
            <th className="p-2 ">الخصم</th>
            <th className="p-2 ">اجراء</th>
          </tr>
        </thead>
        <tbody>
          {prodactsResulte?.products.map((product) => (
            <tr key={product.id}>
              <td className="p-2 ">{product.TradeName}</td>
              <td className="p-2 ">{product.prodcutCode}</td>
              <td className="p-2 ">{product.price}</td>
              <td className="p-2 ">{moment(product.createdAt).format("YYYY-MM-DD")}</td>
              <td className="p-2 ">{moment(product.updatedAt).format("YYYY-MM-DD")}</td>
              <td className="p-2 ">{product.MainCategory.name}</td>
              <td className="p-2 ">{product.SubCategory.name}</td>
              <td className="p-2 ">{product?.BrandCategory?.name}</td>
              {(hasRole('suber user') || hasRole("items inserter one")) && (
                <td className="p-2 ">
                  <select
                    value={product.availability}
                    onChange={(e) => handleStatusChange(e, product.id)}
                    className="rounded"
                  >
                    <option value={true}>متوفر</option>
                    <option value={false}>غير متوفر</option>
                  </select>
                </td>
              )}
              <td className="p-2 ">{`${product.discountPercentage}%`}</td>
              <td className="flex p-2 space-x-2 ">
                {hasRole('suber user') && (
                  <>
                    <button
                      onClick={() => handleDeleteCategory(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDeleteForever />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDetailVisible(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <IoSearch />
                    </button>
                    <button
                      onClick={() => handelShowDiscount(product)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <MdDiscount />
                    </button>
                  </>
                )}
                <button
                  onClick={() => startEditing(product)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDetailVisible && (
        <ProductDetail
          product={selectedProduct}
          categories={MaincategoriesUpdate}
          SubCategorys={SubCategorysUpdate}
          BrandCategories={BrandcategoriesUpdate}
          onClose={() => setIsDetailVisible(false)}
        />
      )}


<Modal
        title="Apply Discount"
        open={open}
        onOk={applayDiscount}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Discount Percentage">
            <InputNumber
              min={0}
              max={100}
              value={discount}
              onChange={(value) => setDiscount(value)}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {currentEdit && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
    <div className="w-full max-w-4xl p-5 bg-white rounded shadow-lg">
      <h2 className="mb-4 text-xl">تعديل المنتج</h2>
      <div className="max-h-[70vh] overflow-y-auto p-3">
        <p className="mb-3 font-bold text-teal-500">بيانات المنتج</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">الاسم التجاري</label>
            <input
              type="text"
              name="TradeName"
              value={productData.TradeName}
              onChange={handleInputsChanges}
              placeholder="الاسم التجاري"
              className="w-full p-2 mb-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">الاسم العلمي</label>
            <input
              type="text"
              name="ScientificName"
              value={productData.ScientificName}
              onChange={handleInputsChanges}
              placeholder="الاسم العلمي"
              className="w-full p-2 mb-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">التصنيف الرئيسي</label>
            <select
              name="MainCategoryId"
              onChange={handleInputsChanges}
              value={productData.MainCategoryId}
              className="w-full p-2 mb-2 rounded"
            >
              {MaincategoriesUpdate?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">التصنيف الفرعي</label>
            <select
              name="SubCategoryId"
              onChange={handleInputsChanges}
              value={productData.SubCategoryId}
              className="w-full p-2 mb-2 rounded"
            >
              {SubCategorysUpdate?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">العلامة التجارية</label>
            <select
              name="BrandCategoryId"
              onChange={handleInputsChanges}
              value={productData.BrandCategoryId}
              className="w-full p-2 mb-2 rounded"
            >
              {BrandcategoriesUpdate?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">سعر المنتج</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputsChanges}
              placeholder="السعر"
              className="w-full p-2 mb-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">نوع التعبئة</label>
            <select
              name="PackageType"
              onChange={handleInputsChanges}
              value={productData.PackageType}
              className="w-full p-2 mb-2 rounded"
            >
              <option value="1">اقراص</option>
              <option value="2">كبسولة</option>
              <option value="3">محلول</option>
              <option value="4">عبوة دوائية</option>
              <option value="5">زجاجة</option>
              <option value="6">محلول</option>
              <option value="7">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">الحجم</label>
            <select
              name="Size"
              onChange={handleInputsChanges}
              value={productData.Size}
              className="w-full p-2 mb-2 rounded"
            >
              <option value="350ml">350ml</option>
              <option value="200ml">200ml</option>
              <option value="150ml">150ml</option>
            </select>
          </div>
        </div>

        <p className="mb-3 font-bold text-teal-500">تفاصيل المنتج</p>
        <div className="mb-4">
          <label className="block mb-1">وصف مختصر للمنتج</label>
          <textarea
            name="shortDescription"
            value={productData.shortDescription}
            onChange={handleInputsChanges}
            placeholder="وصف مختصر"
            className="w-full p-2 mb-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">وصف تام للمنتج</label>
          <textarea
            name="fullDescription"
            value={productData.fullDescription}
            onChange={handleInputsChanges}
            placeholder="وصف كامل"
            className="w-full p-2 mb-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">طريقة الاستعمال</label>
          <textarea
            name="howUse"
            value={productData.howUse}
            onChange={handleInputsChanges}
            placeholder="كيفية الاستخدام"
            className="w-full p-2 mb-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">صور المنتج</label>
          <input
            type="file"
            onChange={handleFileUpload}
            multiple
            className="w-full p-2 mb-2 rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            حفظ التعديلات
          </button>
          <button
            type="button"
            onClick={() => setCurrentEdit(null)}
            className="px-4 py-2 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            إلغاء
          </button>
        </div>
      
</div>
    
    </div>
  </div>
)}

    </div>
  );
}



export default MangeProducts;



