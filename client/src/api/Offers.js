import axios from 'axios';
import { URL } from '../constant/URL';


// Get all categories
export const getallofferProudacts = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

try {
    const response = await axios.get(URL + point ,  {

        headers: {
          authorization: `Bearer ` + token,
        },
      });
      return response.data;
} catch (error) {
    console.log(error);
}
};
