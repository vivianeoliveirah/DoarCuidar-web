import { createElement, memo, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  AUTH_CHANGE_EVENT,
  getSessionUser,
  logoutUser,
} from "../../services/authService";

function Brand({ light = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl"
      aria-label="Ir para a Home do DoarCuidar"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
          light
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/25"
            : "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
        }`}
        aria-hidden="true"
      >
        <Heart size={20} fill="currentColor" strokeWidth={2.4} />
      </span>
      <span
        className={`font-bold tracking-tight ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        Doar<span className={light ? "text-emerald-300" : "text-emerald-600"}>Cuidar</span>
      </span>
    </Link>
  );
}

const NavItem = memo(function NavItem({ to, icon, children, onClick, end = false }) {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        isActive
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/20"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {createElement(icon, {
        size: 18,
        className: isActive ? "text-white" : "text-slate-400 transition group-hover:text-white",
        "aria-hidden": true,
      })}
      <span>{children}</span>
    </Link>
  );
});

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const loadUser = () => setUser(getSessionUser());

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

  const navLinks = useMemo(
    () => [
      { to: "/", icon: Home, label: "Home" },
      { to: "/instituicoes", icon: Search, label: "Instituições" },
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ...(user ? [{ to: "/perfil", icon: User, label: "Perfil" }] : []),
    ],
    [user]
  );

  const guestLinks = [
    { to: "/login", icon: LogIn, label: "Entrar" },
    { to: "/cadastro", icon: UserPlus, label: "Cadastrar" },
  ];

  const sair = () => {
    logoutUser();
    setUser(null);
    setMobileOpen(false);
    navigate("/");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="mb-8 border-b border-white/10 pb-6">
        <Brand light onClick={() => setMobileOpen(false)} />
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Plataforma de doações e impacto social.
        </p>
      </div>

      <nav className="space-y-1" aria-label="Navegação principal">
        {navLinks.map(({ to, icon, label }) => (
          <NavItem
            key={`${to}-${label}`}
            to={to}
            icon={icon}
            end={to === "/"}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </NavItem>
        ))}

        {!user &&
          guestLinks.map(({ to, icon, label }) => (
            <NavItem
              key={to}
              to={to}
              icon={icon}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavItem>
          ))}
      </nav>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            navigate("/instituicoes");
          }}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          aria-label="Buscar instituições para doar"
        >
          <HeartHandshake size={18} aria-hidden="true" />
          Doar agora
        </button>

        {user && (
          <button
            type="button"
            onClick={sair}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label="Sair da conta"
          >
            <LogOut size={18} aria-hidden="true" />
            Sair
          </button>
        )}

        {!user && (
          <p className="px-2 text-xs leading-5 text-slate-400">
            A curadoria de instituições fica reservada ao fluxo interno do projeto.
          </p>
        )}
      </div>
    </div>
  );

  if (isHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/instituicoes")}
              className="hidden min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:inline-flex"
            >
              Instituições
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              aria-label="Abrir dashboard"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 lg:block">
        {sidebar}
      </header>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex min-h-16 items-center justify-between px-4">
          <Brand />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden">
          <aside
            id="mobile-sidebar"
            className="h-full w-[min(20rem,85vw)] bg-slate-950 p-5 text-white shadow-2xl"
            aria-label="Menu mobile"
          >
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
