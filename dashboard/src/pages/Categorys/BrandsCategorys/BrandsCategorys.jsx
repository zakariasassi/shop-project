import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getSubCategories } from '../../../api/SubCategory';
import {
  getBrandCategories,
  createBrandCategories,
  updateBrandCategories,
  deleteBrandCategories,
} from '../../../api/BrandCategory';
import moment from 'moment';
import { IMAGE_URL } from '../../../constants/URL';
import Loading from '../../../components/Loading/Loading';
import {
  Input,
  Select,
  Button,
  Table,
  Upload,
  Modal,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';

const { Option } = Select;

function BrandsCategorys() {
  const [categoryName, setCategoryName] = React.useState('');
  const [logo, setLogo] = React.useState(null);
  const [subcategoryID, setSubCateogryID] = React.useState('');
  const [currentEdit, setCurrentEdit] = React.useState(null);
  const [updatedName, setUpdatedName] = React.useState('');
  const [updatedsubcategoryID, setUpdatedsSubCateogryID] = React.useState('');

  const startEditing = (category) => {
    setCurrentEdit(category);
    setUpdatedName(category.name);
    setUpdatedsSubCateogryID(category.SubCategoryId);
  };

  const queryClient = useQueryClient();

  // Fetch brand categories
  const { data: Brandcategories, isLoading: LoadingBrandcategories, error: errorBrandcategories } = useQuery({
    queryKey: ['categories', 'brand-category'],
    queryFn: ({ queryKey }) => getBrandCategories(queryKey[1]),
  });

  // Fetch sub-categories
  const { data: SubCategorys, isLoading: LoadingSubCategories, error: errorSubCategories } = useQuery({
    queryKey: ['categories', 'sub-category'],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  const createCategoryMutation = useMutation(createBrandCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', 'brand-category']);
      setCategoryName('');
      setLogo(null);
      setSubCateogryID('');
    },
  });

  const updateCategoryMutation = useMutation(updateBrandCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', 'brand-category']);
      setCurrentEdit(null);
      setUpdatedName('');
      setUpdatedsSubCateogryID('');
    },
  });

  const deleteCategoryMutation = useMutation(deleteBrandCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', 'brand-category']);
    },
  });

  const handleCreateCategory = () => {
    const data = new FormData();
    data.append('name', categoryName);
    data.append('SubCategoryId', subcategoryID);
    data.append('logo', logo);

    createCategoryMutation.mutate({ data, point: 'brand-category' });
  };

  const handleUpdateCategory = () => {
    if (currentEdit) {
      updateCategoryMutation.mutate({
        id: currentEdit.id,
        updated: {
          name: updatedName,
          SubCategoryId: updatedsubcategoryID,
        },
        point: 'brand-category',
      });
    }
  };

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation.mutate({ id, point: 'brand-category' });
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
      title: 'اسم العلامة',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'الشعار',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img className="object-cover w-10 h-10 rounded-full" src={IMAGE_URL + `brands/${record.image}`} alt="Logo" />
      ),
    },
    {
      title: 'التصنيف الفرعي',
      dataIndex: 'SubCategory',
      key: 'SubCategory',
      render: (subCategory) => subCategory.name,
    },
    {
      title: 'تاريخ الاضافة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'تاريخ التعديل',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'اجراء',
      key: 'action',
      render: (text, record) => (
        <div>
          <Popconfirm
            title="هل تريد حذف هذا العنصر؟"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => startEditing(record)}
          />
          {/* <Button icon={<StopOutlined />} type="text" /> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="ادخل اسم العلامة التجارية"
          />
          <Select
            onChange={(value) => setSubCateogryID(value)}
            placeholder="التصنيف الفرعي"
            style={{ width: '100%' }}
          >
            {SubCategorys.map((index, key) => (
              <Option key={key} value={index.id}>{index.name}</Option>
            ))}
          </Select>
          <Upload
            beforeUpload={(file) => {
              setLogo(file);
              return false; // Prevent auto upload
            }}
          >
            <Button>اختر شعار</Button>
          </Upload>
          <Button
            onClick={handleCreateCategory}
            type="primary"
            style={{ backgroundColor: '#fadb14' }}
          >
            اضافة
          </Button>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Table
          columns={columns}
          dataSource={Brandcategories}
          rowKey="id"
          pagination={false}
        />
      </div>

      {currentEdit && (
        <Modal
          title="تعديل التصنيف"
          visible={true}
          onOk={handleUpdateCategory}
          onCancel={() => setCurrentEdit(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              onChange={(e) => setUpdatedName(e.target.value)}
              value={updatedName}
              placeholder="اسم جديد للتصنيف"
            />
            <Select
              onChange={(value) => setUpdatedsSubCateogryID(value)}
              placeholder="التصنيف الفرعي"
              style={{ width: '100%' }}
            >
              {SubCategorys?.map((index, key) => (
                <Option key={key} value={index.id}>{index.name}</Option>
              ))}
            </Select>
          </div>
        </Modal>
      )}
    </>
  );
}

export default BrandsCategorys;
