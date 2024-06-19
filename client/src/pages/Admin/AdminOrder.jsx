import React, { useEffect, useState } from "react";
import { api } from "./../../config/api";
import { Select } from "antd";

const { Option } = Select;

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");

  const getAllOrder = async () => {
    try {
      const { data } = await api("/api/v1/auth/order-status");

      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (orderId, value) => {
    try {
      const { data } = await api.put(`api/v1/auth/change-status/${orderId}`, {
        status: value,
      });
      setChangeStatus(data.changeStatus);
    } catch (error) {
      console.log(error);
      toast.error("Error while changing status");
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);
  return (
    <div>
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
                <td scope="row">{index + 1}</td>
                <td>
                  <Select
                    onChange={(value) => handleStatus(order._id, value)}
                    defaultValue={order?.status}
                  >
                    {status?.map((item) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </td>
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
    </div>
  );
};

export default AdminOrder;
