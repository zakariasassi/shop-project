// api.js
import axios from "axios";
import { URL } from "../constants/URL";

// Fetch all customers
export const getalldoneorders = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}reports/getalldoneorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const getproductscount = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}reports/getproductscount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const getcustomerscount = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}reports/getcustomerscount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export const gettotalofsales = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}reports/gettotalofsales`, {
      headers: {
        authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};
