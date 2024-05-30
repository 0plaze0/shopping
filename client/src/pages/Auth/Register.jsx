import { useState } from "react";
import { toast } from "react-toastify";

import { SEO } from "../../components";

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

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((preData) => ({ ...preData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    toast.success("Registered Successfully!");
  };
  return (
    <div>
      <SEO {...seo} />
      <div className="register">
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
