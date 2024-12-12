'use client'

import React, { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Loader2 } from "lucide-react"
import ProductCard from "../../components/ProductCard/ProductCard"
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar"
import BannerView from "../../components/Bannar/BannerView"
import { getProducts } from "../../api/Products"
import Loading from "../../components/Loading/Loading"
import NoData from '../../components/NoData/NoData'
import SEO from "../../components/SEO"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [filters, setFilters] = useState({
    price: 10000,
    mcategories: [],
    scategories: [],
    bcategories: [],
  })

  const {
    data: products,
    isLoading: loadingProducts,
    error: errorLoadingProducts,
  } = useQuery({
    queryKey: ["products", `product/to-store?page=${currentPage}&filter=${JSON.stringify(filters)}`],
    queryFn: ({ queryKey }) => getProducts(queryKey[1]),
    keepPreviousData: true,
  })

  const [loadingFilteredProducts, setLoadingFilteredProducts] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    if (products?.products) {
      setLoadingFilteredProducts(true)

      let filtered = products.products.filter((product) => {
        return product.price <= filters.price
      })

      if (filters.mcategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.mcategories.includes(product?.MainCategory?.id)
        )
      }

      if (filters.scategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.scategories.includes(product?.SubCategory?.id)
        )
      }

      if (filters.bcategories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.bcategories.includes(product?.BrandCategory?.id)
        )
      }

      setLoadingFilteredProducts(false)
      setFilteredProducts(filtered)
    }
  }, [filters, products])

  if (loadingProducts) return <Loading />
  if (errorLoadingProducts) return <div className="text-center text-red-500">Error loading products</div>
  if (products?.products?.length === 0) return <NoData />

  return (
    <>


      <div className="container px-4 py-8 mx-auto" dir="rtl">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="w-full lg:w-3/4">
            {loadingFilteredProducts ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 max-sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={`${product.id}-${index}`} product={product} />
                ))}
              </div>
            )}

            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    
                    href="#" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!products?.hasNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products