import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL, IMAGE_URL } from "../../constant/URL";

const fetchProducts = async (searchTerm) => {
  try {
    const { data } = await axios.post(
      `${URL}product/searchproduct`,
      { name: searchTerm },
      {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.response.data.error);
  }
};

function BannerView() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery(
    ["product", searchTerm],
    () => fetchProducts(searchTerm),
    {
      enabled: !!searchTerm,
      staleTime: 1000 * 60 * 5,
    }
  );

  const handleProductClick = (product) => {
    navigate(`/products/prodact-details`, { state: { product } });
  };

  return (
<div className="flex flex-row items-center justify-center w-full h-32 bg-primary">
  <div className="flex flex-col items-center w-[70%] max-w-md">
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="البحث عن منتج"
        className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-md"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      {/* Search icon inside input */}
      <span className="absolute text-gray-400 pointer-events-none left-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.35 12.35A7.5 7.5 0 1112 4.5a7.5 7.5 0 014.35 12.35z" />
        </svg>
      </span>
      {/* Clear (X) icon */}
      {searchTerm && (
        <button onClick={() => setSearchTerm('')} className="absolute text-gray-400 right-3 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>

    {/* Search result or loading/error states */}
    {isLoading && <div className="mt-2 text-blue-500">Loading...</div>}
    {error && <p className="mt-2 text-red-500">{error.message}</p>}

    {products && (
      <div className="relative w-full mt-4">
        <div className="absolute w-full p-5 overflow-y-auto bg-white rounded-lg shadow-lg max-h-48" style={{ zIndex: 1000 }}>
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleProductClick(product)}
              >
                <div className="flex items-center">
                  <img
                    src={`${IMAGE_URL}images/${product.ProductImages[0].imageUrl}`}
                    alt={product.TradeName}
                    className="w-12 h-12 mr-2 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{product.TradeName}</p>
                    <p className="text-sm text-gray-500">{product.ScientificName}</p>
                  </div>
                </div>
                <span className="text-lg">{product.price} د.ل</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
</div>

  );
}

export default BannerView;
