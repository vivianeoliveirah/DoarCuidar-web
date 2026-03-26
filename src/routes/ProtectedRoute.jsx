import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setLoading(false);
    }

    getUser();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}