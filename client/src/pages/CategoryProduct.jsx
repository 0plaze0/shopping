import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api } from "./../config/api";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const { slug } = useParams();
  const navigate = useNavigate();

  const getProduct = async () => {
    try {
      const { data } = await api(`/api/v1/product/product-category/${slug}`);
      setCategory(data.category);
      setProducts(data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [slug]);
  return (
    <div className="container  m-3">
      <div className="text-center m-3">
        <h3>Category - {category?.name}</h3>
        <h4>{products?.length} result found</h4>
      </div>
      <div className="m-2 d-flex gap-4 flex-wrap">
        {products?.map((product) => (
          <div
            className="card mb-1 "
            style={{ width: "18rem" }}
            key={product._id}
          >
            <img
              src={`${import.meta.env.VITE_API}api/v1/product/product-photo/${
                product._id
              }`}
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">
                {product.description.substring(0, 60)}
              </p>
              <p className="card-text">${product.price}</p>
              <button
                className="btn btn-primary ms-1"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                More Details
              </button>
              <button className="btn btn-secondary ms-1">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProduct;
