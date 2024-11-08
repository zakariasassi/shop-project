import React from 'react'
import img from '../../assets/nodata.jpg';
function NoData() {
  return (
    <div className='flex flex-col items-center h-screen justify-center'>
        <img src={img} alt="No Data" className=" w-[200px] h-[200px]" />
        <h1 className="text-4xl text-center text-gray-700">لا يوجد بيانات</h1>
        <p className="text-center text-gray-600">الرجاء المحاولة مرة أخرى لتحميل البيانات</p>
    </div>
  )
}

export default NoData