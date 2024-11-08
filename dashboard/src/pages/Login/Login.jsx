import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userAtom, rolesAtom } from '../../state/rolesAtom.js';
import { URL } from './../../constants/URL';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [roles, setRoles] = useAtom(rolesAtom);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async (data) => {
    try {
      const response = await axios.post(`${URL}admin/login`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.message || "Login failed");
    }
  };

  const { mutate: loginMutate, isLoading: loading } = useMutation({
    mutationFn: login,
    onSuccess: (loginData) => {
      if (loginData?.user && loginData?.token) {
        setUser(loginData.user);
        setRoles(loginData.roles || []);  // Set roles; permissionsAtom updates automatically

        window.localStorage.setItem('user', JSON.stringify(loginData.user));
        window.localStorage.setItem('roles', JSON.stringify(loginData.roles));
        window.localStorage.setItem('isLogin', true);
        window.localStorage.setItem('token', loginData.token);

       window.location.replace('/main') // Ensure state is updated before navigation
      } else {
        toast.error('Login data is incomplete.');
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
      <div className="w-[50%] h-auto">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-orange-600">دخول</h2>
            <p className="mt-2 text-center text-black">الوصول الي لوحة التحكم</p>
            <form className="mt-4">
              <div className="flex flex-col mb-4">
                <label className="flex text-sm font-medium leading-none text-black" htmlFor="login">
                  <p className="text-right">اسم المتسخدم</p>
                </label>
                <input
                  className="flex w-full h-10 px-3 py-2 text-sm text-black border rounded-md"
                  type="text"
                  id="login"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ادخل اسم المستخدم"
                  required
                />
              </div>
              <div className="flex flex-col mb-6">
                <label className="flex text-sm font-medium text-black" htmlFor="password">
                  <p className="text-right">كلمة المرور</p>
                </label>
                <input
                  className="flex w-full h-10 px-3 py-2 text-sm text-black border rounded-md"
                  type="password"
                  id="password"
                  placeholder="كلمة المرور"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                onClick={() => loginMutate({ username, password })}
                disabled={loading}
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-md"
                type="button"
              >
                {loading ? (
                  <svg className="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
                    <path
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeDasharray="300 385"
                      strokeDashoffset="0"
                      d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        calcMode="spline"
                        dur="2s"
                        values="685;-685"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                ) : (
                  <>وصول</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
