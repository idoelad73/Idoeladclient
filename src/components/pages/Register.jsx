

import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, MapPin, Phone } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '../layout/UseauthStore';
import axios from 'axios';

const Register = () => {
  const login = useAuthStore((state) => state.login);

  const [serverError, setServerError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
    user_phone: '',
    user_adress: '',
  });

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/auth/register`,
        newUser
      );
      return response.data;
    },

    onSuccess: (data) => {
      setServerError('');
      setIsRegistered(true);
      login(data.user || formData);
    },

    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        setServerError(message || 'User already existed');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    mutation.mutate(formData);
  };

  /* ✅ SUCCESS SCREEN — only after real creation */
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-purple-600">
            Welcome, {formData.user_name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Account created successfully. Please check your email for verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-purple-600">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              Create Account
            </h1>
          </div>

          {/* ✅ SERVER ERROR MESSAGE */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="user_name"
                  required
                  value={formData.user_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="user_email"
                  required
                  value={formData.user_email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="user_phone"
                  required
                  value={formData.user_phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address(min 10 characters)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <textarea
                  name="user_adress"
                  required
                  rows="2"
                  value={formData.user_adress}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password(min 8 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="user_password"
                  required
                  value={formData.user_password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold flex justify-center"
            >
              {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
