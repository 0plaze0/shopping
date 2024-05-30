import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <ToastContainer />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
