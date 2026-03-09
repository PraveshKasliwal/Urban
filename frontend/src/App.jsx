import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/SignUp";
import MainPage from "./Pages/MainPage/MainPage";
import Product from "./Pages/Product/Product";
import Men from "./Pages/Product/Men/Men";
import Women from "./Pages/Product/Women/Women";
import ProductDescription from "./Pages/ProductDescription/ProductDescription";
import EditProduct from "./Components/AdminComponents/EditProduct/EditProduct";
import MainLayout from "./MainLayout";
import Profile from "./Pages/Profile/Profile";
import Admin from "./Pages/Admin/Admin";
import ProtectedRoute from "./util/ProtectedRoute";
import Checkout from "./Pages/Checkout/Checkout";
import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess";
import StyleStudio from "./Pages/StyleStudio/StyleStudio";

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
        }
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes (NO navbar, NO footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main layout routes (WITH navbar & footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/product/men" element={<Men />} />
          <Route path="/product/women" element={<Women />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/style-studio" element={<StyleStudio />} />
        </Route>

        {/* Admin protected route */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} />}
        />
        <Route
          path="/admin/edit-product/:id"
          element={<ProtectedRoute element={<EditProduct />} />}
        />

        {/* Fallback */}
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-success/:orderId"
          element={<ProtectedRoute element={<OrderSuccess />} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;