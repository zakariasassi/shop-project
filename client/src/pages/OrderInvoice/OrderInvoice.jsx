

import React, { useEffect } from 'react';

const OrderInvoice = ({ orderData }) => {
    
  const handlePrint = () => {
    window.print();
  };



  const calculateTotalAmount = () => {
    return orderData.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container p-6 mx-auto bg-white border rounded-lg shadow-md" dir='rtl'>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">فاتورة الطلب</h1>
        <p className="text-lg text-gray-600">رقم الطلب: {orderData?.OrderId || 'غير معروف'}</p>
      </div>

      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-gray-600">المنتج</th>
            <th className="px-4 py-2 text-gray-600">الكمية</th>
            <th className="px-4 py-2 text-gray-600">السعر</th>
            <th className="px-4 py-2 text-gray-600">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {orderData?.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border-b">
                <div className="flex items-center">
                  <img src={`http://localhost:3000/images/${item.Product.images.split(',')[0]}`} alt={item.Product.TradeName} className="object-cover w-16 h-16 mr-4 rounded" />
                  <div>
                    <p className="font-semibold text-gray-800">{item.Product.TradeName}</p>
                    <p className="text-gray-600">{item.Product.shortDescription}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 text-center border-b">{item.quantity}</td>
              <td className="px-4 py-2 text-center border-b">${item.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-center border-b">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="text-xl font-bold">
          <p>المجموع الكلي: ${calculateTotalAmount().toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button onClick={handlePrint} className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600">
          طباعة الفاتورة
        </button>
      </div>
    </div>
  );
};

export default OrderInvoice;
