import React from 'react';
import { ShoppingBag, Truck, Award, Heart, Zap, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Wide Selection",
      description: "Thousands of products across all categories to meet your every need."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Lightning-fast shipping to get your orders to you in record time."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Premium Quality",
      description: "Only the best products that meet our rigorous quality standards."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority, always and forever."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Crazy Deals",
      description: "Unbeatable prices and insane discounts that'll blow your mind."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Join millions of happy shoppers in our growing family."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Welcome to Crazy Shopping! 🛍️
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Your one-stop destination for everything you need, want, and didn't even know you wanted!
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              Founded in 2020, Crazy Shopping started with a simple idea: make online shopping fun, 
              easy, and accessible to everyone. What began as a small startup has now grown into a 
              thriving marketplace loved by millions.
            </p>
            <p>
              We believe shopping should be an experience, not just a transaction. That's why we've 
              created a platform that combines the best products, the best prices, and the best 
              customer service in one crazy-good package.
            </p>
            <p>
              Our team works tirelessly to bring you the latest trends, the hottest deals, and the 
              most innovative products from around the world. We're not just a shopping platform—we're 
              your shopping companion on this wild retail adventure!
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-transparent hover:border-purple-500"
              >
                <div className="text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-xl text-center max-w-4xl mx-auto leading-relaxed">
            To revolutionize the way people shop online by creating a platform that's not just 
            functional, but fun, exciting, and genuinely crazy about customer satisfaction. We're 
            here to make every shopping experience memorable, every deal incredible, and every 
            customer a part of our crazy shopping family!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              500K+
            </div>
            <div className="text-gray-600 mt-2">Happy Customers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              50K+
            </div>
            <div className="text-gray-600 mt-2">Products</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              100+
            </div>
            <div className="text-gray-600 mt-2">Countries</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              24/7
            </div>
            <div className="text-gray-600 mt-2">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
