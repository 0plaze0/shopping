import { Link, NavLink } from "react-router-dom";
import { Key, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/auth";
import SearchForm from "../Forms/SearchForm";
import { useCategory } from "../../hooks/useCategory";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const category = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand " to="/">
          <ShoppingCart /> E-commerce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <SearchForm />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            {/* Category */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Category
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to={`/category`}>
                    All Category
                  </Link>
                </li>
                {category?.map((item) => (
                  <li key={item._id}>
                    {" "}
                    <Link
                      className="dropdown-item"
                      to={`/category/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Admin */}
            {!auth.user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth?.user?.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                      >
                        DashBoard
                      </NavLink>
                    </li>
                    <li className="dropdown-item" onClick={handleLogout}>
                      <NavLink className="nav-link" to="/login">
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                Cart (0)
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
