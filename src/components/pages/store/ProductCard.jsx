import React from 'react';
import { X, Star, Truck, Shield, RefreshCw, Loader2, AlertCircle, Lock, ShoppingCart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../../layout/UseauthStore';
import { useCartStore } from '../../layout/cartStore';
import Swal from 'sweetalert2';

const SingleProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Zustand Store Actions & State
    const addToCart = useCartStore((state) => state.addToCart);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/products/info/${id}`);
            return response.data.product;
        }
    });

    const calculateDiscountedPrice = (price, discount) => {
        return (price - (price * (discount || 0) / 100)).toFixed(2);
    };
    // ... inside SingleProductPage component ...

    

// ... inside the component ...

const handleCartAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const productData = {
        _id: product._id,
        id: product.id, // The unique identifier from your API
        title: product.title,
        price: parseFloat(calculateDiscountedPrice(product.price, product.discountPercentage)),
        image: product.images,
        category: product.category,
      };
  
      // 1. Call store and get success/fail result
      const wasAdded = addToCart(productData);
  
      // 2. Show notification based on result
      if (wasAdded) {
        Swal.fire({
          title: 'Added!',
          text: `${product.title} has been added to your cart.`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Already in Cart',
          text: 'This product is already in your order list.',
          icon: 'info',
          confirmButtonColor: '#4F46E5', // Matches your theme
        });
      }
    }
  };

    // --- NEW: Unified Handler for Button Click ---


    if (isLoading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    if (isError || !product) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl text-center shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold underline">Go Back</button>
            </div>
        </div>
    );

    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-gray-100 rounded-full transition-colors shadow-sm"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-10">
                    <div className="relative bg-gray-50 rounded-2xl flex items-center justify-center aspect-square md:aspect-auto md:h-full">
                        <img
                            src={product.images}
                            alt={product.title}
                            className="w-full h-full object-contain p-6"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                {product.category}
                            </span>
                            <p className="text-gray-500 text-sm mt-2">Brand: {product.brand}</p>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{product.rating}</span>
                            <span className="text-gray-400 ml-4">Stock: {product.stock} available</span>
                        </div>

                        <div className="mb-6 pb-6 border-b">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">${discountedPrice}</span>
                                {product.discountPercentage > 0 && (
                                    <span className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                        <div className="flex gap-4 mt-auto">
                            {/* --- UPDATED BUTTON --- */}
                            <button
                                onClick={handleCartAction}
                                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${isAuthenticated
                                        ? 'bg-gray-900 text-white hover:bg-blue-600'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                            >
                                {isAuthenticated ? (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Login to Purchase
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-8">
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <Truck className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <p className="text-[9px] font-bold">FREE SHIPPING</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <Shield className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <p className="text-[9px] font-bold">SECURE</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-xl">
                                <RefreshCw className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <p className="text-[9px] font-bold">30-DAY RETURN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProductPage;