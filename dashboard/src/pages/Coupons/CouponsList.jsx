import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import UpdateCoupon from './UpdateCoupons';
import { URL } from '../../constants/URL';
import Loading from '../../components/Loading/Loading';



const token = window.localStorage.getItem('token');



const fetchCoupons = async () => {
  const { data } = await axios.get(URL + 'coupons' , {
    headers : {
      authorization: `Bearer ` + token,

    }
  });
  return data;
};


const CouponList = () => {
  const queryClient = useQueryClient();
  const { data: coupons, isLoading } = useQuery('coupons', fetchCoupons);

  const deleteMutation = useMutation(
    (id) => axios.delete(URL + `coupons/${id}` , {
      headers : {
        authorization: `Bearer ` + token,

      }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('coupons');
      },
    }
  );

  if (isLoading) return <div><Loading/></div>;

  return (
    <div className="p-4" dir='rtl'>
      <h2 className="mb-4 text-lg font-bold">Coupons List</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-center bg-gray-200">
              <th className="px-4 py-2 ">الرمز</th>
              <th className="px-4 py-2 ">النسبة (%)</th>
              <th className="px-4 py-2 ">تاريخ الانتهاء</th>
              <th className='px-4 py-2'>الحالة</th>
              <th className="px-4 py-2 ">اجراء</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="text-center border-b">
                <td className="px-4 py-2">{coupon.code}</td>
                <td className="px-4 py-2">{coupon.discountPercentage}%</td>
                <td className="px-4 py-2">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                <td className={`px-4 py-2 ${coupon.isActive? 'text-green-500' : 'text-red-500'}`}>{coupon.isActive? 'مفعل' : 'غير مفعل'}</td>
                <td className="flex justify-center gap-3 px-4 py-2">
                  <div className="flex justify-center gap-3 space-x-2">
                    <UpdateCoupon coupon={coupon} />
                    <button
                      onClick={() => deleteMutation.mutate(coupon.id)}
                      className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      حدف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponList;
