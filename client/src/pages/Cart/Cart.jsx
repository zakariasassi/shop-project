import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { countCart } from "../../state/atom/cartAtom";
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { fetchCartItems, deleteProduct, updateQuantityInBackend } from '../../api/Products';
import { IMAGE_URL } from "../../constant/URL";

const Cart = () => {
  const navigate = useNavigate();
  const [count, setCount] = useAtom(countCart);
  const queryClient = useQueryClient();
  const [dataitems, setDataItems] = useState([]);
  const [updateDataLoading, setUpdateDataLoading] = useState(false);
  const [total, setTotal] = useState('');

  // Fetch cart items and set total
  const { data: cartItems = [], isLoading: fetchData, error, refetch } = useQuery('cartItems', fetchCartItems, {
    initialData: [],
    onError: (error) => {
      console.error('Error fetching cart items');
    },
    onSuccess: (cartItems) => {
      setDataItems(cartItems?.cart?.CartItems);
      calculateTotal(cartItems?.cart?.CartItems);
    }
  });

  // Calculate total price
  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      const price = (
        item.Product.price - item.Product.price * (item.Product.discountPercentage / 100)
      ).toFixed(0);
      const quantity = parseInt(item.quantity);
      if (!isNaN(price) && !isNaN(quantity)) {
        acc += price * quantity;
      }
      return acc;
    }, 0).toFixed(2);
    setTotal(newTotal);
  };

  // Remove item mutation
  const { mutate: removeItem, isLoading: loadingRemoveItem } = useMutation({
    mutationKey: 'removeCartItem',
    mutationFn: ({ productId, cartId }) => deleteProduct(productId, cartId), // Pass productId and cartId
    onSuccess: (_, { productId }) => {
      const updatedItems = dataitems.filter(i => i.Product.id !== productId);
      setDataItems(updatedItems);
      setCount(updatedItems.length);
      calculateTotal(updatedItems);

      queryClient.invalidateQueries('cartItems');
      alert('Item removed from cart');
    },
    onError: () => {
      alert('Error deleting item');
    },
  });

  // Handle remove item click
  const handleRemoveItem = (item) => {
    const productId = item.Product.id;
    const cartId = item.cartId;

    removeItem({ productId, cartId });
  };

  // Handle quantity change
  const handleQuantityChange = async (newQuantity, productId, itemId) => {
    if (newQuantity <= 0) return;

    setUpdateDataLoading(true);
    try {
      await updateQuantityInBackend(productId, newQuantity, itemId);
      setDataItems(prevItems => {
        const updatedItems = prevItems.map(item => {
          if (item.Product.id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        calculateTotal(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error updating quantity');
    } finally {
      setUpdateDataLoading(false);
    }
  };



  const handleCheckout = () => {
    cartItems.total = total
    if (!dataitems.length) {
      return alert("Please add items to your cart before checkout");
    }
    navigate('/checkout', { state: { cartItems: dataitems, data: cartItems } });
  };


  console.log(dataitems);


  if (fetchData) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container p-6 mx-auto">
      <p className="mb-6 text-xl font-bold text-center">سلة التسوق</p>
      {dataitems?.length === 0 ? (
        <p className="text-center text-gray-500">السلة لا تحتوي علي منتجات</p>
      ) : (
        <>
          {/* Table View */}
          <table className="w-full table-auto -collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 ">صورة المنتج</th>
                <th className="px-4 py-2 ">الاسم</th>
           
                <th className="px-4 py-2 ">الكمية</th>
                <th className="px-4 py-2 ">السعر</th>
                {/* <th className="px-4 py-2 ">Total</th> */}
                <th className="px-4 py-2 ">ازالة</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {dataitems?.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 ">
                    <img src={`${IMAGE_URL}images/${item.Product.ProductImages[0].imageUrl}`} alt={item.TradeName} className="w-16 h-16" />
                  </td>
                  <td className="px-4 py-2 ">{item.
Product.TradeName}</td>
          

                  {/* Quantity Control */}
                  <td className="flex items-center justify-center px-4 py-2">
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 text-gray-700 bg-gray-200 rounded"
                        onClick={() => handleQuantityChange(item.quantity - 1, item.Product.id, item.id)}
                        disabled={updateDataLoading}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 mx-2 text-center rounded"
                      />
                      <button
                        className="px-2 py-1 text-gray-700 bg-gray-200 rounded"
                        onClick={() => handleQuantityChange(item.quantity + 1, item.Product.id, item.id)}
                        disabled={updateDataLoading}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  
                  {/* Price and Total */}
                  <td className="px-4 py-2 ">
                    {item.Product.discountPercentage !== 0
                      ? (item.Product.price - (item.Product.price * (item.Product.discountPercentage / 100))).toFixed(0)
                      : item.Product.price} د.ل
                  </td>
                 

                  {/* Remove Button */}
                  <td className="flex items-center justify-center px-4 py-2 mt-3 ">
                    <button
                      className="self-center px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleRemoveItem(item)}
                      disabled={loadingRemoveItem}
                    >
                      ازالة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total and Checkout */}
          <div className="mt-8 text-right">
            <p className="text-lg font-bold">Total: {total} د.ل</p>
            <button
              className="px-6 py-2 mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              onClick={handleCheckout}
              disabled={loadingRemoveItem || updateDataLoading}
            >
              اكمال عملية الدفع
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
