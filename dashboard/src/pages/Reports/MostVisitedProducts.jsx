import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../../constants/URL';
import moment from 'moment';

function MostVisitedProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([null, null]);



  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
      const response = await axios.get(URL + `reports/mostVisitedProducts${query}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);

    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e, index) => {
    const newDates = [...dates];
    newDates[index] = e.target.value;
    setDates(newDates);
  };

  const handleSearch = () => {
    if (dates[0] && dates[1]) {
      fetchData(moment(dates[0]).format('YYYY-MM-DD'), moment(dates[1]).format('YYYY-MM-DD'));
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Most Visited Products</h2>
      
      <div className="flex mb-4 space-x-4">
        <input
          type="date"
          onChange={(e) => handleDateChange(e, 0)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          onChange={(e) => handleDateChange(e, 1)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
       <></>
      ) : (
        <div className="overflow-x-auto">
          {/* Table */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Product ID</th>
                <th className="px-4 py-2 text-left border-b">Product Name</th>
                <th className="px-4 py-2 text-left border-b">Product Price</th>
                <th className="px-4 py-2 text-left border-b">Visit Count</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.ProductId}>
                    <td className="px-4 py-2 border-b">{row.ProductId}</td>
                    <td className="px-4 py-2 border-b">{row.ProductName}</td>
                    <td className="px-4 py-2 border-b">{row.ProductPrice}</td>
                    <td className="px-4 py-2 border-b">{row.visitCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MostVisitedProducts;
