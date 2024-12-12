import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Carousel, Button, Typography, Tag } from "antd";
import { useMutation } from "react-query";
import { addToCart } from "../../api/Products";
import { addToList } from "../../api/Favourite";
import { countCart } from "../../state/atom/cartAtom";
import { useAtom } from "jotai";
import { IMAGE_URL, URL } from "../../constant/URL";
import axios from "axios";
import SEO from "../../components/SEO";  // Import your SEO component
import toast from "react-hot-toast";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
const { Title, Text } = Typography;

function ProductDetails() {
  const [count, setCount] = useAtom(countCart);
  const location = useLocation();
  const product = location.state.product;

  const { mutate: addToListMutate } = useMutation(addToList, {
    onSuccess: () => {
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

  const { mutate } = useMutation(addToCart, {
    onSuccess: () => {
      setCount((prevCount) => prevCount + 1);
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });

  const addToListHandler = (e, product) => {
    e.preventDefault();
    addToListMutate(product.id);
  };

  const addToCartHandler = (e, product) => {
    e.preventDefault();
    mutate(product);
  };

  const newProductWatched = async () => {
    const token = window.localStorage.getItem('token');
    try {
      await axios.post(URL + 'product/new-proudact-watched', {
        productID: product.id,
      }, {
        headers: {
          authorization: `Bearer ` + token,
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    newProductWatched();
  }, []);

  return (
    <div className="py-8" dir="rtl">
      {/* SEO Component */}
      <SEO
        title={product.TradeName} 
        description={product.shortDescription} 
        url={`${URL}product/${product.id}`} 
        image={`${IMAGE_URL}images/${product.ProductImages[0]?.imageUrl}`}
        keywords={product.TradeName + ", " + product.ScientificName}
        author="Your Store Name"
      />
      
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <div className="px-4">
            <Title level={2}>{product.TradeName}</Title>
            <Title level={3} type="secondary">{product.ScientificName}</Title>
            <Text>{product.shortDescription}</Text>
            <div className="my-5">
              <Text>السعر: </Text>
              <Text strong>
                {product.discountPercentage !== 0
                  ? (product.price - product.price * (product.discountPercentage / 100)).toFixed(0)
                  : product.price}{" "}
                د.ل
              </Text>
              {product.discountPercentage !== 0 && (
                <Text delete className="ml-2">{product.price} د.ل</Text>
              )}
              {product.availability === false && (
                <Tag color="red">غير متوفر</Tag>
              )}
            </div>
            <div>
              <Text strong>الوصف:</Text>
              <p className="mt-2">{product.fullDescription}</p>
            </div>

            <div>
              <Text strong>المكونات :</Text>
              <p className="mt-2">{product.howUse}</p>
            </div>
          </div>
          <div className="px-4">
            <Carousel autoplay>
              {product.ProductImages.map((image, index) => (
                <img
                  key={index}
                  src={IMAGE_URL + 'images/' + image.imageUrl}
                  alt={product.TradeName}
                  style={{ width: "100px", height: "100px" }} // Adjust as per your design
                />
              ))}
            </Carousel>
            <div className="flex flex-col mt-4 md:flex-row">
              <div className="mb-2 md:w-1/2 md:mb-0 md:px-2">
                <Button
                  disabled={product.availability === false}
                  onClick={(e) => addToCartHandler(e, product)}
                  type="primary"
                  className="w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  اضافة الي السلة
                </Button>
              </div>
              <div className="md:w-1/2 md:px-2">
                <Button
                  onClick={(e) => addToListHandler(e, product)}
                  className="w-full"
                >
                  اضافة الي المفضلة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
