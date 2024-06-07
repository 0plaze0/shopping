import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const [categorires, setCategorires] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    shipping: "",
  });
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const requiredField = Object.keys(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAllCategories = async () => {
    try {
      const { data } = await api("/api/v1/category/get-category");
      if (data?.success) {
        setCategorires(data.category);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while getting categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  //create product
  const handleSubmit = async () => {
    try {
      const productData = new FormData();
      for (const field of requiredField) {
        productData.append(field, formData[field]);
      }
      productData.append("photo", photo);
      const { data } = await api.post(
        "/api/v1/product/create-product",
        productData
      );
      if (data.success) {
        toast.success("Product created Successfully");
        navigate("/dashboard/admin/products");
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating product");
    }
  };

  return (
    <div>
      <h1>Manage Product</h1>
      <div className="m-1 w-75">
        <Select
          size="large"
          placeholder="Select a category"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ["category"]: value }))
          }
          showSearch
          className="form-select mb-3"
        >
          {categorires.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <div>
          <label className="btn btn-outline-secondary col-md-12">
            {photo ? photo.name : "Upload a photo"}
            <input
              type="file"
              name="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
              hidden
            />
          </label>
        </div>
        <div className="mb-3">
          {photo && (
            <div className="text-center">
              <img
                src={URL?.createObjectURL(photo)}
                alt="product-photo"
                height={"200px"}
                className="img img-responsive"
              />
            </div>
          )}
        </div>
        <>
          <div className="mb-3">
            <input
              type="text"
              name={"name"}
              value={formData.name}
              onChange={(e) => handleChange(e)}
              placeholder={`Write Name`}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <textarea
              name={"description"}
              value={formData.description}
              onChange={(e) => handleChange(e)}
              placeholder={`Write Description`}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name={"quantity"}
              value={formData.quantity}
              onChange={(e) => handleChange(e)}
              placeholder={`Write quantity`}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name={"price"}
              value={formData.price}
              onChange={(e) => handleChange(e)}
              placeholder={`Write price`}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <Select
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, ["shipping"]: value }))
              }
              className="form-select mb-3"
              size="large"
              placeholder="Select Shipping"
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
          </div>
        </>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
