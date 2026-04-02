import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // não logado → manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // logado → libera acesso
  return children;
}