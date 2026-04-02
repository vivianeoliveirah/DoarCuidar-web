import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import CampoSenha from "../../components/ui/CampoSenha";
import Button from "../../components/ui/Button";

import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await loginUser({
        email,
        password: senha,
      });

      if (result?.error) {
  toast.error("E-mail ou senha inválidos");
  return;
}

toast.success("Login realizado com sucesso 🚀");

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md px-4">

        <FormCard title="Entrar no DoarCuidar">
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputTexto
              label="Seu E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
            />

            <div className="space-y-1">
              <CampoSenha
                label="Sua Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />

              <div className="text-right">
                <Link
                  to="#"
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              className="w-full mt-4 h-12 text-lg"
              disabled={loading} // 🔥 evita clique duplo
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro-usuario"
              className="text-emerald-600 font-bold hover:text-emerald-700"
            >
              Criar conta agora
            </Link>
          </div>

        </FormCard>

        <p className="mt-8 text-center text-xs text-slate-400">
          Ambiente seguro e criptografado para sua proteção.
        </p>

      </div>
    </Layout>
  );
}