import { Outlet } from "react-router-dom";
import { AdminMenu } from "./../../components";

const AdminLayout = () => {
  return (
    <>
      <h1>Admin Panel</h1>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
