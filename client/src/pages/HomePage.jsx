import { SEO } from "./../components";
import { useAuth } from "../context/auth";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  return (
    <div>
      <SEO />
      <h1>Homepage</h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </div>
  );
};

export default HomePage;
