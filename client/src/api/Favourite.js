// api/Customer.js
import axios from 'axios';
import { URL } from '../constant/URL';


export const addToList = async ( productId) => {

   const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.post(URL + "favourite", {
    productId : productId
  }, {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};


export const removeFromList = async (productId) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
      const response = await axios.delete(URL + `favourite/${productId}`, {
          headers: {
                    authorization: `Bearer ` + token,
          },
      
      });
      return response.data;
  } catch (error) {
      console.error("Error removing product from favourite list:", error);
      throw error;
  }
};




  export const getAllUserFavourites = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    const response = await axios.get(URL + "favourite", {
      headers: {
              authorization: `Bearer ` + token,
      },
    });
    return response.data;
  };