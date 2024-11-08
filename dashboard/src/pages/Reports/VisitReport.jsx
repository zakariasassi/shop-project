import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { URL } from '../../constants/URL';

const VisitReport = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  // Handle date change
  const handleDateChange = (e, index) => {
    const newDates = [...dates];
    newDates[index] = e.target.value;
    setDates(newDates);
  };

  // Fetch report data from the server
  const fetchReport = async () => {
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) {
      alert('Please select a valid date range');
      return;
    }

    const fromDate = moment(dates[0]).format('YYYY-MM-DD');
    const toDate = moment(dates[1]).format('YYYY-MM-DD');

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(URL + 'reports/RecordVistsReport', {
        params: { fromDate, toDate },
        headers: { authorization: `Bearer ` + token },
      });
      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Failed to fetch report data');
      console.error(error);
    }
  };

  // Define columns for the table
  const columns = [
    { title: 'Visit Date', dataIndex: 'visitDate', key: 'visitDate' },
    { title: 'Visit Count', dataIndex: 'visitCount', key: 'visitCount' },
    // { title: 'IP Address', dataIndex: 'ipAddress', key: 'ipAddress' },
    { title: 'Operating System', dataIndex: 'os', key: 'os' },
    { title: 'Browser', dataIndex: 'browser', key: 'browser' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Visit Report</h2>

      <div className="flex items-center mb-4">
        <input
          type="date"
          onChange={(e) => handleDateChange(e, 0)}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          onChange={(e) => handleDateChange(e, 1)}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={fetchReport}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Report'}
        </button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2 text-center border-b">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((data) => (
                <tr key={data.id}>
                  <td className="px-4 py-2 text-center border-b">
                    {moment(data.visitDate).format('YYYY-MM-DD')}
                  </td>
                  <td className="px-4 py-2 text-center border-b">{data.visitCount}</td>
                  {/* <td className="px-4 py-2 text-center border-b">{data.ipAddress}</td> */}
                  <td className="px-4 py-2 text-center border-b">{data.os}</td>
                  <td className="px-4 py-2 text-center border-b">{data.browser}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitReport;
