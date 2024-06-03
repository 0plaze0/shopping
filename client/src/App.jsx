import { Routes, Route } from "react-router-dom";

import {
  About,
  HomePage,
  Pagenotfound,
  Policy,
  Contact,
  Register,
  Login,
  Dashboard,
  ForgotPassword,
  AdminDashboard,
  CreateCategory,
  CreateProduct,
  Users,
} from "./pages";

import { Layout, Private, AdminRoutes, AdminLayout } from "./components";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Private />}>
            <Route path="user" element={<Dashboard />} />
          </Route>
          <Route path="/dashboard" element={<AdminRoutes />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route path="info" element={<AdminDashboard />} />
              <Route path="create-category" element={<CreateCategory />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Pagenotfound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
