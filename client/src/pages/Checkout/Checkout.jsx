import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IMAGE_URL, URL } from '../../constant/URL';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const token = localStorage.getItem('token'); // Retrieve token from localStorage

const Checkout = () => {
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

    const location = useLocation();
    const navigate = useNavigate();

    const cartItems = location.state?.cartItems || [];
    const alldata = location.state?.data || null; // Assuming cartId is passed through location state
    const cartId = location.state?.data?.id || null; // Assuming cartId is passed through location state


    console.log(alldata);


    const showAlert = (message) => {
        Swal.fire({
            title: 'اشعار',
            text: message,
            icon: 'error',
            confirmButtonText: 'Cool'
        });
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10);

            if (isNaN(price) || isNaN(quantity)) {
                return acc;
            }

            return acc + price * quantity;
        }, 0).toFixed(2);
    };

    const handelApplyCoupon = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        try {
            const response = await axios.post(`${URL}coupons/apply`  , {
                code: couponCode,
                totalPrice: calculateSubtotal()
            }, {
                headers : {
                    authorization: `Bearer ` + token,
                }

            });

            if (response.data.state === false) {
                showAlert('رمز القسيمة غير صحيح');
                return;
            }

            setDiscount(response.data.newPrice); // Assuming this is the new total after discount
        

            if (!response) {
                throw new Error('Coupon Error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCompleateCheckout = () => {
        const orderData = {
            customerId: 1, // Replace with actual customer ID
            items: cartItems,
            cartId: cartId,
            paymentMethod: paymentMethod,
            couponCode : couponCode,
            total: discount > 0 ? discount : calculateSubtotal(), // Use the discounted total if available, otherwise use the original subtotal
        };

        navigate('/shipping-details', { state: { orderData, alldata , discount : discount } });
    };

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-center text-orange-600">صفحة الدفع</h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="order-2 lg:order-1">
                    <ul className="space-y-4">
                        {cartItems.map((item, index) => (
                            <li key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                                <div>
                                    <h3 className="text-lg font-semibold text-teal-700">{item.TradeName}</h3>
                                    <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">السعر: {item.price} د.ل</p>
                                </div>
                                <div>
                                    <img
                                        key={index}
                                        src={ IMAGE_URL +  `images/${item.Product.ProductImages[0].imageUrl}`}
                                        alt={item.TradeName}
                                        className="object-contain w-auto h-20 rounded-t-xl"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 mt-8 text-right bg-gray-100 rounded-lg">
                        <p className="text-lg font-semibold">المجموع الكلي: {calculateSubtotal()} د.ل</p>
                    </div>
                    {
                        discount > 0 && (
                            <div className="p-4 mt-8 text-right bg-gray-100 rounded-lg">
                                <p className="text-lg font-semibold">المجموع بعد التخفيض: {discount} د.ل</p>
                            </div>
                        )
                    }
                </div>
                <div className="order-1 p-8 rounded-lg lg:order-2 bg-gray-50">
                    <h2 className="mb-6 text-2xl font-bold text-orange-400">طرق الدفع</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="text-orange-500 form-radio"
                                    name="paymentMethod"
                                    value="cash_on_delivery"
                                    checked={paymentMethod === 'cash_on_delivery'}
                                    onChange={() => setPaymentMethod('cash_on_delivery')}
                                />
                                <span className="ml-2 text-orange-400">الدفع عند الاستلام</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="text-orange-500 form-radio"
                                    name="paymentMethod"
                                    value="wallet"
                                    checked={paymentMethod === 'wallet'}
                                    onChange={() => setPaymentMethod('wallet')}
                                />
                                <span className="ml-2 text-orange-400">المحفظة الخاصة</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="flex flex-col mt-10">
                            <input
                                placeholder='ادخل رمز الكوبون'
                                type="text"
                                className="text-orange-500 "
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                        </label>
                    </div>
                    <button
                        onClick={() => { handelApplyCoupon() }}
                        className="w-full px-4 py-2 mt-8 text-white transition bg-orange-400 rounded-lg hover:bg-orange-500 "
                    >
                        استخدام الكوبون
                    </button>

                    <button
                        onClick={() => { handleCompleateCheckout() }}
                        className="w-full px-4 py-2 mt-8 text-white transition bg-orange-400 rounded-lg hover:bg-orange-500 "
                    >
                        إتمام الدفع
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
