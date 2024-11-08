import axios from "axios";
import { URL } from "../constants/URL";

const token = localStorage.getItem("token"); // Retrieve token from localStorage

export const getOrder = async (point, page = 1, limit = 100) => {
  const response = await axios.get(`${URL}${point}`, {
    headers: {
          authorization: `Bearer ` + token,
    },
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

// Create
export const createOrder = async ({ data, point }) => {
  console.log(data);
  const response = await axios.post(URL + point, data, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update a
export const updateOrder = async ({ id, updated, point }) => {
  const response = await axios.put(`${URL}${point}/${id}`, updated, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Delete
export const deleteOrder = async ({ id, point }) => {
  const response = await axios.delete(`${URL}${point}/${id}`, {
    headers: {
          authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update order status
export const UpdateOrderStatus = async ({ id, state, point }) => {
  console.log(id, state, point);
  console.log(token);
  try {
    const response = await axios.post(
      `${URL}order/${point}`,
      {
        value: state,
        orderID: id,
      },
      {
        headers: {
              authorization: `Bearer ` + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating order status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
