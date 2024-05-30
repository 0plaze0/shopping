import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { SEO } from "../../components";
import { api } from "./../../config/api";
import "./AuthStyles.css";

const seo = {
  title: "Register",
};
const fields = ["name", , "phone", "address", "email", "password"];

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((preData) => ({ ...preData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/auth/register", { ...formData });
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
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
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group d-flex flex-column gap-3">
            {fields.map((field) => (
              <>
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
              </>
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

export default Register;
