import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import CampoSenha from "../../components/ui/CampoSenha";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { resetPassword } from "../../services/authService";
import {
  clearRecoveryCallbackUrl,
  readRecoveryAccessToken,
} from "../../services/recoveryCallback";

const MIN_PASSWORD_LENGTH = 6;
export function RedefinirSenhaForm({
  resetPasswordFn = resetPassword,
  redirectDelay = 1800,
}) {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);
  const recoveryToken = useRef(readRecoveryAccessToken());
  const submitting = useRef(false);
  const [sessionStatus, setSessionStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    clearRecoveryCallbackUrl();
    setSessionStatus(recoveryToken.current ? "ready" : "invalid");

    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current || loading || sessionStatus !== "ready") return;

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFeedback({
        type: "warning",
        title: "Senha muito curta",
        message: "Use uma senha com pelo menos " + MIN_PASSWORD_LENGTH + " caracteres.",
      });
      return;
    }

    if (password !== confirmation) {
      setFeedback({
        type: "error",
        title: "Senhas diferentes",
        message: "As senhas não coincidem. Confira os dois campos.",
      });
      return;
    }

    try {
      submitting.current = true;
      setLoading(true);
      setFeedback(null);
      await resetPasswordFn({ password, accessToken: recoveryToken.current });

      recoveryToken.current = null;
      setSessionStatus("success");
      setFeedback({
        type: "success",
        title: "Senha redefinida",
        message: "Sua senha foi atualizada. Você será direcionado para o login.",
      });
      redirectTimer.current = setTimeout(
        () => navigate("/login", { replace: true }),
        redirectDelay
      );
    } catch (error) {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        recoveryToken.current = null;
        setSessionStatus("invalid");
        setFeedback({
          type: "error",
          title: "Link inválido ou expirado",
          message: "Solicite um novo link de recuperação para continuar.",
        });
        return;
      }

      setFeedback({
        type: "error",
        title: "Não foi possível redefinir a senha",
        message: "Não conseguimos atualizar sua senha. Tente novamente em instantes.",
      });
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      <FormCard
        title="Redefinir senha"
        subtitle="Crie uma nova senha para voltar a acessar sua conta."
      >
        {sessionStatus === "checking" && (
          <p role="status" className="py-6 text-center text-sm text-slate-600">
            Validando link de recuperação...
          </p>
        )}

        {sessionStatus === "invalid" && (
          <FeedbackMessage
            feedback={
              feedback || {
                type: "error",
                title: "Link inválido ou expirado",
                message: "Solicite um novo link de recuperação para continuar.",
              }
            }
          />
        )}

        {(sessionStatus === "ready" || sessionStatus === "success") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CampoSenha
              label="Nova senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              disabled={loading || sessionStatus === "success"}
            />
            <CampoSenha
              label="Confirmar nova senha"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              disabled={loading || sessionStatus === "success"}
            />

            <FeedbackMessage feedback={feedback} />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || sessionStatus === "success"}
            >
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        )}

        {sessionStatus === "invalid" && (
          <div className="mt-6 text-center text-sm">
            <Link
              to="/recuperar-senha"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              Solicitar novo link
            </Link>
          </div>
        )}
      </FormCard>
    </div>
  );
}

export default function RedefinirSenha() {
  return (
    <Layout className="flex flex-col items-center justify-center bg-slate-50 py-12 sm:py-16">
      <RedefinirSenhaForm />
    </Layout>
  );
}
