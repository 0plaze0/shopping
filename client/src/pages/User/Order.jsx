import React, { useEffect, useState } from "react";
import { SEO } from "./../../components";
import { api } from "../../config/api";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import moment from "moment";

const Order = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);

  const getOrder = async () => {
    try {
      const { data } = await api("/api/v1/auth/orders");
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching order");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrder();
  }, [auth?.token]);
  return (
    <div>
      <SEO title="Orders" />
      <>
        <h1 className="text-center">All Orders</h1>

        {orders?.map((order, index) => (
          <div key={order._id}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{order.status}</td>
                  <td>
                    {new Date(order?.createdAt).toLocaleDateString("en-gb")}
                  </td>

                  <td>{order.buyer?.name}</td>
                  <td>{order?.payment?.success ? "Approved" : "Failed"}</td>
                  <td>{order.products?.length}</td>
                </tr>
              </tbody>
            </table>
            {order.products?.map((product) => (
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
                </div>
              </div>
            ))}
          </div>
        ))}
      </>
    </div>
  );
};

export default Order;
