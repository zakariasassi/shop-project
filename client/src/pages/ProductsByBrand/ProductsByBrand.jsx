import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import OfferSlider from "../../components/OfferSlider/OfferSlider";
import BannerView from "../../components/Bannar/BannerView";
import { useQuery } from "react-query";
import { getallofferProudacts } from "../../api/Offers";
import { useLocation } from 'react-router-dom';
import { getallBrandCategoryProudacts } from "../../api/Products";
function ProductsByBrand() {

    const location = useLocation();
    const {
      data: products,
      isLoading: loadingProducts,
      error: errorLoadingProducts,
    } = useQuery({
      queryKey: ["productbybrand", `brand/getallbybrandid?id=${location.state.id}`],
      queryFn: ({ queryKey }) => getallBrandCategoryProudacts(queryKey[1]),
    });
    const [loadingFilteredProducts, setLoadingFilteredProducts] = useState(false);
  
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
      price: 10000,
      mcategories: [],
      scategories: [],
      bcategories: [],
    });
  console.log(products);

    useEffect(() => {
      if (products) {
        setLoadingFilteredProducts(true);
  
        let filtered = products?.filter((product) => {
          return product.price <= filters.price;
        });
  
        if (filters.mcategories.length > 0) {
          filtered = filtered.filter((product) =>
            filters.mcategories.includes(product?.MainCategory?.name)
          );
        }
  
        if (filters.scategories.length > 0) {
          filtered = filtered.filter((product) =>
            filters.scategories.includes(product?.SubCategory?.name)
          );
        }
  
        if (filters.bcategories.length > 0) {
          filtered = filtered.filter((product) =>
            filters.bcategories.includes(product?.BrandCategory?.name)
          );
        }
  
        setLoadingFilteredProducts(false);
  
        setFilteredProducts(filtered);
      }
    }, [filters, products]);
  
    if (loadingProducts)
      return <div className="text-center">جاري تحميل البيانات...</div>;
    if (errorLoadingProducts)
      return <div className="text-center">Error loading products</div>;
  
    return (
      <>
      
        <div className="flex flex-col h-full border-2 rounded-lg lg:flex-row" dir="rtl">
          <div className="top-0 z-20 w-full h-full p-5 overflow-y-auto lg:w-1/4">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="w-full p-2 m-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
              {loadingFilteredProducts ? (
                <div>Loading filtered products...</div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
}

export default ProductsByBrand

