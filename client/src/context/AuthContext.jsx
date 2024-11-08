import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constant/URL';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
const token = localStorage.getItem('token');

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setLogin] = useState(window.localStorage.getItem('isLogin'));

  const [user , setUser] = useState(window.localStorage.getItem('user'))

  const login = async (phoneNumber, password) => {
    try {
      const response = await axios.post(URL + 'customer/login', {
        phoneNumber,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('isLogin', true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setLogin(true);
      navigate('/home');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error; // Rethrow the error to handle it in the component
    }
  };

  const jwtCheck = async () => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage

    // If no token, navigate to login
    if (!token) {
      console.log("No token found");
      setLogin(false);
      navigate('/login');
      return; // Stop further execution
    }

    try {
      const response = await axios.get(URL + 'customer/check', {
        headers: {
          authorization: `Bearer ` + token,
        },
      });

      // If the response status is not 200, handle it
      if (response.status !== 200) {
        setLogin(false);
        localStorage.clear(); // Clear storage if the token is invalid
        navigate('/login');
      }
    } catch (error) {
      console.log('JWT check error:', error);
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
        setLogin(false);
        localStorage.clear(); // Clear storage for these errors
        navigate('/login');
      }
    }
  };

  // Check token on component mount
  useEffect(() => {
    jwtCheck(); // Run jwtCheck when the component is mounted
  }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, jwtCheck , user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
