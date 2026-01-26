import Navbar from '../components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import { Suspense, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../components/layout/UseauthStore.js"

const Layout = () => {
  const loginGlobal = useAuthStore(state => state.login);

  // useEffect(() => {
  //   axios.get(
  //     "/ido_shop_api/auth/me",
  //     { withCredentials: true }
  //   )
  //   .then(res => {
  //     loginGlobal(res.data.user);
  //   })
  //   .catch(err => {
  //     // ✅ EXPECTED when user is not logged in
  //     if (err.response?.status !== 401) {
  //       console.error("Auth restore error:", err);
  //     }
  //   });
  // }, []);
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Suspense fallback={<div className="text-center text-2xl font-bold py-20">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
