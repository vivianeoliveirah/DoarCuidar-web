import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { getErrorMessage } from "../../services/api";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import CampoSenha from "../../components/ui/CampoSenha";
import Button from "../../components/ui/Button";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

const MIN_PASSWORD_LENGTH = 6;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      setFeedback({
        type: "error",
        title: "Dados obrigatórios",
        message: "Informe nome, e-mail e senha para criar sua conta.",
      });
      return;
    }

    if (!isValidEmail(form.email)) {
      setFeedback({
        type: "warning",
        title: "E-mail inválido",
        message: "Digite um e-mail válido antes de continuar.",
      });
      return;
    }

    if (form.senha.length < MIN_PASSWORD_LENGTH) {
      setFeedback({
        type: "warning",
        title: "Senha muito curta",
        message: `Use uma senha com pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      });
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setFeedback({
        type: "error",
        title: "Senhas diferentes",
        message: "As senhas não coincidem. Confira os dois campos e tente novamente.",
      });
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        nome: form.nome,
        email: form.email,
        password: form.senha,
      });

      toast.success("Conta criada com sucesso 🎉");
      navigate("/login");
    } catch (error) {
      const mensagem = getErrorMessage(error);
      setFeedback({
        type: error?.statusCode >= 500 ? "error" : "warning",
        title:
          error?.statusCode >= 500
            ? "Não conseguimos criar a conta"
            : "Revise as informações",
        message: mensagem,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="py-12 bg-slate-50">
      <FormCard
        title="Crie sua conta"
        subtitle="Crie sua conta para registrar apoios, acessar seu perfil e acompanhar seu histórico."
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <InputTexto label="Nome completo" value={form.nome} onChange={handleChange("nome")} required />
            <InputTexto label="E-mail" type="email" value={form.email} onChange={handleChange("email")} required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <CampoSenha label="Senha" value={form.senha} onChange={handleChange("senha")} required />
            <CampoSenha label="Confirmar senha" value={form.confirmarSenha} onChange={handleChange("confirmarSenha")} required />
          </div>

          <FeedbackMessage feedback={feedback} />

          <Button className="w-full h-12" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>

        </form>
      </FormCard>
    </Layout>
  );
}
