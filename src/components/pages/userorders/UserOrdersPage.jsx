import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, Phone, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../layout/UseauthStore';

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 1. Fetching logic with TanStack Query
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['userOrders', user?._id],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/orders/user-orders/${user._id}`);
      // Based on your controller, we return response.data.orders
      return response.data.orders;
    },
    enabled: !!user?._id, // Only run if user exists
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
      'Shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'Delivered': 'bg-green-100 text-green-700 border-green-200',
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 2. Loading State
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    </div>
  );

  // 3. Error State
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error.message || "Could not fetch orders."}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Back to Products
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Orders for {user?.user_name}</h1>
                <p className="text-gray-500 mt-1">Found {orders?.length || 0} orders in your history</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Package size={24} />
                      <div>
                        <p className="text-sm text-indigo-100">Order ID</p>
                        <p className="font-mono font-semibold">#{order.orderNumber.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={20} />
                      <div>
                        <p className="text-sm text-indigo-100">Order Date</p>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full border font-semibold shadow-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Package size={20} className="text-indigo-500" />
                      Products
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                          <tr>
                            <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Product</th>
                            <th className="text-center p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                            <th className="text-right p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="text-right p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((item) => (
                            <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  {/* Handling potential missing product data due to populate */}
                                  <img 
                                    src={item.product_id?.images || 'https://via.placeholder.com/150'} 
                                    alt={item.product_id?.title}
                                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-800">{item.product_id?.title || 'Unknown Product'}</p>
                                    <p className="text-sm text-gray-500">{item.product_id?.brand || 'Store Item'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-center font-semibold text-gray-700">
                                {item.quantity}
                              </td>
                              <td className="p-4 text-right font-semibold text-gray-700">
                                ${item.product_rtp.toFixed(2)}
                              </td>
                              <td className="p-4 text-right font-bold text-indigo-600">
                                ${(item.product_rtp * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-purple-600" />
                        Shipping To
                      </h4>
                      <p className="text-gray-800 font-medium">{order.user_adress}</p>
                      <p className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                        <Phone size={14} /> {order.user_phone}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-center items-end">
                      <span className="text-gray-600 font-semibold mb-1">Total Paid</span>
                      <span className="text-3xl font-bold text-indigo-600">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center bg-white p-20 rounded-3xl shadow-xl">
              <Package size={64} className="mx-auto text-gray-200 mb-4" />
              <h2 className="text-xl font-bold text-gray-400">No orders found yet!</h2>
              <button onClick={() => navigate('/products')} className="mt-4 text-indigo-600 font-bold underline">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}