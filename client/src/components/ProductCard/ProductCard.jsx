import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaPlus } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import { useAtom } from "jotai";
import { countCart } from "../../state/atom/cartAtom";
import { useMutation } from "react-query";
import { addToCart } from "../../api/Products";
import { IMAGE_URL } from "../../constant/URL";
import { addToList, removeFromList } from "../../api/Favourite";
import toast from "react-hot-toast";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import SEO from "../SEO";

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false); // State to manage the heart icon
  const iconRef = useRef(null);
  const [count, setCount] = useAtom(countCart);

  const { data: listData, mutate: addToListMutate } = useMutation(addToList, {
    onSuccess: (listData) => {
      toast.success("تمت اضافة المنتج الي المفضلة", {
        icon: "👏",
        position: "bottom-left",
        style: { backgroundColor: "yellow", color: "black" },
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        icon: "👏",
        position: "bottom-left",
        style: { backgroundColor: "yellow", color: "black" },
      });
    },
  });


  const addToListHandler = (e, product) => {
    e.preventDefault();
    if (!window.localStorage.getItem("token")) {
      return Swal.fire({
        title: "اشعار",
        text: "يجب تسجيل الدخول",
        icon: "error",
        confirmButtonText: "اغلاق",
      });
    }

    // Toggle the heart fill state when clicked
    setIsLiked((prevState) => !prevState);

    addToListMutate(product);
  };

  const { mutate } = useMutation(addToCart, {
    onSuccess: () => {
      setCount((prevCount) => prevCount + 1);
      toast.success("تمت اضافة المنتج الي السلة", {
        icon: "👏",
        position: "bottom-left",
        style: { backgroundColor: "yellow", color: "black" },
      });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });

  const addToCartHandler = (e, product) => {
    e.preventDefault();
    if (!window.localStorage.getItem("token")) {
      return Swal.fire({
        title: "اشعار",
        text: "يجب تسجيل الدخول",
        icon: "error",
        confirmButtonText: "اغلاق",
      });
    }
    mutate(product);
  };

  // SEO Meta Information
  const seoTitle = product.TradeName;
  const seoDescription = `${product.TradeName} is available in ${product.MainCategory?.name}/${product.SubCategory?.name}. Get it now for ${product.price} د.ل.`;
  const seoImage = product?.ProductImages?.length > 0
    ? `${IMAGE_URL}images/${product.ProductImages[0].imageUrl}`
    : "defaultImageURL";
  const seoUrl = `${window.location.origin}/product-detail/${product.id}`;

  return (
    <>
      <SEO
        title={"المنتجات"}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
      />
      <div className="relative flex flex-col justify-around w-full max-w-full m-3 overflow-hidden bg-white border border-gray-100 shadow-md">
        <div className="relative flex flex-row justify-between ">
          {product.discountPercentage != 0 ? (
            <p className="p-1 absolute t text-[10px] z-50 font-medium text-center text-white bg-orange-500 max-sm:text-xs max-sm:px-1.5 sm:px-1">
           وفر     %{product.discountPercentage}
            </p>
          ) : (
            ""
          )}

          {product.availability === false && (
            <p className="p-1 absolute text-[10px] z-50 font-medium text-center text-white bg-red-600 max-sm:text-xs max-sm:px-1.5 sm:px-1">
              غير متوفر
            </p>
          )}
        </div>
        <Link
          className="flex h-auto overflow-hidden "
          to="/product-detail"
          state={{ product: product }}
        >
          <img
            className= "  object-cover h-[200px] w-full"
            src={
              product?.ProductImages?.length > 0
                ? `${IMAGE_URL}images/${product.ProductImages[0].imageUrl}`
                : "defaultImageURL"
            }
            alt={product.TradeName}
          />
        </Link>
        <div className="px-5 pb-2">
          <Link to="#">
            <p className="text-[13px] tracking-tight text-black font-[700]">
              {product.TradeName}
            </p>
          </Link>
          <div className="flex text-[13px] text-gray-400 uppercase">
            {product.MainCategory?.name} {"/"}
            {product.SubCategory?.name} {"/"}
            {product.BrandCategory?.name} {""}
          </div>
          <span className="text-[15px] tracking-tight text-black font-[700]">
            {product.discountPercentage != 0
              ? (
                product.price - product.price * (product.discountPercentage / 100)
              ).toFixed(0)
              : product.price}{" "}
            د.ل
          </span>
          <span className="text-[15px] tracking-tight line-through font-[700] text-slate-400">
            {product.discountPercentage != 0 && <> {product.price} د.ل </>}
          </span>
          <div className="flex items-center justify-start mt-2">
            <div className="flex items-center justify-between w-full ">
              {product.availability == 0 ? (
                <p className="w-full text-red-600 bg-white rounded-md">
                  غير متوفر
                </p>
              ) : (
                <button
                  onClick={(e) => addToCartHandler(e, product)}
                  className="flex items-center justify-center w-8 h-8 text-white bg-orange-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  <FaPlus className="w-4 h-4 " />
                </button>
              )}

<FaRegHeart
                  ref={iconRef}
                  onClick={(e) => addToListHandler(e, product.id)}
                  className="w-8 h-8 text-red-600 cursor-pointer hover:text-red-500"
                />
                
              {/* {isLiked ? (
          
              ) : (
                <FaRegHeart
                  ref={iconRef}
                  onClick={(e) => addToListHandler(e, product.id)}
                  className="w-8 h-8 text-red-600 cursor-pointer hover:text-red-500"
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
