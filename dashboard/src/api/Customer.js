// api.js
import axios from "axios";
import { URL } from "../constants/URL";

const token = localStorage.getItem("token"); // Retrieve token from localStorage

// Fetch all customers
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${URL}customer/all`, {
      headers: {
          authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

// Create a new customer
export const createCustomer = async (data) => {
  try {
    const response = await axios.post(`${URL}customer/register`, data, {
      headers: {
        "Content-Type": "application/json",
          authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create customer");
  }
};

// Update an existing customer
export const updateCustomer = async (id, data) => {
  try {
    const response = await axios.put(
      `${URL}customer/profile`,
      { id, ...data },
      {
        headers: {
          "Content-Type": "application/json",
            authorization: `Bearer ` + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update customer");
  }
};

// Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${URL}customer/${id}`, {
      headers: {
          authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete customer");
  }
};
