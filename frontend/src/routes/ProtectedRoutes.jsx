import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {

  const { token, role } = useAuth();
  const location = useLocation();

  // 🔐 Not logged in
  if (!token) {
    return (
      <Navigate
        to="/smartcampus/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 🚫 Role not allowed
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;