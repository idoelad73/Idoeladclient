import React, { useState } from "react";
import { LogIn, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import useAuthStore from "../../layout/UseauthStore";
import { useCartStore } from "../../layout/cartStore";

const Login = () => {
  const navigate = useNavigate();
  const loginGlobal = useAuthStore((state) => state.login);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ---------------- EMAIL / PASSWORD LOGIN ---------------- */

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      loginGlobal(data.user || data);
      clearCart();
      navigate("/about");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      user_email: formData.email,
      user_password: formData.password,
    });
  };

  /* ---------------- GOOGLE LOGIN (FIXED) ---------------- */

  const googleMutation = useMutation({
    mutationFn: async (code) => {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/auth/google`,
        { code },
        { withCredentials: true }
      );
      return res.data;
    },

    onSuccess: (data) => {
      loginGlobal({
        _id: data.user._id,
        user_name: data.user.user_name,
        user_email: data.user.user_email,
        user_role: data.user.user_role,
        // user_profile_image: data.user.user_profile_image || null,
      });

      clearCart();
      navigate("/about");
    },

    onError: (error) => {
      console.error(
        "Google login failed:",
        error.response?.data || error.message
      );
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      // AUTH CODE FROM GOOGLE
      googleMutation.mutate(response.code);
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
    },
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {loginMutation.isError && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded flex gap-2">
            <AlertCircle />
            Login failed
          </div>
        )}

        {/* GOOGLE LOGIN */}
        <button
          onClick={() => googleLogin()}
          className="w-full mb-4 flex items-center justify-center gap-3 border rounded py-2 hover:bg-gray-100"
          disabled={googleMutation.isPending}
        >
          <FcGoogle size={22} />
          {googleMutation.isPending ? "Signing in..." : "Login with Google"}
        </button>

        <div className="text-center text-gray-400 mb-4">or</div>

        {/* EMAIL LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            {loginMutation.isPending ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
