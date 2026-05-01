import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import Button from "../../components/ui/Button";
import { getErrorMessage } from "../../services/api";
import {
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
  requestPasswordReset,
} from "../../services/authService";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Informe o e-mail cadastrado.");
      return;
    }

    try {
      setLoading(true);
      setFallbackMessage("");
      await requestPasswordReset({ email: normalizedEmail });
      setSent(true);
      toast.success("Se o e-mail estiver cadastrado, enviaremos as instruções.");
    } catch (error) {
      const message = getErrorMessage(error);

      if (error?.statusCode === 404 || error?.statusCode === 405 || error?.statusCode === 501) {
        setFallbackMessage(PASSWORD_RESET_UNAVAILABLE_MESSAGE);
      } else {
        setFallbackMessage(message);
      }
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
          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <MailCheck size={18} aria-hidden="true" />
                Solicitação registrada
              </div>
              Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputTexto
                label="E-mail cadastrado"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="exemplo@email.com"
                autoComplete="email"
                required
              />

              {fallbackMessage && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  {fallbackMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="brand"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar instruções"}
              </Button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
            Lembrou a senha?{" "}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Voltar para o login
            </Link>
          </div>
        </FormCard>
      </div>
    </Layout>
  );
}
