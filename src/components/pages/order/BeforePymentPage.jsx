import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

import { useCartStore } from '../../layout/cartStore';
import { useOrderStore } from '../../layout/BeforePymentStore';
import useAuthStore from '../../layout/UseauthStore';

export default function OrderSummary() {
    const navigate = useNavigate();

    const { cartItems, clearCart } = useCartStore();
    const { orderRequest, setOrderItems, setContactInfo } = useOrderStore();
    const { user, isAuthenticated } = useAuthStore();

    const [createdOrderNumber, setCreatedOrderNumber] = useState(null);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    // ===============================
    // Create Order Mutation
    // ===============================
    const { mutate, isPending } = useMutation({
        mutationFn: async (newOrder) => {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/createorder`,
                newOrder
            );
            return response.data;
        },

        onSuccess: (data) => {
            const orderNumber = data?.order?.orderNumber;
            setCreatedOrderNumber(orderNumber);

            Swal.fire({
                title: '🎉 Order Placed Successfully!',
                html: `
                    <p>Your order has been placed.</p>
                    <p style="margin-top:10px;">
                        <strong>Order Number:</strong><br/>
                        <span style="font-size:24px; color:#9333ea;">
                            ${orderNumber}
                        </span>
                    </p>
                    <p style="margin-top:12px; font-size:12px; color:#666;">
                        Please save this number for tracking and support.
                    </p>
                `,
                icon: 'success',
                confirmButtonColor: '#9333ea'
            }).then(() => {
                clearCart();
                navigate('/orders');
            });
        },

        onError: (error) => {
            console.error("Order Error:", error);
          
            const response = error?.response?.data;
          
            // ✅ ZOD MIDDLEWARE ERRORS (string[])
            if (response?.errors && Array.isArray(response.errors)) {
              const errorHtml = response.errors
                .map(msg => `
                  <div style="text-align:left; margin-bottom:6px; color:#dc2626;">
                    • ${msg}
                  </div>
                `)
                .join('');
          
              return Swal.fire({
                title: 'Validation Error',
                html: errorHtml,
                icon: 'error',
                confirmButtonColor: '#9333ea'
              });
            }
          
            // ✅ FALLBACK
            Swal.fire({
              title: 'Error',
              text: response?.message || 'Failed to place order.',
              icon: 'error'
            });
          }
          
    });

    // ===============================
    // Sync Store Data on Load
    // ===============================
    useEffect(() => {
        if (isAuthenticated && user && cartItems.length > 0) {
            setOrderItems(cartItems, totalPrice);
            setContactInfo({
                user_adress: user.user_adress,
                user_phone: user.user_phone,
                notes: ""
            });
        }
    }, [
        isAuthenticated,
        user,
        cartItems,
        totalPrice,
        setOrderItems,
        setContactInfo
    ]);

    // ===============================
    // Route Protection
    // ===============================
    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        if (cartItems.length === 0) navigate('/products');
    }, [isAuthenticated, cartItems.length, navigate]);

    // ===============================
    // Final Submit Handler
    // ===============================
    const handleFinalSubmit = async () => {
        
        if (!user?._id) {
          return Swal.fire('User Error', 'Please log in again.', 'error');
        }
      
        // 1️⃣ Resolve final contact info
        const finalAddress = orderRequest.user_adress || user.user_adress;
        const finalPhone = orderRequest.user_phone || user.user_phone;
      
        if (!finalAddress || !finalPhone) {
            Swal.fire({
              title: 'Missing Information',
              text: 'Please provide shipping address and phone number',
              icon: 'warning',
              confirmButtonText: 'Continue'
            }).then(() => {
              navigate('/checkout/contact');
            });
            return;
          }
      
        // 2️⃣ Build order payload
        const orderPayload = {
          user_id: user._id,
          user_adress: finalAddress,
          user_phone: finalPhone,
          notes: orderRequest.notes || "",
          total_price: totalPrice,
          products: cartItems.map(item => ({
            product_id: item._id,
            quantity: item.qty,
            product_rtp: item.price
          }))
        };
      
        // 3️⃣ Validate products
        const hasInvalidProducts = orderPayload.products.some(
          p => !p.product_id
        );
        if (hasInvalidProducts) {
          return Swal.fire(
            'Error',
            'Invalid Product IDs found.',
            'error'
          );
        }
      
        try {
          // 4️⃣ Update user contact ONLY if needed
          if (
            finalAddress !== user.user_adress ||
            finalPhone !== user.user_phone
          ) {
            await axios.patch(
              `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/update-contact`,
              {
                user_id: user._id,
                user_adress: finalAddress,
                user_phone: finalPhone,
              }
            );
          }
      
          // 5️⃣ Create order
          mutate(orderPayload);
      
        } catch (err) {
          console.error('Checkout error:', err);
          Swal.fire(
            'Error',
            'Failed to save contact details. Please try again.',
            'error'
          );
        }
      };
      

    if (!isAuthenticated || cartItems.length === 0) return null;

    // ===============================
    // UI
    // ===============================
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="uppercase text-sm tracking-widest">
                        Back to Cart
                    </span>
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-10 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-5xl font-black mb-2">
                                    Checkout
                                </h2>
                                <p className="opacity-80 text-lg">
                                    Hi {user?.user_name}, let's finalize your order.
                                </p>
                            </div>
                            <Package size={60} className="opacity-20" />
                        </div>
                    </div>

                    <div className="p-8 md:p-12">

                        {/* Shipping & Contact Info */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                                <h3 className="flex items-center gap-2 font-black uppercase text-purple-400 text-xs mb-4">
                                    <CreditCard size={14} /> Shipping Address
                                </h3>
                                <p className="text-xl font-bold text-gray-800">
                                    {orderRequest.user_adress || user?.user_adress}
                                </p>
                            </div>

                            <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100">
                                <h3 className="flex items-center gap-2 font-black uppercase text-pink-400 text-xs mb-4">
                                    <CreditCard size={14} /> Contact Number
                                </h3>
                                <p className="text-xl font-bold text-gray-800">
                                    {orderRequest.user_phone || user?.user_phone}
                                </p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-12">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 px-2">
                                Review Items ({cartItems.length})
                            </h3>

                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-20 h-20 rounded-2xl object-cover"
                                            />
                                            <div>
                                                <p className="font-bold text-lg">
                                                    {item.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.qty} × ${item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-black text-xl">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                            <div>
                                <p className="text-gray-400 uppercase text-xs font-black">
                                    Total Payable
                                </p>
                                <p className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    ${totalPrice.toFixed(2)}
                                </p>
                            </div>

                            <button
                                onClick={handleFinalSubmit}
                                disabled={isPending}
                                className={`px-12 py-5 rounded-2xl font-black text-xl transition-all
                                    ${isPending
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90'
                                    }`}
                            >
                                {isPending ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
