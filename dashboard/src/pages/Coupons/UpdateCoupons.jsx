// src/components/UpdateCoupon.js
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { URL } from '../../constants/URL';

const UpdateCoupon = ({ coupon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(coupon.code);
  const [discountPercentage, setDiscountPercentage] = useState(coupon.discountPercentage);
  const [expirationDate, setExpirationDate] = useState(coupon.expirationDate.split('T')[0]);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updatedCoupon) => axios.put( URL + `coupons/${coupon.id}`, updatedCoupon , {
      headers : {
        authorization: `Bearer ` + token,

      }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('coupons');
        setIsEditing(false);
      },
    }
  );

  const handleUpdate = () => {
    mutation.mutate({
      code,
      discountPercentage,
      expirationDate,
    });
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-md">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="px-2 py-1 mb-2 text-black border border-gray-300 rounded-md"
        />
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          className="px-2 py-1 mb-2 text-black border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="px-2 py-1 mb-2 text-black border border-gray-300 rounded-md"
        />
        <button
          onClick={handleUpdate}
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
    >
      Edit
    </button>
  );
};

export default UpdateCoupon;
