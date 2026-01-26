import React from 'react';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/all`);
      return response.data.products; 
    }
  });

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * (discount || 0) / 100)).toFixed(2);
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading collection...</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-800">Oops! Something went wrong</h2>
      <p className="text-gray-600 text-center mt-2">{error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Featured Products</h2>
          <p className="text-gray-600">Showing {products?.length} premium items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-[1.03] border border-gray-100">
              
              {/* UPDATED: Using product.id instead of product._id for cleaner URLs */}
              <Link to={`/products/info/${product.id}`}>
                <div className="relative bg-gray-50 h-64 overflow-hidden group cursor-pointer">
                  <img src={product.images} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500" />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">{product.category}</span>
                  <span className="text-xs text-gray-400">{product.brand}</span>
                </div>
                
                <Link to={`/products/info/${product.id}`}>
                  <h3 className="text-md font-bold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition">
                    {product.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{product.description}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <span className="text-lg font-black text-gray-900">${calculateDiscountedPrice(product.price, product.discountPercentage)}</span>
                    {product.discountPercentage > 0 && <span className="text-xs text-gray-400 line-through ml-2">${product.price}</span>}
                  </div>
                  
                  <Link 
                    to={`/products/info/${product.id}`} 
                    className="bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;