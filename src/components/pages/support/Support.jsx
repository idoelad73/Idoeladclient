import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Hash, 
  Tag, 
  Send, 
  FileText, 
  Loader2, 
  CheckCircle, 
  Mail 
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../../layout/UseauthStore';

export default function OpenSupportPage() {
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    request: ''
  });

  const categories = [
    { value: 'business', label: 'Business Inquiry', icon: '💼' },
    { value: 'technical', label: 'Technical Support', icon: '⚙️' },
    { value: 'billing', label: 'Billing & Payments', icon: '💳' },
    { value: 'account', label: 'Account Issues', icon: '👤' },
    { value: 'product', label: 'Product Information', icon: '📦' },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: '💡' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  // --- Mutation for sending email ---
  const emailMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        name: user?.user_name || 'Guest',
        user_email: user?.user_email,
        subject: data.subject,
        category: data.category,
        message: data.request
      };
      return await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/support/send-ticket`,
        payload
      );
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to send email');
    }
  });

  // --- Mutation for creating ticket in MongoDB ---
  const ticketMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        user_id: user?._id,
        name: user?.user_name || 'Guest',
        user_email: user?.user_email,
        subject: data.subject,
        category: data.category,
        message: data.request,
        priority: 'medium'
      };
      return await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/support/create-ticket`,
        payload
      );
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to create ticket');
    }
  });

  // --- Handle form changes ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- Handle submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.request.trim() || !formData.subject.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // First send the email
    emailMutation.mutate(formData, {
      onSuccess: () => {
        // Then create the ticket in MongoDB
        ticketMutation.mutate(formData, {
          onSuccess: () => {
            setSubmitted(true);
            setFormData({ category: '', subject: '', request: '' });
          }
        });
      }
    });
  };

  // --- Success View ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md border border-indigo-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you, <strong>{user?.user_name}</strong>. Your support request has been sent. 
            Check <strong>{user?.user_email}</strong> for a confirmation email.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Send Another Request
          </button>
        </div>
      </div>
    );
  }

  // --- Form View ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl shadow-2xl mb-4">
            <MessageSquare size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Support Center</h1>
          <p className="text-gray-600">Need help? Send us an email and we'll get back to you.</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p className="text-indigo-100 mt-1">Direct email to our support team</p>
            </div>
            <Mail className="text-white opacity-40" size={40} />
          </div>

          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  <User size={16} className="text-indigo-500" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.user_name || 'Not Logged In'}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium"
                />
              </div>

              {/* User ID */}
              <div>
                {/* <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  <Hash size={16} className="text-purple-500" />
                  User ID */}
                {/* </label> */}
                {/* <input
                  type="text"
                  value={user?._id || 'N/A'}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-400 font-mono text-xs cursor-not-allowed"
                /> */}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <FileText size={16} className="text-blue-500" />
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 transition-colors font-medium text-gray-800"
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <Tag size={16} className="text-pink-500" />
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors font-medium text-gray-800 cursor-pointer"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Body */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                <MessageSquare size={16} className="text-indigo-500" />
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="request"
                value={formData.request}
                onChange={handleChange}
                rows="5"
                placeholder="How can we help you today?"
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 transition-colors font-medium text-gray-800 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={emailMutation.isPending || ticketMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none"
            >
              {(emailMutation.isPending || ticketMutation.isPending) ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> 
                  Sending...
                </>
              ) : (
                <>
                  <Send size={24} /> 
                  Send Request
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 italic">
              Note: This will send an email and create a support ticket in the system.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
