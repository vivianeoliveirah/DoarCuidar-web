import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import Loader from "./components/ui/Loader";
import ProtectedRoute from "./routes/ProtectedRoute";

const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const RecuperarSenha = lazy(() => import("./pages/Login/RecuperarSenha"));
const CadastroUsuario = lazy(() => import("./pages/Cadastro/CadastroUsuario"));
const BuscarInstituicoes = lazy(() =>
  import("./pages/Instituicoes/BuscarInstituicoes")
);
const DetalhesInstituicao = lazy(() =>
  import("./pages/Instituicoes/DetalhesInstituicao")
);
const Doar = lazy(() => import("./pages/Doar/Doar"));
const Perfil = lazy(() => import("./pages/Perfil/Perfil"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Transparencia = lazy(() => import("./pages/Transparencia/Transparencia"));

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">Erro 404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Página não encontrada
        </h1>
        <p className="mt-3 text-slate-600">
          O link pode estar desatualizado ou a página foi movida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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
      <Suspense fallback={<Loader text="Carregando página..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro-instituicao" element={<Navigate to="/instituicoes" replace />} />
          <Route path="/instituicoes" element={<BuscarInstituicoes />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/buscar" element={<Navigate to="/instituicoes" replace />} />
          <Route path="/detalhes/:id" element={<DetalhesInstituicao />} />

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
            element={<Dashboard />}
          />
          <Route
            path="/painel"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/doacoes"
            element={<Navigate to="/dashboard#doacoes" replace />}
          />
          <Route
            path="/relatorios"
            element={<Navigate to="/dashboard#relatorios" replace />}
          />
          <Route
            path="/configuracoes"
            element={
              <ProtectedRoute>
                <Navigate to="/perfil#configuracoes" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={<Navigate to="/instituicoes" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
