import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { Outlet } from "react-router-dom";

import CartDrawer from "./Components/Cart/CartDrawer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;