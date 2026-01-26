import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout";

const About = lazy(() => import("../components/pages/about/About"));
const Register = lazy(() => import("../components/pages/Register"));
const Login = lazy(() => import("../components/pages/login/Login"));
const ResetPassword = lazy(() => import("../components/pages/resetpassword/ResetPassword"));
const ProductsPage = lazy(() => import("../components/pages/store/ProductsPage"));
const SingleProductPage = lazy(() => import("../components/pages/store/ProductCard"));
const OrderPage = lazy(() => import("../components/pages/order/OrderPage"));
const BeforePymentPage = lazy(() => import("../components/pages/order/BeforePymentPage"));
const PaypalButton = lazy(() => import("../components/pages/paypal/PaypalButton"));
const UserDetailsPage = lazy(() => import("../components/pages/userdetails/UserDetailsPage"));
const UserOrdersPage = lazy(() => import("../components/pages/userorders/UserOrdersPage"));
const Support = lazy(() => import("../components/pages/support/Support"));
const AddressPhoneFormModal = lazy(() => import("../components/pages/login/Adress_phone_google"));
// const RootLayout =lazy(() => import("../routers/RoutLayout"))



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<About />} />
      <Route path="about" element={<About />} />
      <Route path="register" element={<Register />} />

      <Route path="login" element={<Login />} />
      <Route path="auth/reset-password" element={<ResetPassword />} />
      <Route path="products" element={< ProductsPage />} />
      <Route path="products/info/:id" element={<SingleProductPage />} />
      <Route path="cart" element={< OrderPage />} />
      <Route path="order" element={< BeforePymentPage />} />
      <Route path="profile" element={< UserDetailsPage />} />
      <Route path="orders" element={< UserOrdersPage />} />
      <Route path="support" element={< Support />} />

      <Route path="/checkout/contact" element={<AddressPhoneFormModal />} />


    </Route>
  )
);