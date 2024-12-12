import React, { useEffect, Suspense, lazy, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import { OrbitProgress } from "react-loading-indicators";
import Order from "./pages/Orders/Orders";
import toast, { Toaster } from 'react-hot-toast';
import 'sweetalert2/src/sweetalert2.scss'
import Favorites from "./pages/Favorites/Favorites.jsx";
import Loading from "./components/Loading/Loading.jsx";
import ProductsByBrand from "./pages/ProductsByBrand/ProductsByBrand.jsx";
import { newVist } from "./api/Visters.js";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";
import ProductsByMainCategory from "./pages/ProductsByMainCategory/ProductsByMainCategory.jsx";
import { HelmetProvider } from 'react-helmet-async';
import SEO from "./components/SEO.jsx";
import AddDeliveryLocation from "./pages/AddDeliveryLocation/AddDeliveryLocation.jsx";



// Lazy load components
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Home = lazy(() => import("./pages/Home/Home"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Login = lazy(() => import("./pages/Login/Login"));
const Products = lazy(() => import("./pages/Products/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails/ProductDetails"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Error = lazy(() => import("./pages/Error/Error"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation/OrderConfirmation"));
const Shiping = lazy(() => import("./pages/Shiping/Shiping"));
const ProductsByOffer = lazy(() => import("./pages/ProductsByOffer/ProductsByOffer.jsx"));
const Footer = lazy(() => import("./components/Footer/Footer.jsx"));



function AppRoutes() {
  const { isLoggedIn, jwtCheck } = useContext(AuthContext);




  useEffect(() => {
    newVist()
  },[])
  return (

    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster />
      <Suspense fallback={<Loading />}>
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Home /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Home /> : <Signup />} />
            <Route path="/" element={isLoggedIn ? <Home /> : <Home />} />
            <Route path="/home" element={isLoggedIn ? <Home /> : <Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product-detail" element={<ProductDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/error" element={<Error />} />
            <Route path="/shipping-details" element={<Shiping />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/products/prodact-details" element={<ProductDetails />} />
            <Route path="/my-orders" element={<Order />} />
            <Route path="/offer-products" element={<ProductsByOffer />} />
            <Route path="/brands/product" element={<ProductsByBrand />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/products/bymainCategory" element={<ProductsByMainCategory />} />
            <Route path="/add-delivery-location" element={<AddDeliveryLocation />} />

          </Routes>
        </main>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  const helmetContext = {};

  return (
    <HelmetProvider context={helmetContext}>
 
          <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>

  );
}

export default App;