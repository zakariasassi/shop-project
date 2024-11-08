// import React, { useState, useContext, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAtomValue } from "jotai";
// import { MenuOutlined, UserOutlined, ShoppingCartOutlined, HeartOutlined, WalletOutlined } from "@ant-design/icons";
// import { countCart } from "../../state/atom/cartAtom";
// import Logo from "../../assets/logo.png";
// import AuthContext from "../../context/AuthContext";
// import { useQuery } from "react-query";
// import { getWalletBalance } from "../../api/Customer";
// import BannerView from "../Bannar/BannerView";
// import { IMAGE_URL } from "../../constant/URL";
// import { userData } from "../../state/atom/userAtom";

// function Navbar() {
//   const { isLoggedIn } = useContext(AuthContext);
//   const count = useAtomValue(countCart);
//   const userdata = useAtomValue(userData);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = (e) => {
//     e.preventDefault();
//     window.localStorage.clear();
//     window.location.replace("/login");
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const { data: walletBalance, isLoading: walletLoading, refetch: refetchWalletBalance } = useQuery(
//     "walletBalance",
//     () => getWalletBalance("wallet/balance"),
//     { enabled: !!isLoggedIn }
//   );

//   useEffect(() => {
//     if (isLoggedIn) {
//       refetchWalletBalance();
//     }
//   }, [isLoggedIn, refetchWalletBalance]);

//   const menuItems = [
//     { key: "home", label: <Link className="font-bold text-primary" to="/">الرئيسية</Link> },
//     { key: "products", label: <Link className="font-bold text-primary" to="/products">المنتجات</Link> },
//     isLoggedIn && { key: "orders", label: <Link  className="font-bold text-primary" to="/my-orders">طلباتي</Link> },
//   ].filter(Boolean);

//   const renderMenu = () => (
//     <ul className="items-center hidden gap-6 md:flex">
//       {menuItems.map((item) => (
//         <li key={item.key} className="hover:text-primary">{item.label}</li>
//       ))}
//     </ul>
//   );

//   const renderUserActions = () => (
//     <div className="flex flex-col items-center gap-2">

      
// <div className="flex flex-row items-center justify-center gap-1 text-lg">
        
//         <Link to="/profile">
//           {userdata.image ? (
//             <img className="object-cover rounded-full w-7 h-7" src={`${IMAGE_URL}custmoerprofile/${userdata.image}`} alt="Profile" />
//           ) : (
//             <UserOutlined className="text-lg" />
//           )}
//         </Link>
//           <p className="font-bold text-center text-primary">{JSON.parse(window.localStorage.getItem("user")).name}</p>
//           {/* <p>{JSON.parse(window.localStorage.getItem("user")).phone}</p> */}
//         </div>

        
//       <Link className="flex items-center gap-2 text-lg font-bold text-primary" to="/cart">
//         السلة
//         <div className="relative">
//           <ShoppingCartOutlined className="text-lg text-primary" />
//           {count > 0 && <span className="absolute px-1 text-xs text-white bg-red-500 rounded-full bottom-4 right-2">{count}</span>}
//         </div>
//       </Link>
//       <Link className="flex items-center gap-2 font-bold text-primary" to="/favorites">
//         المفضلة
//         <HeartOutlined className="text-lg text-red-600" />
//       </Link>

//       {/* <div className="flex items-center gap-1 px-1 text-sm rounded text-last bg-primary">
      
//         <WalletOutlined className="text-sm text-last" />
//         {walletLoading ? (
//           <span className="text-sm">Loading...</span>
//         ) : (
//           <span className="">{walletBalance ? walletBalance.balance : ""} د.ل</span>
//         )}
//       </div> */}



//       <button onClick={(e) => handleLogout(e)} className="px-6 py-1 bg-red-500 rounded text-md text-last">
//         خروج
//       </button>
//     </div>
//   );

//   return (
//     <nav className="px-4 py-4 bg-white shadow-md md:px-8">
//       <div className="container flex items-center justify-between mx-auto">
//         {/* Logo */}
//         <Link to="/" className="flex items-center">
//           <img src={Logo} alt="Logo" className="w-32" />
//         </Link>

//         {/* Menu */}
//         <div className="hidden md:flex">{renderMenu()}</div>

//         {/* User Actions */}
//         {isLoggedIn ? (
//           <div className="hidden md:flex">{renderUserActions()}</div>
//         ) : (
//           <div className="hidden gap-4 md:flex">
//             <Link to="/login">
//               <button className="px-4 py-2 text-white rounded-md bg-primary">دخول</button>
//             </Link>
//             <Link to="/register">
//               <button className="px-4 py-2 text-white rounded-md bg-primary">انشاء حساب</button>
//             </Link>
//           </div>
//         )}

//         {/* Mobile Menu Button */}
//         <button onClick={toggleMenu} className="md:hidden">
//           <MenuOutlined className="text-2xl" />
//         </button>
//       </div>

//       {/* Mobile Drawer Menu */}
//       {menuOpen && (
//         <div className="fixed inset-0 z-50 p-4 text-center bg-white md:hidden">
//           <button onClick={toggleMenu} className="mb-4 text-lg">إغلاق</button>
//           <ul className="flex flex-col gap-4">
//             {menuItems.map((item) => (
//               <li key={item.key} onClick={toggleMenu}>{item.label}</li>
//             ))}
//           </ul>
//           {isLoggedIn && <div className="flex flex-col mt-8">{renderUserActions()}</div>}
//         </div>
//       )}

//       {/* Banner */}
//       {isLoggedIn && <BannerView />}
//     </nav>
//   );
// }

// export default Navbar;





"use client"

import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAtomValue } from "jotai"
import { MenuIcon, UserIcon, ShoppingCartIcon, HeartIcon, WalletIcon, XIcon } from "lucide-react"
import { countCart } from "../../state/atom/cartAtom"
import Logo from "../../assets/logo.png"
import AuthContext from "../../context/AuthContext"
import { useQuery } from "react-query"
import { getWalletBalance } from "../../api/Customer"
import BannerView from "../Bannar/BannerView"
import { IMAGE_URL, URL } from "../../constant/URL"
import { userData } from "../../state/atom/userAtom"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import axios from "axios"





