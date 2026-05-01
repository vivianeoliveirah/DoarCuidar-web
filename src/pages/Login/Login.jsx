import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import CampoSenha from "../../components/ui/CampoSenha";
import Button from "../../components/ui/Button";
import { loginUser } from "../../services/authService";
import { getErrorMessage } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setFormError("");
      await loginUser({ email: email.trim(), password: senha });
      toast.success("Login realizado com sucesso");
      const from = location.state?.from;
      navigate(
        from ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/",
        { replace: true }
      );
    } catch (error) {
      const message = getErrorMessage(error);
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex flex-col items-center justify-center bg-slate-50 py-12 sm:py-16">
      <div className="w-full max-w-md px-4">
        <FormCard
          title="Entrar no DoarCuidar"
          subtitle="Acesse sua conta para registrar apoios, acompanhar histórico e visualizar seu perfil de doador."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputTexto
              label="Seu e-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemplo@email.com"
              autoComplete="email"
              required
            />

            <div className="space-y-1">
              <CampoSenha
                label="Sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua senha"
              />

              <div className="text-right">
                <Link
                  to="/recuperar-senha"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                {formError}
              </div>
            )}

            <Button
              type="submit"
              variant="brand"
              className="mt-4 w-full"
              disabled={loading}
              aria-label="Entrar na conta"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              Criar conta agora
            </Link>
          </div>
        </FormCard>

        <p className="mt-8 text-center text-xs text-slate-400">
          Ambiente seguro para sua proteção.
        </p>
      </div>
    </Layout>
  );
}
