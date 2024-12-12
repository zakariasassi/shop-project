import React, { useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { Row, Col, Carousel, Typography, Button, Badge, Tag } from "antd";
import { Link } from "react-router-dom";
import BannerView from "../../components/Bannar/BannerView";
import OfferSlider from "../../components/OfferSlider/OfferSlider";
import { addToCart, getLastProducts } from "../../api/Products";
import { getMainCategories } from "../../api/MainCategory";
import { getSubCategories } from "../../api/SubCategory";
import { getBrandCategories } from "../../api/BrandCategory";
import { IMAGE_URL } from "../../constant/URL";
import WhyChooseUs from "../../../../dashboard/src/components/WhyChooseUs/WhyChooseUs";
import AddsSlider from "../../components/AddsSlider/AddsSlider";
import Loading from "../../components/Loading/Loading";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { countCart } from "../../state/atom/cartAtom";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import MainCategorys from "../../components/MainCategorys/MainCategorys";
import SEO from "../../components/SEO"; // Import the SEO component
import { useState } from "react";
import { useEffect } from "react";

const { Title } = Typography;

function Home() {
  const [count, setCount] = useAtom(countCart);

  const { mutate } = useMutation(addToCart, {
    onSuccess: () => {
      setCount((prevCount) => prevCount + 1);
      toast.success("تمت اضافة المنتج الي السلة", {
        icon: "👏",
        position: "bottom-left",
        style: {
          backgroundColor: "yellow",
          color: "black",
        },
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

  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (swiper, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const {
    data: products,
    isLoading: loadingProducts,
    error: errorLoadingProducts,
  } = useQuery({
    queryKey: ["product/lastproducts"],
    queryFn: ({ queryKey }) => getLastProducts(queryKey[0]),
    refetchOnWindowFocus: false,
  });

  const {
    data: Maincategories,
    isLoading: LoadingMaincategories,
    error: errorMaincategories,
  } = useQuery({
    queryKey: ["main-category", "main-category"],
    queryFn: ({ queryKey }) => getMainCategories(queryKey[1]),
  });

  const {
    data: SubCategorys,
    isLoading: LoadingSubCategories,
    error: errorSubCategories,
  } = useQuery({
    queryKey: ["sub-category", "sub-category"],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  const {
    data: Brandcategories,
    isLoading: LoadingBrandcategories,
    error: errorBrandcategories,
  } = useQuery({
    queryKey: ["brand-category", "brand-category"],
    queryFn: ({ queryKey }) => getBrandCategories(queryKey[1]),
  });

  if (
    loadingProducts ||
    LoadingBrandcategories ||
    LoadingMaincategories ||
    LoadingSubCategories
  ) {
    return <Loading />;
  }
  if (errorLoadingProducts) {
    return <div>Error loading products</div>;
  }


  const renderProducts = (title, products) => {
    const AutoSlidingCarousel = ({ images }) => {
      const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
      // Automatically slide images every 3 seconds
      useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
        }, 3000); // 3 seconds
  
        return () => clearInterval(intervalId); // Clean up on component unmount
      }, [images]);
  
      return (
        <div className="relative w-full h-48">
          <img
            src={IMAGE_URL + 'images/' + images[currentImageIndex]?.imageUrl}
            alt="Product"
            className="object-cover w-full h-full"
          />
  
        </div>
      );
    };
  
    return (
      <div className="p-4 bg-white">
        <p className="p-2 mb-6 text-lg font-bold rounded-md text-last bg-primary">{title}</p>
  
        <div className="grid grid-cols-1 gap-6 max-sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product, index) => (
            <div key={index} className="relative overflow-hidden border border-gray-200 rounded-lg">
              <div className={`ribbon ${product.availability ? 'bg-gray-400' : product.discount ? 'bg-red-500' : 'bg-primary'} text-white text-xs font-bold px-2 py-1 absolute`}>
                {product.availability ? "غير متوفر" : product.discountPercentage ? "خصم" :""}
              </div>
  
              <Link to="/product-detail" state={{ product }}>
                <AutoSlidingCarousel images={product.ProductImages} />
  
                <div className="p-4">
                  <p className="text-lg font-bold">{product.TradeName}</p>
                  <div className="flex items-center gap-3 my-2 font-bold">
                    <span className="text-xl font-bold">{product.price} د.ل</span>
                    {product.discountPercentage > 0 && (
                      <span className="ml-4 text-red-500">خصم {product.discountPercentage}%</span>
                    )}
                  </div>
  
                  {product.availability == 0 ? (
                    <span className="text-gray-500">غير متوفر</span>
                  ) : (
                    <button
                      onClick={(e) => addToCartHandler(e, product)}
                      className="w-full py-1 mt-2 text-sm font-bold text-white transition rounded bg-primary"
                    >
                      أضف إلى السلة
                    </button>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  
  return (
    <div className="w-[90%] px-4 mx-auto">

            <AddsSlider />

      <MainCategorys />
      <OfferSlider />

      <div style={{ padding: "1rem", backgroundColor: "#fff" }}>
      <p className='py-4 text-4xl font-bold'>أفضل العلامات التجارية
      </p>

        <Row gutter={[16, 16]}>
          {Brandcategories?.map((brand) => (
            <Col xs={12} sm={8} md={6} lg={4} key={brand.id}>
              <Link to="/brands/product" state={{ id: brand.id }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={IMAGE_URL + "brands/" + brand.image}
                    alt={brand.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      {renderProducts("أحدث المنتجات", products)}

      {renderProducts("الأكثر طلبا", products)}
      {renderProducts("منتجات مميزة", products)}
    </div>
  );
}

export default Home;
