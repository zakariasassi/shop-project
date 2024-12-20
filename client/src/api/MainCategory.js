import axios from 'axios';
import { URL } from '../constant/URL';


// Get all categories
export const getMainCategories = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.get(URL + point ,  {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Create a new category
export const createMainCategory = async ({newCategory , point}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.post(URL + point, newCategory ,  {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update a category
export const updateMainCategory = async ({ id, updatedCategory  , point} ) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.put(`${URL}${point}/${id}`, updatedCategory ,  {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Delete a category
export const deleteMainCategory = async ({id , point}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.delete(`${URL}${point}/${id}` ,  {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};