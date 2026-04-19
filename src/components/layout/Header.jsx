import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  LogIn,
  Heart,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { logoutUser } from "../../services/authService";

function NavItem({ to, icon: Icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-xl transition ${
          isActive
            ? "bg-emerald-100 text-emerald-700 font-semibold"
            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
        }`
      }
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </NavLink>
  );
}

export default function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // 🔥 sincroniza com localStorage
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    loadUser();

    // 🔥 escuta mudanças (login/logout)
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const sair = () => {
    logoutUser();
    setUser(null); // 🔥 atualiza na hora
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold">
            Doar<span className="text-emerald-600">Cuidar</span>
          </span>
        </Link>

        <nav className="flex gap-2">

          <NavItem to="/" icon={Home}>Home</NavItem>
          <NavItem to="/buscar" icon={Search}>Buscar</NavItem>

          {!user ? (
            <>
              <NavItem to="/login" icon={LogIn}>Entrar</NavItem>
              <NavItem to="/cadastro-usuario" icon={UserPlus}>Cadastrar</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/dashboard" icon={LayoutDashboard}>
                Painel
              </NavItem>
              <NavItem to="/perfil" icon={User}>
                Perfil
              </NavItem>

              {isAdmin && (
                <NavItem to="/admin" icon={ShieldCheck}>
                  Admin
                </NavItem>
              )}

              <button
                onClick={sair}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}