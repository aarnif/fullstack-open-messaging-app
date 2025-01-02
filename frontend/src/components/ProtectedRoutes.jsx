import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoutes;
