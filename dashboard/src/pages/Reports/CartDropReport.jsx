import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { URL } from '../../constants/URL';
import moment from 'moment';

// Fetch function for the cart data
const fetchCartDropData = async ({ queryKey }) => {
  const [_, { from, to }] = queryKey; // Extract date range
  const { data } = await axios.get(URL + 'reports/ValueOfDropingCart', {
    params: { from, to },
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};

function CartDropReport() {
  const [dateRange, setDateRange] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  // Use the query to fetch data only when the fetchTrigger is true (on button click)
  const { data, isLoading, isError, refetch } = useQuery(
    ['cartDropData', { from: dateRange?.[0], to: dateRange?.[1] }],
    fetchCartDropData,
    {
      enabled: false, // Disable automatic fetching
      onError: () => alert('Error fetching data'),
    }
  );

  const handleFetch = () => {
    if (!dateRange) {
      alert('Please select a date range');
    } else {
      setFetchTrigger(true);
      refetch(); // Trigger data fetching
    }
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id' },
    { title: 'المستخدم', dataIndex: 'userId', key: 'userId' },
    { title: 'حالة', dataIndex: 'state', key: 'state' },
    { title: 'تاريخ الاضافة', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <p className="mb-4 text-2xl font-bold">معدل التخلي عن عربة التسوق</p>

      {/* Date range picker */}
      <div className="flex mb-4 space-x-4">
        <input
          type="date"
          onChange={(e) => setDateRange([e.target.value, dateRange?.[1]])}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          onChange={(e) => setDateRange([dateRange?.[0], e.target.value])}
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </div>

      {/* Fetch button */}
      <button
        onClick={handleFetch}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        بحث
      </button>

      {/* Loading or Error State */}
      {isLoading ? (
        <div className="flex items-center justify-center my-4">
          <div className="w-12 h-12 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></div>
        </div>
      ) : isError ? (
        <p className="mt-4 text-red-500">Error fetching data</p>
      ) : (
        <div className="mt-4">
          {/* Report Table */}
          {data?.rows?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-2 font-medium text-center border-b"
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2 text-center border-b">{row.id}</td>
                      <td className="px-4 py-2 text-center border-b">{row.userId}</td>
                      <td className="px-4 py-2 text-center border-b">{row.state}</td>
                      <td className="px-4 py-2 text-center border-b">
                        {moment(row.createdAt).format('YYYY-MM-DD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-center">No data available</p>
          )}

          {/* Abandonment Rate */}
          {data && <h3 className="mt-4 text-lg font-semibold">المعدل التقريبي للتخلي عن العربة : {data.value}%</h3>}
        </div>
      )}
    </div>
  );
}

export default CartDropReport;
