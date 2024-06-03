import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { api } from "../../config/api";
import { Spinner } from "../../components";

const AdminRoutes = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const response = await api.get(
        "/api/v1/auth/admin-auth"
        //   , {
        //      headers: {
        //       Authorization: auth?.token,//we can add this by default in axios is most of the routes are protected
        //      },
        //   }
      );
      if (response.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default AdminRoutes;
