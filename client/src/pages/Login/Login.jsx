import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { last, primary, secondary } from '../../constant/colors';
import Logo from '../../assets/logo.png'
function Login() {
    const { login } = useContext(AuthContext);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async () => {

            return login(phoneNumber, password);
        },

        onError: (error) => {
            toast.error(error.response.data.message, {
                icon: '☹️',
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    color: 'white'
                }
            });
        }
    });

    return (
        <div className="flex justify-center min-h-screen text-gray-900 bg-primary ">
            <div className="flex justify-center flex-1 m-0 bg-white max-w-screen-full sm:m-10 sm:rounded-lg">
                <div className="flex items-center justify-center w-full p-6 lg:w-1/2 xl:w-5/12 sm:p-12">

                    <div>
                        <div className='flex items-center justify-center'>
                            <p className='text-center'>
                                {/* <img
                                    src={Logo}
                                    alt="Logo WePhrmacia"
                                    style={{ width: '200px', marginBottom: '20px' }}
                                /> */}
                            </p>
                        </div>
                        <div className="flex flex-col items-center w-full mt-4 ">
                            <h1 className="text-2xl xl:text-3xl">
                                الدخول الي حسابك
                            </h1>
                            <div className="flex-1 w-full mt-8 ">
                                <div className="w-full mx-auto ">
                                    <input
                                        className="w-full px-8 py-4 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="number"
                                        placeholder="رقم الهاتف"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                    <input
                                        className="w-full px-8 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="password"
                                        placeholder="كلمة المرور"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        onClick={loginMutation.mutate}
                                        className='flex flex-row items-center justify-center w-full px-20 py-3 mt-10 text-white bg-orange-500 rounded-md'
                                        disabled={loginMutation.isLoading} // Disable button while loading
                                    >
                                        {loginMutation.isLoading ? (
                                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 -ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.00098 11.999L16.001 11.999M16.001 11.999L12.501 8.99902M16.001 11.999L12.501 14.999" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                                                </svg>
                                                <span className="mr-3">دخول</span>
                                            </>
                                        )}
                                    </button>
                                    <div className="my-12 text-center border-b">
                                        <div className="inline-block px-2 text-sm font-medium leading-none tracking-wide text-gray-600 transform translate-y-1/2 bg-white">
                                            ليس لدي حساب <span className={`text-orange-500`}><Link to="/register">انشاء حساب</Link></span>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-xs text-center text-gray-600">
                                        I agree to Wephrmacia { }
                                        <a href="#" className="border-b border-gray-500 border-dotted">
                                            Terms of Service { }
                                        </a>
                                        { } and its { }
                                        <a href="#" className="border-b border-gray-500 border-dotted">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;
