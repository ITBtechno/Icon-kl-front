import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ roles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", role);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
