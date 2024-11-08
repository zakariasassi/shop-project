import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-5 rounded-lg shadow-lg bg-white text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-8">الصفحة غير موجودة</p>
        <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها لا يمكن العثور عليها.</p>
        <Link to="/" className="text-teal-500 font-semibold hover:underline">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default Error;