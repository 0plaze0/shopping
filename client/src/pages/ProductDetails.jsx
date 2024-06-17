import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../config/api";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();

  const getProduct = async () => {
    try {
      const { data } = await api(`/api/v1/product/get-products/${slug}`);
      if (data.success) setProduct(data.product);
      else toast.error(data.message);

      relatedProduct(data.product._id, data.product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching product");
    }
  };

  const relatedProduct = async (pid, category) => {
    try {
      const { data } = await api.get(
        `/api/v1/product/related-product/${pid}/${category}`
      );
      setRelated(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [slug]);

  return (
    <div>
      <div className="container m-3">
        {product ? (
          <div className="row">
            <div className="col">
              <img
                src={`${import.meta.env.VITE_API}api/v1/product/product-photo/${
                  product._id
                }`}
                className="rounded img-fluid"
                alt="..."
              />
            </div>
            <div className="col d-flex flex-column justify-content-start">
              <h1>{product?.name}</h1>
              <p>{product?.description}</p>

              <div>
                <span className="badge rounded-pill text-bg-dark object-fit-cover">
                  {product?.category?.name}
                </span>
              </div>
              <h3 className="m-2">${product?.price}</h3>
              <button type="button" className="btn btn-primary">
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <h1>No product</h1>
        )}
      </div>
      <div className="container">
        <h1 className="text-center">Related Product</h1>
        <div className="m-2 d-flex gap-4 flex-wrap">
          {related.length ? (
            related?.map((product) => (
              <div
                className="card mb-1 "
                style={{ width: "18rem" }}
                key={product._id}
              >
                <img
                  src={`${
                    import.meta.env.VITE_API
                  }api/v1/product/product-photo/${product._id}`}
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
                  <button className="btn btn-secondary ms-1">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1>No similar product found</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
