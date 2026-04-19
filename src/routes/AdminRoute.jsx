import { Navigate } from "react-router-dom";
import { getSessionUser, isAdminUser } from "../services/authService";

export default function AdminRoute({ children }) {
  const user = getSessionUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