export default function Navbar() {
  const { isLoggedIn } = useContext(AuthContext)
  const count = useAtomValue(countCart)
  const userdata = useAtomValue(userData)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    window.localStorage.clear()
    window.location.replace("/login")
  }



  



  const { data: walletBalance, isLoading: walletLoading, refetch: refetchWalletBalance } = useQuery(
    "walletBalance",
    () => getWalletBalance("wallet/balance"),
    { enabled: !!isLoggedIn }
  )

  useEffect(() => {
    if (isLoggedIn) {
      refetchWalletBalance()
    }
  }, [isLoggedIn, refetchWalletBalance])

  const menuItems = [
    { key: "home", label: "الرئيسية", href: "/" },
    { key: "products", label: "المنتجات", href: "/products" },
    isLoggedIn && { key: "orders", label: "طلباتي", href: "/my-orders" },
  ].filter(Boolean)






  
  const getalluserlocation = async () => {
    const response = await axios.get(URL + 'location' , {
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    });
    return response.data;
  }
  
  
  
  const { data: locations , isLoading: locationsLoading, refetch: refetchLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getalluserlocation(),
  });
  
  




    
  const renderMenu = () => (
    <ul className="hidden float-right gap-3 md:flex">
      {menuItems.map((item) => (
        item && (
          <li key={item.key} className="hover:text-primary">
            <Link className="font-bold text-center text-black hover:text-orange-400" to={item.href}>
              {item.label}
            </Link>
          </li>
        )
      ))}
    </ul>
  )


  
  const renderUserActions = () => (
    
    <div className="flex flex-col items-center gap-2 md:flex-row">
      <Link to="/profile" className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={userdata?.image ? `${IMAGE_URL}custmoerprofile/${userdata?.image}` : undefined} />
          <AvatarFallback><UserIcon className="w-5 h-5" /></AvatarFallback>
        </Avatar>
        <span className="font-bold text-black">{JSON.parse(window.localStorage.getItem("user") || "{}").name}</span>
      </Link>

      <Link to="/cart" className="flex items-center gap-2">
        <Button variant="ghost" className="relative">
          <ShoppingCartIcon className="w-10 h-10 text-orange-500" />
          {count > 0 && (
            <Badge variant="destructive" className="absolute w-5 h-5 p-0 rounded-full -right-2 -top-2">
              {count}
            </Badge>
          )}
        </Button>
      </Link>

      <Link to="/favorites" className="flex items-center gap-2">
      <Button variant="ghost">
          <HeartIcon className="w-10 h-10 text-red-600" />
        </Button>
      </Link>

      <Button variant="outline" className="gap-2">
        <WalletIcon className="w-5 h-5 text-orange-500" />
        <span className="text-black">{walletLoading ? "Loading..." : `${walletBalance?.balance || ""} د.ل`}</span>
      </Button>
          



      <Button variant="destructive" className="w-2/5" onClick={handleLogout}>
        خروج
      </Button>
    </div>
  )




  return (
    <>
     <nav className="py-4 bg-white text-primary ">
      <div className="container flex items-center justify-between px-4 mx-auto">
        <Link to="/" className="flex items-center text-3xl font-bold text-black">
          سوق الجملة
        </Link>

        {renderMenu()}

        <div className="hidden md:flex">
          {isLoggedIn ? (
            renderUserActions()
          ) : (
            <div className="flex gap-4">
              <Link to="/login">
                <Button className="text-xs text-white bg-orange-500">دخول</Button>
              </Link>
              <Link to="/register">
              <Button className="text-xs text-white bg-orange-500">انشاء حساب</Button>
              </Link>
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                item && (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="block px-3 py-2 text-lg font-medium rounded-lg hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                )
              ))}
              {isLoggedIn ? (
                renderUserActions()
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login">
                  <Button className="text-xs text-white bg-orange-500">دخول</Button>
                  </Link>
                  <Link to="/register">
                  <Button className="text-xs text-white bg-orange-500">انشاء حساب</Button>
                  </Link>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

     
    </nav>
    {isLoggedIn && <BannerView />}
{/* 
    <div className="container flex flex-row items-center gap-4 m-auto mt-4">
      <p className="w-2/6 p-2 font-bold text-center bg-primary text-last">اختر عنوان التوصيل </p>
  <select className="w-full p-2 text-gray-600 bg-white border border-gray-300 rounded">
    {locations?.map((loca, index) => (
      <option key={index} value={loca.placeDescription} className="text-sm">
        {`${loca.placeDescription} / ${loca.placeType}`}
      </option>
    ))}
  </select>

  <Link
    to={'/add-delivery-location'}
    className="w-2/12 px-4 py-2 text-sm text-center text-white duration-150 rounded bg-primary hover:bg-secondary hover:text-primary"
  >
     اضافة عنوان جديد +
  </Link>
</div> */}

    </>
   
  )
}