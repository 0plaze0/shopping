import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { SEO, Prices } from "./../components";
import { api } from "../config/api";

import { Checkbox, Radio } from "antd";
import { useCart } from "../context/cart";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categorires, setCategorires] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //get all category
  const getAllCategories = async () => {
    try {
      const { data } = await api("/api/v1/category/get-category");
      if (data.success) {
        setCategorires(data.category);
      }
    } catch (error) {
      console.log(err);
      toast.error("Something went wrong while getting category");
    }
  };
  const getTotal = async () => {
    try {
      const { data } = await api("/api/v1/product/product-count");
      if (data) setTotal(data.total);
    } catch (error) {
      console.log(error);
      toast.error("Someting went wrong while getting total product");
    }
  };

  useEffect(() => {
    getAllCategories();
    getTotal();
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(`/api/v1/product/product-list/${page}`);
      if (data.success) {
        setProducts(data.product);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);

  //load more
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(`/api/v1/product/product-list/${page}`);
      if (data.success) {
        setProducts([...products, ...data?.product]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((category) => category != id);
    setChecked(all);
  };

  const filterProduct = async () => {
    try {
      const { data } = await api.post("/api/v1/product/filter-product", {
        checked,
        radio,
      });
      setProducts(data.product);
    } catch (err) {
      console.log(err);
      toast.error("Error while getting category");
    }
  };

  const handleCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item added to cart");
  };
  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  return (
    <>
      <SEO title="All Products - best offers" />
      <div className="row mt-3">
        <div className="row">
          <div className="col-md-3">
            <h4 className="text-center">Filter by Category</h4>
            <div className="d-flex flex-column ms-3">
              {categorires?.map((category) => (
                <Checkbox
                  key={category._id}
                  onChange={(e) => handleFilter(e.target.checked, category._id)}
                >
                  {category.name}
                </Checkbox>
              ))}
            </div>
            <h4 className="text-center">Filter by Price</h4>
            <div className="d-flex flex-column ms-3">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((price) => (
                  <div key={price._id}>
                    <Radio value={price.array}>{price.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column ms-3">
              <button
                className="btn btn-danger"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reset Filter
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>

            <div className="d-flex flex-wrap">
              <div className="m-2 d-flex gap-4 flex-wrap">
                {products?.map((product) => (
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
                      <button
                        className="btn btn-secondary ms-1"
                        onClick={() => {
                          handleCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "...loading" : "Load more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
