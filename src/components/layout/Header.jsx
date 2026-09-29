import { createElement, memo, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  HeartHandshake,
  BarChart3,
  FileCheck2,
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
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileCloseButtonRef = useRef(null);
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

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const returnTarget = mobileMenuButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      mobileCloseButtonRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = mobileMenuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus();
    };
  }, [mobileOpen]);

  const navLinks = useMemo(
    () => [
      { to: "/", icon: Home, label: "Início" },
      { to: "/instituicoes", icon: Search, label: "Instituições" },
      { to: "/transparencia", icon: FileCheck2, label: "Transparência" },
      { to: "/analise-oscs", icon: BarChart3, label: "Análise das OSCs" },
      { to: "/dashboard", icon: LayoutDashboard, label: "Painel" },
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
          Busque instituições e compare informações antes de apoiar.
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
        {user ? (
          <>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/dashboard#doacoes");
              }}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Consultar meu histórico"
            >
              <HeartHandshake size={18} aria-hidden="true" />
              Consultar meu histórico
            </button>
            <p className="px-2 text-xs leading-5 text-slate-400">
              Consulte seus apoios registrados no painel.
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/login");
              }}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Entrar na minha conta"
            >
              <LogIn size={18} aria-hidden="true" />
              Entrar na minha conta
            </button>
            <p className="px-2 text-xs leading-5 text-slate-400">
              Entre para registrar seus apoios e consultar seu histórico.
            </p>
          </>
        )}

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
              onClick={() => navigate("/analise-oscs")}
              className="hidden min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 md:inline-flex"
            >
              Análise das OSCs
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              aria-label="Abrir painel"
            >
              Painel
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
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            aria-label="Abrir menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMobileOpen(false);
          }}
        >
          <aside
            ref={mobileMenuRef}
            id="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            className="relative h-full w-[min(20rem,85vw)] bg-slate-950 p-5 text-white shadow-2xl"
            aria-label="Menu mobile"
          >
            <button
              ref={mobileCloseButtonRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Fechar menu"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="h-full">{sidebar}</div>
          </aside>
        </div>
      )}
    </>
  );
}
