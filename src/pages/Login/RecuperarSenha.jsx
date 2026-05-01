import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import {
  getAuthErrorFeedback,
  requestPasswordReset,
} from "../../services/authService";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFeedback({
        type: "error",
        title: "E-mail obrigatório",
        message: "Informe o e-mail cadastrado para continuar.",
      });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);
      await requestPasswordReset({ email: normalizedEmail });
      setFeedback({
        type: "success",
        title: "Solicitação registrada",
        message:
          "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.",
      });
    } catch (error) {
      setFeedback(getAuthErrorFeedback(error, "password-reset"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout className="flex flex-col items-center justify-center bg-slate-50 py-12 sm:py-16">
      <div className="w-full max-w-md px-4">
        <FormCard
          title="Recuperar senha"
          subtitle="Informe o e-mail cadastrado para receber as orientações de acesso."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputTexto
              label="E-mail cadastrado"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemplo@email.com"
              autoComplete="email"
              required
              aria-invalid={feedback?.type === "error"}
            />

            <FeedbackMessage feedback={feedback} />

            <Button
              type="submit"
              variant="brand"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
            Lembrou a senha?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              Voltar para o login
            </Link>
          </div>
        </FormCard>
      </div>
    </Layout>
  );
}
