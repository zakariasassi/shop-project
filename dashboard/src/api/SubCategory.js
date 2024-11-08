import axios from "axios";
import { URL } from "../constants/URL";

const token = localStorage.getItem("token"); // Retrieve token from localStorage

// Get all
export const getSubCategories = async (point) => {
  const response = await axios.get(URL + point, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Create
export const createSubCategories = async ({ data, point }) => {
  console.log(data);
  const response = await axios.post(URL + point, data, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update a
export const updategetSubCategories = async ({ id, updated, point }) => {

  console.log(id , updated);
  const response = await axios.put(`${URL}${point}/${id}`, updated, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Delete
export const deletegetSubCategories = async ({ id, point }) => {
  const response = await axios.delete(`${URL}${point}/${id}`, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};
