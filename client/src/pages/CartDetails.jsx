import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../config/api";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const CartDetails = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart([]);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //payment
  const getPaymentToken = async () => {
    try {
      const { data } = await api("/api/v1/product/braintree/token");
      if (data) setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await api.post("/api/v1/product/braintree/payment/", {
        nonce,
        cart,
      });
      console.log(data);
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/order");
      toast.success("Payment completed successfully");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(false);
    }
  };

  useEffect(() => {
    getPaymentToken();
  }, [auth?.token]);
  const removeItem = (pid) => {
    try {
      const removeItem = cart.filter((item) => item._id != pid);
      setCart(removeItem);
      localStorage.setItem("cart", JSON.stringify([removeItem]));
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = () => {
    try {
      let total = 0;
      cart.forEach((element) => {
        total += element.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error``);
    }
  };

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("cart"));
    setCart([...item]);
  }, []);

  return (
    <div className="container">
      <div className="row text-center">
        <h2>Hello {auth?.user?.name}</h2>
        <h4>
          {cart?.length > 0
            ? `You have ${cart.length} item in cart ${
                auth?.token ? "" : "please login to checkout"
              }`
            : "Add item to cart"}
        </h4>
      </div>
      <div className="row">
        <div className="col-md-8">
          {cart.length > 0 ? (
            <>
              {cart?.map((product) => (
                <div className="row card d-flex flex-row m-2" key={product._id}>
                  <div className="col ">
                    <img
                      src={`${
                        import.meta.env.VITE_API
                      }api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      width={"100px"}
                      height={"200px"}
                      alt="..."
                    />
                  </div>
                  <div className="col mb-1">
                    <p>{product.name}</p>
                    <p>{product?.description?.substring(0, 30)}</p>
                    <p>Price: {product.price}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h1>Add items to cart</h1>
            </>
          )}
        </div>
        <div className="col-md-4 text-center">
          <h2>Cart Summary</h2>
          <p>Total | Checkout | Payment</p>
          <hr />
          <h4>Total: {totalPrice()}</h4>
          <h3>
            {auth?.user?.address
              ? `Current Address: ${auth?.user?.address}`
              : ""}
          </h3>
          {auth?.token ? (
            <button
              className="btn btn-info"
              onClick={() => {
                navigate("/dashboard/user/profile");
              }}
            >
              Update Address
            </button>
          ) : (
            <button
              className="btn btn-info"
              onClick={() => {
                navigate("/login", {
                  state: "/cart",
                });
              }}
            >
              Please Login to continue
            </button>
          )}
          <div className="mt-2">
            {!clientToken || !cart?.length ? (
              ""
            ) : (
              <>
                <DropIn
                  options={{
                    authorization: clientToken,
                    paypal: {
                      flow: "vault",
                    },
                  }}
                  onInstance={(instance) => setInstance(instance)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handlePayment()}
                  disabled={loading || !instance || !auth?.user?.address}
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
