import { Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import {
  About,
  HomePage,
  Pagenotfound,
  Policy,
  Contact,
  Register,
  Login,
} from "./pages";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Pagenotfound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
