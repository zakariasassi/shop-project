import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { URL } from '../../constant/URL.js';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import Logo from '../../assets/logo.png'

function Signup() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

  // Username validation
  const validateUsername = (value) => {
    if (value.length < 4) {
      setUsernameError("يجب أن يكون الاسم أكثر من 3 أحرف");
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setUsernameError("يجب ألا يحتوي الاسم على مسافات أو رموز خاصة");
    } else {
      setUsernameError("");  // valid case
    }
  };

  // Phone number validation
  const validatePhoneNumber = (value) => {
    if (!/^[0-9]{10}$/.test(value)) {
      setPhoneError("يجب أن يحتوي رقم الهاتف على 10 أرقام");
    } else {
      setPhoneError("");  // valid case
    }
  };

  const handelSupmitForm = async (e) => {
    e.preventDefault();

    if (usernameError || phoneError) {
      toast.error("الرجاء تصحيح الأخطاء قبل المتابعة");
      return;
    }

    const response = await axios.post(`${URL}customer/register`, {
      phone: phoneNumber,
      password: password,
      username: username
    });


    if (response) {
      toast.success(response.data.message);
    }
  };

  const { mutate, isLoading } = useMutation(handelSupmitForm);

  return (
    <>

<SEO
        title={"انشاء حساب جديد"}
        name={"ليبو كير"}
        description={"قم بفتح حساب جديد واحصل علي افضل العروض والتخفيضات"}
      />


        <div className="flex justify-center min-h-screen text-gray-900 bg-primary">
      <div className="flex justify-center flex-1 m-0 bg-white shadow max-w-screen-full sm:m-10 sm:rounded-lg">
        <div className="p-6 lg:w-1/2 xl:w-5/12 sm:p-12">
        <div className='flex items-center justify-center'>
                            <p className='text-center'>
                                <img
                                    src={Logo}
                                    alt="Logo WePhrmacia"
                                    style={{ width: '200px', marginBottom: '20px' }}
                                />
                            </p>
                        </div>
          <div className="flex flex-col items-center mt-5">
            <h1 className="text-2xl xl:text-3xl">انشاء حساب</h1>
            <div className="flex-1 w-full mt-8">
   

              <div className="mx-auto w-ful">
                {/* Username Input */}
                <input
                  onChange={e => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                  }}
                  className={`w-full px-8 py-4 text-sm font-medium placeholder-gray-500 bg-gray-100 border ${usernameError ? 'border-red-500' : 'border-green-500'} rounded-lg focus:outline-none`}
                  type="text"
                  placeholder="اسم المستخدم"
                />
                                <label className='text-xs'> يجب ان يكون اكثر من 3 حروف باللغة الانجليزية ولا يحتوي علي رموز</label>

                <p className={`text-xs mt-1 ${usernameError ? 'text-red-500' : 'text-green-500'}`}>
                  {usernameError || ""}
                </p>

                {/* Phone Number Input */}
                <input
                  onChange={e => {
                    setPhoneNumber(e.target.value);
                    validatePhoneNumber(e.target.value);
                  }}
                  className={`w-full px-8 py-4 mt-5  text-sm font-medium placeholder-gray-500 bg-gray-100 border ${phoneError ? 'border-red-500' : 'border-green-500'} rounded-lg focus:outline-none`}
                  type="number"
                  placeholder="09x xxxxxxx"
                />
                <p className={`text-sm mt-1 ${phoneError ? 'text-red-500' : 'text-green-500'}`}>
                  {phoneError || " "}
                </p>

                {/* Password Input */}
                <input
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-8 py-4 mt-5 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="كلمة المرور"
                />

                <button
                  disabled={isLoading}
                  onClick={(e) => mutate(e)}
                  className='flex flex-row items-center justify-center w-full px-20 py-3 mt-10 rounded-md text-last bg-primary'
                  >
                  {isLoading ? (
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="mr-3">تسجيل</span>
                    </>
                  )}
                </button>

                <div className="my-12 text-center border-b">
                  <div className="inline-block px-2 text-sm font-medium leading-none tracking-wide text-gray-600 bg-white">
                    لدي حساب بالفعل - <span className='text-primary'><Link to={"/login"}>تسجيل الدخول</Link></span>
                  </div>
                </div>

                <p className="mt-6 text-xs text-center text-gray-600">
                  I agree to Wephrmacia {}
                  <a href="#" className="border-b border-gray-500 border-dotted">
                    Terms of Service {}
                  </a>
                  {} and its {}
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
    </>

  );
}

export default Signup;
