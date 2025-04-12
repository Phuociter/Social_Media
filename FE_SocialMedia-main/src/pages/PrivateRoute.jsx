import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};
/// This route is for admin only
const PrivateRouteAdmin = () => {
  const { user } = useSelector((state) => state.user);
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};
const PrivateRouteUser = () => {
  const { user } = useSelector((state) => state.user);
  return user ? <Navigate to="/" /> : <Outlet />;
};


export default PrivateRoute;
export { PrivateRoute, PrivateRouteAdmin, PrivateRouteUser };

