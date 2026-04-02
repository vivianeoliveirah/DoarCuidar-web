import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  const isAdmin = user?.email === "SEU_EMAIL";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}