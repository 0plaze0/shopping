import { SEO } from "./../../components";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <div>
      <SEO title="DashBoard-E-commerce" />
      <div>
        <ul>
          <li>{auth?.user?.name}</li>
          <li>{auth?.user?.address}</li>
          <li>{auth?.user?.phone}</li>
          <li>{auth?.user?.email}</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
