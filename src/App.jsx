import { Routes, Route } from "react-router-dom";

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

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/cadastro-instituicao" element={<CadastroInstituicao />} />
        <Route path="/buscar" element={<BuscarInstituicoes />} />
        <Route path="/detalhes/:id" element={<DetalhesInstituicao />} />

        {/* 🔒 USER */}
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

        {/* 🔥 ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}