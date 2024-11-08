import axios from 'axios';
import { URL } from '../constants/URL';

// Get all admins

const token = localStorage.getItem('token'); // Retrieve token from localStorage



export const getAdmins = async (point) => {
  const response = await axios.get(URL + point , {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Create an admin
export const createAdmin = async ({ data, point }) => {
  const response = await axios.post(URL + point, data , {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update an admin
export const updateAdmin = async ({ id, updated, point }) => {
  const response = await axios.put(`${URL}${point}/${id}`, updated , {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Delete an admin
export const deleteAdmin = async ({ id, point }) => {
  const response = await axios.delete(`${URL}${point}/${id}` , {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};



export const blockUser = async ({id , point} ) => {
``
  const response = await axios.get(`${URL}${point}?id=${id}` , {
    headers: {
          authorization: `Bearer ` + token,
    },
  });

  return response.data;
};



export const unblockUser = async ({id , point} ) => {
  ``
    const response = await axios.get(`${URL}${point}?id=${id}` , {
      headers: {
            authorization: `Bearer ` + token,
      },
    });
  
    return response.data;
  };