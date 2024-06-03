import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <div>
      <ul>
        <li>{auth?.user?.name}</li>
        <li>{auth?.user?.address}</li>
        <li>{auth?.user?.phone}</li>
        <li>{auth?.user?.email}</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
