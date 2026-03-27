import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("admin");

  if (isAdmin !== "true") {
    return <Navigate to="/" />;
  }

  return children;
}