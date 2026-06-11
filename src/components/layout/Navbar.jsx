import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Loader2, User, Package, Menu, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from './UseauthStore';
import { useCartStore } from './cartStore';

export default function Navbar() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const user = useAuthStore((state) => state.user);
  const logoutLocal = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      
      // Using relative path to work with your Vite Proxy
      return await axios.post('/ido_shop_api/auth/logout');
      { withCredentials: true }
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      console.log('token removed');
      logoutLocal();
      navigate('/login');
    },
    onError: (error) => {
      localStorage.removeItem("token");
      console.log('token removed');
      console.error('Logout failed:', error);
      logoutLocal(); // Still clear local state for safety
      navigate('/login');
    }
  });

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl sm:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              My Crazy Shop
            </Link>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/products"
              className="text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Products
            </Link>

            {/* LOGGED IN VIEW */}
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Package className="h-4 w-4 mr-1.5" />
                  My Orders
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <User className="h-4 w-4 mr-1.5" />
                  {user.user_name}
                </Link>

                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center text-white bg-red-500 bg-opacity-20 hover:bg-opacity-40 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-400 border-opacity-30 ml-2"
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart (Always visible) */}
            <Link
              to="/cart"
              className="relative text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-indigo-900 animate-in fade-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              to="/support"
              className="text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Support
            </Link>

            <Link
              to="/about"
              className="text-white hover:bg-indigo-900 hover:bg-opacity-60 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              About
            </Link>
          </div>

          {/* Mobile: Cart icon + Hamburger button */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              to="/cart"
              className="relative text-white p-2 rounded-lg hover:bg-indigo-900 hover:bg-opacity-60"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2 rounded-lg hover:bg-indigo-900 hover:bg-opacity-60"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-3 space-y-1 border-t border-indigo-500">
          <Link
            to="/products"
            onClick={() => setMobileOpen(false)}
            className="block text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            Products
          </Link>

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                <Package className="h-4 w-4" /> My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                <User className="h-4 w-4" /> {user.user_name}
              </Link>
              <button
                onClick={() => { setMobileOpen(false); logoutMutation.mutate(); }}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 w-full text-white bg-red-500 bg-opacity-20 py-2.5 px-3 rounded-lg font-medium border border-red-400 border-opacity-30 hover:bg-opacity-40 transition-colors"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><LogOut className="h-4 w-4" /> Logout</>
                )}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}

          <Link
            to="/support"
            onClick={() => setMobileOpen(false)}
            className="block text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            Support
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-white py-2.5 px-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}