import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  AUTH_CHANGE_EVENT,
  getSessionUser,
  isAdminUser,
  logoutUser,
} from "../../services/authService";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      setUser(getSessionUser());
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("focus", loadUser);
    window.addEventListener(AUTH_CHANGE_EVENT, loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("focus", loadUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, loadUser);
    };
  }, []);

  const sair = () => {
    logoutUser();
    setUser(null);
    setMobileOpen(false);
    navigate("/");
  };

  const isAdmin = isAdminUser(user);

  const publicLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/buscar", icon: Search, label: "Buscar" },
    { to: "/cadastro-instituicao", icon: Building2, label: "Cadastrar ONG" },
  ];

  const guestLinks = [
    { to: "/login", icon: LogIn, label: "Entrar" },
    { to: "/cadastro-usuario", icon: UserPlus, label: "Cadastrar" },
  ];

  const authenticatedLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Painel" },
    { to: "/perfil", icon: User, label: "Perfil" },
    ...(isAdmin
      ? [{ to: "/admin", icon: ShieldCheck, label: "Admin" }]
      : []),
  ];

  const navLinks = [
    ...publicLinks,
    ...(user ? authenticatedLinks : guestLinks),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto min-h-20 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold">
            Doar<span className="text-emerald-600">Cuidar</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 transition"
          aria-expanded={mobileOpen}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, icon, label }) => (
            <NavItem key={to} to={to} icon={icon}>
              {label}
            </NavItem>
          ))}

          {user && (
            <button
              onClick={sair}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              Sair
            </button>
          )}
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(({ to, icon, label }) => (
              <NavItem
                key={to}
                to={to}
                icon={icon}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavItem>
            ))}

            {user && (
              <button
                onClick={sair}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                Sair
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
