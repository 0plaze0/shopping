import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="list-group">
        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/order"
          className="list-group-item list-group-item-action"
        >
          Order
        </NavLink>
      </div>
    </>
  );
};

export default AdminMenu;
