import axios from 'axios';
import { URL } from '../constant/URL';



// Function to get orders by user ID
 export const getAllByUserID = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${URL}order/user/userorders`, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch orders');
  }

  return response.data;
};