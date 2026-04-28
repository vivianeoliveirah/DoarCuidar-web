import { Navigate, useLocation } from "react-router-dom";
import { getSessionUser, isAdminUser } from "../services/authService";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = getSessionUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
