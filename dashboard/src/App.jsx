import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import Layout from "./Layaout/Layout";
import Loading from "./components/Loading/Loading"; // Ensure you have a Loading component
import { URL } from "./constants/URL";

// Lazy load components
const Main = lazy(() => import("./pages/Main/Main"));
const Login = lazy(() => import("./pages/Login/Login"));
const MainCategorys = lazy(() => import("./pages/Categorys/MainCategorys/MainCategorys"));
const SubCategorys = lazy(() => import("./pages/Categorys/SubCategorys/SubCategorys"));
const BrandsCategorys = lazy(() => import("./pages/Categorys/BrandsCategorys/BrandsCategorys"));
const CreateProduct = lazy(() => import("./pages/Products/CreateProduct/CreateProduct"));
const MangeProducts = lazy(() => import("./pages/Products/MangeProducts/MangeProducts"));
const BlockedUser = lazy(() => import("./pages/Users/BlokedUsers/BlockedUser"));
const CreateCards = lazy(() => import("./pages/Cards/CreateCards/CreateCards"));
const ManageCards = lazy(() => import("./pages/Cards/ManageCards/ManageCards"));
const ManageOrders = lazy(() => import("./pages/Ordars/ManageOrders/ManageOrders"));
const ManageCutomers = lazy(() => import("./pages/Customers/ManageCutomers"));
const ManageOffers = lazy(() => import("./pages/Offers/MangeOffers"));
const ManageAdds = lazy(() => import("./pages/Adds/ManageAdds"));
const Roles = lazy(() => import("./pages/Roles/Roles"));
const Coupons = lazy(() => import("./pages/Coupons/Copons"));
const Error = lazy(() => import("./pages/Error/Error"));
const TopSoldProducts = lazy(() => import("./pages/Reports/TopSoldProducts"));
const SalesReport = lazy(() => import("./pages/Reports/SalesReport"));
const OrdersReport = lazy(() => import("./pages/Reports/OrdersReport"));
const VisitReport = lazy(() => import("./pages/Reports/VisitReport"));
const SoldProducts = lazy(() => import("./pages/Reports/SoldProducts"));
const SoldProductAmount = lazy(() => import("./pages/Reports/SoldProductAmount"));
const CartDropReport = lazy(() => import("./pages/Reports/CartDropReport"));
const MostVisitedProducts = lazy(() => import("./pages/Reports/MostVisitedProducts"));
const AdminManagement = lazy(() => import("./pages/Users/AdminManagement/AdminManagement"));

function App() {
  const [isLoggedIn, setLogin] = useState(window.localStorage.getItem('isLogin'));
  const navigate = useNavigate();

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
      const response = await axios.get(URL + 'admin/token/check', {
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
    <>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="*" element={<Error />} />
          <Route path="/login" element={isLoggedIn ? <Layout render={<Main />} name={"Home"} /> : <Login />} />
          <Route path="/" element={isLoggedIn ? <Layout render={<Main />} name={"Home"} /> : <Login />} />
          <Route path="/main" element={isLoggedIn ? <Layout render={<Main />} name={"Home"} /> : <Login />} />
          <Route path="/main-categorys" element={isLoggedIn ? <Layout render={<MainCategorys />} name={"Main Categorys"} /> : <Login />} />
          <Route path="/sub-categorys" element={isLoggedIn ? <Layout render={<SubCategorys />} name={"Sub Categorys"} /> : <Login />} />
          <Route path="/brands-categorys" element={isLoggedIn ? <Layout render={<BrandsCategorys />} name={"Brands Categorys"} /> : <Login />} />
          <Route path="/create-product" element={isLoggedIn ? <Layout render={<CreateProduct />} name={"Create Product"} /> : <Login />} />
          <Route path="/manage-products" element={isLoggedIn ? <Layout render={<MangeProducts />} name={"Manage Product"} /> : <Login />} />
          <Route path="/create-cards" element={isLoggedIn ? <Layout render={<CreateCards />} name={"Create Cards"} /> : <Login />} />
          <Route path="/manage-cards" element={isLoggedIn ? <Layout render={<ManageCards />} name={"Manage Product"} /> : <Login />} />
          <Route path="/create-user" element={isLoggedIn ? <Layout render={<AdminManagement />} name={"Create User"} /> : <Login />} />
          <Route path="/blocked-users" element={isLoggedIn ? <Layout render={<BlockedUser />} name={"Blocked users"} /> : <Login />} />
          <Route path="/manage-cutomers" element={isLoggedIn ? <Layout render={<ManageCutomers />} name={"Manage Customers"} /> : <Login />} />
          <Route path="/manage-offers" element={isLoggedIn ? <Layout render={<ManageOffers />} name={"Manage Offers"} /> : <Login />} />
          <Route path="/manage-orders" element={isLoggedIn ? <Layout render={<ManageOrders />} name={"Manage Orders"} /> : <Login />} />
          <Route path="/manage-adds" element={isLoggedIn ? <Layout render={<ManageAdds />} name={"Manage Adds"} /> : <Login />} />
          <Route path="/roles" element={isLoggedIn ? <Layout render={<Roles />} name={"Users Roles"} /> : <Login />} />
          <Route path="/coupons" element={isLoggedIn ? <Layout render={<Coupons />} name={"Manage Coupons"} /> : <Login />} />
          <Route path="/reports/top-sold-products" element={isLoggedIn ? <Layout render={<TopSoldProducts />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/sales" element={isLoggedIn ? <Layout render={<SalesReport />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/orders" element={isLoggedIn ? <Layout render={<OrdersReport />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/vesting"  element={isLoggedIn ? <Layout render={<VisitReport />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/most-products-vist"  element={isLoggedIn ? <Layout render={<MostVisitedProducts />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/sold-products"  element={isLoggedIn ? <Layout render={<SoldProducts />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/sold-product-amount"  element={isLoggedIn ? <Layout render={<SoldProductAmount />} name={"Reports"} /> : <Login />}  />
          <Route path="/reports/cart-drop-percentage"  element={isLoggedIn ? <Layout render={<CartDropReport />} name={"Reports"} /> : <Login />}  />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
