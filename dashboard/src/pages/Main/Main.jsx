import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FaDollarSign, FaUserFriends, FaBoxOpen, FaShoppingCart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getalldoneorders, getproductscount, getcustomerscount, gettotalofsales } from '../../api/Reports';
import { useAtom } from 'jotai';
import { userAtom, rolesAtom, permissionsAtom } from '../../state/rolesAtom';
import { Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

function Main() {
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const [permissions] = useAtom(permissionsAtom);

  const [orderData, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);

  const { data: DoneOrders, isLoading: LoadingDoneOrders, error: errorDoneOrders } = useQuery('orders', getalldoneorders);
  const { data: productCountData, isLoading: LoadingProductsCount, error: errorProductsCount } = useQuery('product', getproductscount);
  const { data: customerCount, isLoading: LoadingCustomerCount, error: errorCustomerCount } = useQuery('customer', getcustomerscount);
  const { data: totalSales, isLoading: LoadingTotalSales, error: errorTotalSales } = useQuery('sales', gettotalofsales);

  const filterStatus = (state) => {
    const result = orderData?.find(order => order?.status === state);
    return result ? result?.count : 0;
  };

  useEffect(() => {
    setOrders(DoneOrders);
    setProductCount(productCountData);
  }, [DoneOrders, productCountData]);

  if (LoadingDoneOrders || LoadingProductsCount || LoadingCustomerCount || LoadingTotalSales) {
    return <Spin size="large" />;
  }

  if (errorDoneOrders || errorProductsCount || errorCustomerCount || errorTotalSales) {
    return <div>Error loading data</div>;
  }

  // Sample data for charts
  const salesData = [
    { name: 'يناير', sales: 4000 },
    { name: 'فبراير', sales: 3000 },
    { name: 'مارس', sales: 2000 },
    { name: 'أبريل', sales: 2780 },
    { name: 'مايو', sales: 1890 },
    { name: 'يونيو', sales: 2390 },
    { name: 'يوليو', sales: 3490 },
  ];

  const orderStatusData = [
    { name: 'مكتملة', value: filterStatus('delivered') },
    { name: 'معلقة', value: filterStatus('pending') },
    { name: 'مرفوضة', value: filterStatus('canceled') },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-right mb-6">لوحة التحكم</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaDollarSign className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">إجمالي المبيعات</h3>
            <p className="text-2xl">{totalSales || '...'}</p>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaUserFriends className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">العملاء</h3>
            <p className="text-2xl">{customerCount || '...'}</p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-indigo-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaBoxOpen className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">المنتجات</h3>
            <p className="text-2xl">{productCount || '...'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Orders */}
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaShoppingCart className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">الطلبات المعلقة</h3>
            <p className="text-2xl">{filterStatus('pending')}</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaCheckCircle className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">الطلبات المكتملة</h3>
            <p className="text-2xl">{filterStatus('delivered')}</p>
          </div>
        </div>

        {/* Rejected Orders */}
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaTimesCircle className="w-12 h-12 mr-4" />
          <div>
            <h3 className="text-lg">الطلبات المرفوضة</h3>
            <p className="text-2xl">{filterStatus('canceled')}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Sales Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg text-right mb-4">مبيعات الشهر</h3>
          <BarChart width={500} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-1 rounded-lg shadow-lg">
          <h3 className="text-lg text-right mb-4">حالة الطلبات</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={orderStatusData}
              cx={200}
              cy={150}
              labelLine={false}
              label={entry => entry.name}
              outerRadius={80}
              fill="#252083FF"
              dataKey="value"
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#4CAF50', '#FF9800', '#F44336'][index % 3]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default Main;