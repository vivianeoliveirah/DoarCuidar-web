import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CadastroUsuario from "./pages/Cadastro/CadastroUsuario";
import CadastroInstituicao from "./pages/Cadastro/CadastroInstituicao";
import BuscarInstituicoes from "./pages/Instituicoes/BuscarInstituicoes";
import DetalhesInstituicao from "./pages/Instituicoes/DetalhesInstituicao";
import Doar from "./pages/Doar/Doar";
import Perfil from "./pages/Perfil/Perfil";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl border bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-emerald-600">Erro 404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-3 text-slate-600">
          O link pode estar desatualizado ou a página foi movida.
        </p>
        <Link
          to="/"
          className="inline-flex mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/cadastro-instituicao" element={<CadastroInstituicao />} />
        <Route path="/buscar" element={<BuscarInstituicoes />} />
        <Route path="/detalhes/:id" element={<DetalhesInstituicao />} />

        {/* USER */}
        <Route
          path="/doar/:id"
          element={
            <ProtectedRoute>
              <Doar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
