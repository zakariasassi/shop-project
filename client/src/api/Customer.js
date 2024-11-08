// api/Customer.js
import axios from "axios";
import { URL } from "../constant/URL";

// Retrieve token from localStorage

export const getProfile = async (point) => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get(URL + point, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

export const updateProfile = async ({ data, point }) => {
  const token = window.localStorage.getItem("token");
  const response = await axios.put(URL + point, data, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

export const getWalletBalance = async (point) => {
  const token = window.localStorage.getItem("token");
  const response = await axios.get(URL + point, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

export const chargeWallet = async ({ data, point }) => {
  const token = window.localStorage.getItem("token");
  const response = await axios.post(URL + point, data, {
    headers: {
      authorization: `Bearer ` + token,
    },
  });
  return response.data;
};
