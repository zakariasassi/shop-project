import axios from 'axios';
import { URL } from '../constant/URL';


// Get all 
export const getProducts = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.get(URL + point  ,  {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Get all 
export const getLastProducts = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.get(URL + point  , {
    headers: {
            authorization: `Bearer ` + token,
    },
  } ) ;
  return response.data;
};

// Create 
export const createProducts = async ({data , point}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const responste = await axios.post(URL + point, data , {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};

// Update a
export const updateProducts = async ({ id, updated  , point} ) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  
  const response = await axios.put(`${URL}${point}/${id}`, updated , {
    headers: {
            authorization: `Bearer ` + token,
    },
  }) ;
  return response.data;
};

// Delete product item from cart
export const deleteProduct = async (productId , cartId) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
    const response = await axios.delete(`${URL}cart/remove-item?productId=${productId}&cartId=${cartId}` , {
      headers: {
              authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const addToCart = async (product) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await axios.post(`${URL}cart`, product , {
    headers: {
            authorization: `Bearer ` + token,
    },
  });
  return response.data;
};



export const fetchCartItems = async () => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}cart`, {
      headers: {
              authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching cart items: ' + error.message);
  }
};


export const updateQuantityInBackend = async (productId, newQuantity , itemId) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
    const response = await axios.put(`${URL}cart/update-quantity`, {
      productId,
      quantity: newQuantity,
      itemId: itemId
    }, {
      headers: {
              authorization: `Bearer ` + token,
      },
    });



    return response.data;

  } catch (error) {
    throw new Error('Error updating quantity: ' + error.message);
  }
};





export const getallMainCategoryProudacts = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}` + point, {
      headers: {
              authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching  items: ' + error.message);
  }
};


export const getallBrandCategoryProudacts = async (point) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  try {
    const response = await axios.get(`${URL}product/` + point, {
      headers: {
              authorization: `Bearer ` + token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching  items: ' + error.message);
  }
};