import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { SEO } from "../../components";
import { api } from "./../../config/api";
import { useAuth } from "../../context/auth";

const seo = {
  title: "login",
};
const fields = ["email", "password"];

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((preData) => ({ ...preData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/auth/login", { ...formData });
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
      } else toast.error(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Something went Wrong!");
    }
  };
  return (
    <div>
      <SEO {...seo} />
      <div className="register form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group d-flex flex-column gap-3">
            {fields.map((field) => (
              <input
                key={`${field}`}
                name={`${field}`}
                value={`${formData[field]}`}
                onChange={(e) => handleChange(e)}
                type={
                  field == "email"
                    ? "email"
                    : field == "password"
                    ? "password"
                    : "text"
                }
                className="form-control"
                placeholder={`Enter ${field}`}
                required
              />
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
