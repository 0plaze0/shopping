import { useState, useEffect } from "react";
import { api } from "../../config/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    try {
      const { data } = await api("/api/v1/product/get-products");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div>
      <h1>Manage Products</h1>
      <div className="m-2 d-flex gap-4">
        {products.map((product) => (
          <Link
            to={`/dashboard/admin/products/${product.slug}`}
            className="product-link"
            key={product._id}
          >
            <div className="card mb-1 " style={{ width: "18rem" }}>
              <img
                src={`${import.meta.env.VITE_API}api/v1/product/product-photo/${
                  product._id
                }`}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Product;
