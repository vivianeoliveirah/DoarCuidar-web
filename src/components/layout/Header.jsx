import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  LogIn,
  Heart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Building2
} from "lucide-react";

import Button from "../ui/Button";
import { supabase } from "../../services/supabase";

const ADMIN_ID = "46eb056a-9fa4-484c-96c6-52d3ce03e458"; // 👈 seu id

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
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    getUser();
  }, []);

  const sair = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isAdmin = user?.id === ADMIN_ID;

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold">
            Doar<span className="text-emerald-600">Cuidar</span>
          </span>
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-2">

          <NavItem to="/" icon={Home}>Home</NavItem>
          <NavItem to="/buscar" icon={Search}>Buscar</NavItem>

          {!user ? (
            <>
              <NavItem to="/cadastro-instituicao" icon={Building2}>
                Cadastrar ONG
              </NavItem>

              <NavItem to="/login" icon={LogIn}>
                Entrar
              </NavItem>
            </>
          ) : (
            <>
              <NavItem to="/dashboard" icon={LayoutDashboard}>
                Painel
              </NavItem>

              {/* 🔥 só aparece se for admin */}
              {isAdmin && (
                <NavItem to="/admin" icon={ShieldCheck}>
                  Admin
                </NavItem>
              )}

              <button
                onClick={sair}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sair
              </button>
            </>
          )}

          {/* CTA */}
          <Link to="/buscar">
            <Button className="rounded-full px-5">
              Doar
            </Button>
          </Link>

        </nav>

        {/* MOBILE */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden bg-white p-4 space-y-2">

          <NavItem to="/" onClick={() => setOpen(false)}>Home</NavItem>
          <NavItem to="/buscar" onClick={() => setOpen(false)}>Buscar</NavItem>

          {!user ? (
            <>
              <NavItem to="/cadastro-instituicao" onClick={() => setOpen(false)}>
                Cadastrar ONG
              </NavItem>

              <NavItem to="/login" onClick={() => setOpen(false)}>
                Entrar
              </NavItem>
            </>
          ) : (
            <>
              <NavItem to="/dashboard" onClick={() => setOpen(false)}>
                Painel
              </NavItem>

              {isAdmin && (
                <NavItem to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </NavItem>
              )}

              <button onClick={sair} className="text-red-600">
                Sair
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}