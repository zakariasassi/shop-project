import React from 'react';
import { FaEdit, FaStop } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMainCategories } from "../../../api/MainCategory";
import {
  getSubCategories,
  createSubCategories,
  updategetSubCategories,
  deletegetSubCategories,
} from "../../../api/SubCategory";
import moment from "moment";
import { IMAGE_URL } from '../../../constants/URL';
import Loading from '../../../components/Loading/Loading';
import {
  Input,
  Button,
  Table,
  Modal,
  Select,
  Upload,
  Form,
} from 'antd';

const { Option } = Select;

function SubCategorys() {
  const [categoryName, setCategoryName] = React.useState("");
  const [maincategoryID, setMainCateogryID] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [currentEdit, setCurrentEdit] = React.useState(null);
  const [updatedName, setUpdatedName] = React.useState("");
  const [updatedmaincategoryID, setUpdatedsMainCateogryID] = React.useState("");

  const queryClient = useQueryClient();

  // Fetch main categories
  const { data: Maincategories, isLoading: LoadingMaincategories, error: errorMaincategories } = useQuery({
    queryKey: ["categories", "main-category"],
    queryFn: ({ queryKey }) => getMainCategories(queryKey[1]),
  });

  // Fetch sub categories
  const { data: SubCategorys, isLoading: LoadingSubCategories, error: errorSubCategories } = useQuery({
    queryKey: ["categories", "sub-category"],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  const createCategoryMutation = useMutation(createSubCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "sub-category"]);
    },
  });

  const updateCategoryMutation = useMutation(updategetSubCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "sub-category"]);
    },
  });

  const deleteCategoryMutation = useMutation(deletegetSubCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", "sub-category"]);
    },
  });

  const handleCreateCategory = () => {
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('MainCategoryId', maincategoryID);
    if (image) {
      formData.append('image', image);
    }
    createCategoryMutation.mutate({ data: formData, point: "sub-category" });
    setCategoryName("");
    setMainCateogryID("");
    setImage(null);
  };

  const handleUpdateCategory = () => {
    if (currentEdit) {
      const formData = new FormData();
      formData.append('name', updatedName);
      formData.append('MainCategoryId', updatedmaincategoryID);
      if (image) {
        formData.append('image', image);
      }
      updateCategoryMutation.mutate({
        id: currentEdit.id,
        updated: formData,
        point: "sub-category",
      });
      setCurrentEdit(null);
      setUpdatedName("");
      setUpdatedsMainCateogryID("");
    }
  };

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation.mutate({ id, point: "sub-category" });
  };

  if (LoadingSubCategories) return <Loading />;
  if (errorSubCategories) return <div>Error: {errorSubCategories.message}</div>;

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'اسم التصنيف',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'التصنيف الرئيسي',
      dataIndex: 'MainCategory',
      key: 'MainCategory',
      render: (mainCategory) => mainCategory?.name,
    },
    {
      title: 'صورة',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img className='h-20 rounded-lg' src={IMAGE_URL + 'subcategory/' + image} alt={image} />
      ),
    },
    {
      title: 'تاريخ الاضافة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'تاريخ التعديل',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'من قبل',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: () => "زكريا ساسي",
    },
    {
      title: 'اجراء',
      key: 'action',
      render: (text, record) => (
        <div className="flex gap-2">
          <MdDeleteForever
            onClick={() => handleDeleteCategory(record.id)}
            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-400"
          />
          <FaEdit
            onClick={() => {
              setCurrentEdit(record);
              setUpdatedName(record.name);
              setUpdatedsMainCateogryID(record.MainCategoryId);
            }}
            className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-400"
          />
          {/* <FaStop className="w-5 h-5 text-orange-300 cursor-pointer hover:text-orange-400" /> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-4 overflow-x-auto">
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <Form layout="vertical">
            <Form.Item label="اسم التصنيف الفرعي">
              <Input
                onChange={e => setCategoryName(e.target.value)}
                value={categoryName}
                placeholder="ادخل اسم التصنيف الفرعي"
              />
            </Form.Item>
            <Form.Item label="صورة">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setImage(file);
                  return false; // Prevent automatic upload
                }}
              >
                <Button>Upload Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="التصنيف الرئيسي">
              <Select
                onChange={value => setMainCateogryID(value)}
                placeholder="التصنيف الرئيسي"
                value={maincategoryID}
              >
                {Maincategories?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={handleCreateCategory}
                type="primary"
              >
                اضافة
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Table
          columns={columns}
          dataSource={SubCategorys}
          rowKey="id"
        />
      </div>

      {currentEdit && (
        <Modal
          title="تعديل التصنيف"
          visible={true}
          onCancel={() => setCurrentEdit(null)}
          footer={[
            <Button key="cancel" onClick={() => setCurrentEdit(null)}>
              إلغاء
            </Button>,
            <Button key="submit" type="primary" onClick={handleUpdateCategory}>
              تعديل
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="اسم جديد للتصنيف">
              <Input
                onChange={(e) => setUpdatedName(e.target.value)}
                value={updatedName}
                placeholder="اسم جديد للتصنيف"
              />
            </Form.Item>
            <Form.Item label="صورة">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setImage(file);
                  return false;
                }}
              >
                <Button>تحميل صورة </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="التصنيف الرئيسي">
              <Select
                onChange={value => setUpdatedsMainCateogryID(value)}
                value={updatedmaincategoryID}
                placeholder="التصنيف الرئيسي"
              >
                {Maincategories?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default SubCategorys;
