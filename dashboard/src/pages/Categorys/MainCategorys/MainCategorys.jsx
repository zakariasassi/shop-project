import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { IMAGE_URL } from "../../../constants/URL";
import {
  getMainCategories,
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
} from "../../../api/MainCategory";
import moment from "moment";

function MainCategorys() {
  const [form, setForm] = useState({ name: "", image: null });
  const [currentCategory, setCurrentCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery(["categories", "main-category"], () => getMainCategories("main-category"));

  const createMutation = useMutation(createMainCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "main-category"]);
      toast.success("Category created successfully!");
      setForm({ name: "", image: null });
      setModalVisible(false);
    },
    onError: (error) => toast.error(error.response?.data?.error || "An error occurred!"),
  });

  const updateMutation = useMutation(updateMainCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "main-category"]);
      toast.success("Category updated successfully!");
      setCurrentCategory(null);
      setModalVisible(false);
    },
  });

  const deleteMutation = useMutation(deleteMainCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "main-category"]);
      toast.success("Category deleted successfully!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) {
      formData.append("image", form.image);
    }

    if (currentCategory) {
      updateMutation.mutate({ id: currentCategory.id, updatedCategory: formData, point: "main-category" });
    } else {
      createMutation.mutate({ newCategory: formData, point: "main-category" });
    }
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const columns = [
    { title: "#", key: "index", render: (_, __, index) => index + 1 },
    { title: "Category Name", dataIndex: "name", key: "name" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: (text) => moment(text).format("YYYY-MM-DD") },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt", render: (text) => moment(text).format("YYYY-MM-DD") },
    { 
      title: "Image", 
      dataIndex: "image", 
      key: "image", 
      render: (image) => <img className="object-cover w-12 h-12" src={IMAGE_URL + `mcategory/${image}`} alt="Category" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              setCurrentCategory(record);
              setForm({ name: record.name });
              setModalVisible(true);
            }}
          >
            تعديل
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => deleteMutation.mutate({ id: record.id, point: "main-category" })}
          >
            حدف
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex items-center justify-center h-screen"><span>Loading...</span></div>;

  return (
    <div className="p-6" dir="rtl"> 
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">التصنيفات الرئيسية</h2>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={() => {
            setCurrentCategory(null);
            setForm({ name: "", image: null });
            setModalVisible(true);
          }}
        >
          اضافة تصنيف جديد
        </button>
      </div>

      <table className="w-full text-right table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>اضافة</th>
            <th>تعديل</th>
            <th>الصورة</th>
            <th>اجراء</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{moment(category.createdAt).format("YYYY-MM-DD")}</td>
              <td>{moment(category.updatedAt).format("YYYY-MM-DD")}</td>
              <td><img className="object-cover w-12 h-12" src={IMAGE_URL + `mcategory/${category.image}`} alt={category.name} /></td>
              <td className="flex gap-2 space-x-2">
                <button className="text-blue-500 hover:underline" onClick={() => {
                  setCurrentCategory(category);
                  setForm({ name: category.name });
                  setModalVisible(true);
                }}>تعديل</button>
                <button className="text-red-500 hover:underline" onClick={() => deleteMutation.mutate({ id: category.id, point: "main-category" })}>
                  حدف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md">
            <h3 className="mb-4 text-lg font-medium">
              {currentCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium"> اسم التصنيف</label>
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">صورة التصنيف</label>
                <input type="file" className="w-full" onChange={handleImageChange} />
              </div>
              <div>
                <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-md">
                  {currentCategory ? "تحديث" : "اضافة"}
                </button>
              </div>
              <button type="button" className="w-full py-2 mt-2 text-white bg-gray-500 rounded-md" onClick={() => setModalVisible(false)}>
                الغاء
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainCategorys;
