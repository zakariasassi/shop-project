import React from 'react';
import { FaCircleNotch } from 'react-icons/fa';

function Loading() {
  return (
    <>
    <div className='w-full h-screen'>
    <div className="z-50 flex flex-col items-center ">
        <FaCircleNotch className="text-4xl text-teal-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">جاري تحميل البيانات</p>
      </div>
    <div className="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-black opacity-10 ">
    
    </div>

 
    </div>
    </>
  );
}

export default Loading;
