import axios from "axios";
import { URL } from "../constants/URL";


// Get all
export const getProducts = async (point, page = 1, limit = 100) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const response = await axios.get(URL + point, {
    // params: {
    //   page,
    //   limit,
    // },
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Create
export const createProducts = async ({ data, point }) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const response = await axios.post(URL + point, data, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update a
export const updateProducts = async ({ id, updated, point }) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage


  const response = await axios.put(`${URL}${point}/${id}`, updated, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Delete
export const deleteProducts = async ({ id, point }) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const response = await axios.delete(`${URL}${point}/${id}`, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};
