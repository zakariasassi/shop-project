import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { URL } from '../../constants/URL';

const CreateCoupon = () => {

  const token = window.localStorage.getItem('token');
  
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newCoupon) => axios.post(URL + 'coupons', newCoupon , {
      headers : {
        authorization: `Bearer ` + token, // Add your token here
      }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('coupons');
      },
    }
  );

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({
      code,
      discountPercentage,
      expirationDate,
    });
    setCode('');
    setDiscountPercentage('');
    setExpirationDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-full p-4 ">
      <div className="mb-4">
        <label className="block text-gray-700">رمز الكوبون</label>
        <div className="flex">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
            required
          />
          <button
            type="button"
            onClick={generateCouponCode}
            className="px-4 py-2 text-white bg-teal-500 rounded-r-md hover:bg-teal-600"
          >
            توليد
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">نسبة الخصم</label>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">تاريخ الانتهاء</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600"
      >
       اضافة الكود
      </button>
    </form>
  );
};

export default CreateCoupon;
    