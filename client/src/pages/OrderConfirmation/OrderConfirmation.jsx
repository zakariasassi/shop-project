import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Invoice from '../../components/Invoice/Invoice'; // Adjust the import path as needed
import { useReactToPrint } from 'react-to-print';




const OrderConfirmation = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  const location = useLocation();
  const orderDetails = location.state?.orderDetails || {};
  const shippingDetails = location.state?.shippingDetails || {};
  const alldata = location.state?.alldata || {};




  if (!orderDetails) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold text-center text-teal-600">تفاصيل الطلب</h1>
        <p className="mt-4 text-center text-gray-600">لا توجد تفاصيل متاحة.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="p-4 text-xl font-bold text-center text-teal-600">تم تاكيد الطلب وسيتم التواصل معك قريبا </h1>
      <Invoice ref={componentRef} orderDetails={orderDetails} shippingDetails={shippingDetails} alldata={alldata} />
 
      <button
        onClick={handlePrint}
        className="w-full px-4 py-2 mt-4 text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
      >
        طباعة الفاتورة
      </button>
    </div>
  );
};

export default OrderConfirmation;