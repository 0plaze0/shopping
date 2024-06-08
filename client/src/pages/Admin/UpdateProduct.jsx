import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const [categorires, setCategorires] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    shipping: "",
  });
  const [id, setId] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const requiredField = Object.keys(formData);
  const { slug } = useParams();

  const getProduct = async () => {
    try {
      const { data } = await api(`/api/v1/product/get-products/${slug}`);
      const { product } = data;
      const id = product.category._id;

      if (data.success) {
        for (const field of requiredField)
          setFormData((prev) => ({ ...prev, [field]: product[field] }));
      }

      setFormData((prev) => ({ ...prev, ["category"]: id }));
      setId(id);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting product");
    }
  };

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
    getProduct();
  }, []);
  useEffect(() => {
    getAllCategories();
  }, []);

  //create product
  const handleUpdate = async () => {
    try {
      const productData = new FormData();
      for (const field of requiredField) {
        productData.append(field, formData[field]);
      }
      productData.append("photo", photo);
      const { data } = await api.put(
        `/api/v1/product/update-product/${formData._id}`,
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

  const handleDelete = async () => {
    try {
      const answer = window.prompt("Do you want to delete the product?");
      if (!answer) return;
      const { data } = await api.delete(
        `/api/v1/product/delete-product/${formData._id}`
      );
      if (data) {
        toast.success("Product created Successfully");
        navigate("/dashboard/admin/products");
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Something when wrong while deleting");
    }
  };

  return (
    <div>
      <h1>Update Product</h1>
      <div className="m-1 w-75">
        <Select
          size="large"
          placeholder="Select a category"
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ["category"]: value }))
          }
          showSearch
          className="form-select mb-3"
          value={id}
        >
          {categorires.map((category) => (
            <Option key={category._id} value={category.id}>
              {/* Here value is associated with name, [value]:name so if you pass id we will get name */}
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
          {photo ? (
            <div className="text-center">
              <img
                src={URL?.createObjectURL(photo)}
                alt="product-photo"
                height={"200px"}
                className="img img-responsive"
              />
            </div>
          ) : (
            <div className="text-center">
              <img
                src={`${import.meta.env.VITE_API}api/v1/product/product-photo/${
                  formData._id
                }`}
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
                setFormData((prev) => ({
                  ...prev,
                  ["shipping"]: parseInt(value),
                }))
              }
              className="form-select mb-3"
              size="large"
              placeholder="Select Shipping"
              value={formData.shipping ? "Yes" : "No"}
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
          </div>
        </>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn-danger m-3" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
