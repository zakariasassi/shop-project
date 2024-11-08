import React, { useState, useEffect } from "react";
import { Row, Col, Grid, Pagination } from "antd";
import ProductCard from "../../components/ProductCard/ProductCard";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import BannerView from "../../components/Bannar/BannerView";
import { useQuery } from "react-query";
import { getallMainCategoryProudacts, getProducts } from "../../api/Products";
import Loading from "../../components/Loading/Loading";
import NoData from './../../components/NoData/NoData';
import { useLocation } from "react-router-dom";
const { useBreakpoint } = Grid;

const ProductsByBrand = () => {
  const screens = useBreakpoint();
  const location  = useLocation()
  const [currentPage, setCurrentPage] = useState(1); // Keep track of the current page
  const [pageSize] = useState(10); // Number of products per page

  const [filters, setFilters] = useState({
    price: 10000,
    mcategories: [],
    scategories: [],
    bcategories: [],
  });
 



  const {
    data: products,
    isLoading: loadingProducts,
    error: errorLoadingProducts,
  } = useQuery({
    queryKey: ["products", `product/main/getallproudactbymaincategory?id=${location.state.id}&page=${currentPage}&filter=${JSON.stringify(filters)}`],

    queryFn: ({ queryKey }) => getallMainCategoryProudacts(queryKey[1]),
  });

  const [loadingFilteredProducts, setLoadingFilteredProducts] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    if (products?.products) {
      setLoadingFilteredProducts(true);

      let filtered = products?.products.filter((product) => {
        return product.price <= filters.price;
      });

      if (filters.mcategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.mcategories.includes(product?.MainCategory?.id)
        );
      }

      if (filters.scategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.scategories.includes(product?.SubCategory?.id)
        );
      }

      if (filters.bcategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.bcategories.includes(product?.BrandCategory?.id)
        );
      }

      setLoadingFilteredProducts(false);
      setFilteredProducts(filtered);
    }
  }, [filters, products]);

  if (loadingProducts)
    return <><Loading /></>;
  if (errorLoadingProducts)
    return <div className="text-center">Error loading products</div>;
  if (products?.products?.length === 0) {
    return <div><NoData /></div>;
  }

  if (loadingProducts) {
    return (
      <>
        <Loading />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full lg:flex-row" dir="rtl">
        <div className="w-full lg:w-1/4">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>
        <div className="w-full p-2">
          {loadingFilteredProducts ? (
            <Loading />
          ) : (
            <Row gutter={[2, 16]}>
              {filteredProducts.map((product, index) => (
                <Col
                  key={`${product.id}-${index}`}
                  xs={12}  // Show two products per row on small screens
                  sm={12}
                  md={8}
                  lg={6}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination Controls */}
          <Pagination
            current={currentPage}
            total={products?.totalProducts || 0} // Total number of products
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)} // Update current page on change
            showSizeChanger={false} // Optional: disable page size change
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsByBrand;
