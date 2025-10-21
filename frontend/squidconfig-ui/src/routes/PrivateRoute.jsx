import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
