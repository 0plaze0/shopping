import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

import { SEO } from "../../components";
import { api } from "./../../config/api";
import "./../Auth/AuthStyles.css";

const seo = {
  title: "profile",
};

const DashBoard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [auth, setAuth] = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/api/v1/auth/update-profile", {
        ...formData,
      });
      if (data.success) {
        setAuth((prev) => ({ ...prev, ["user"]: data.updateUser }));
        let updatedUser = JSON.parse(localStorage.getItem("auth"));
        updatedUser.user = data.updateUser;
        localStorage.setItem("auth", JSON.stringify(updatedUser));
        toast.success("Profile Updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while updating profile");
    }
  };
  useEffect(() => {
    const user = auth?.user;
    setFormData(user);
  }, []);

  return (
    <div>
      <SEO {...seo} />
      <div className="register form-container">
        <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group d-flex flex-column gap-3">
            {/* name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="name"
              onChange={(e) => handleChange(e)}
            />
            {/* email */}
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="email"
              onChange={(e) => handleChange(e)}
              disabled
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="address"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              placeholder="phone"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashBoard;
