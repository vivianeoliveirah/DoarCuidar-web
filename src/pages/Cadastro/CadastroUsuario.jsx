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
import SelectUF from "../../components/ui/SelectUF";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

import { buscarCEP } from "../../services/cepService";

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
    telefone: "",
    endereco: "",
    cep: "",
    cidade: "",
    uf: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // ✅ CORRETO: fora do submit
  const handleBuscarCEP = async () => {
    try {
      const data = await buscarCEP(form.cep);

      setForm((prev) => ({
        ...prev,
        endereco: data.logradouro,
        cidade: data.localidade,
        uf: data.uf,
      }));

    } catch (error) {
      const mensagem = getErrorMessage(error);
      toast.error(mensagem);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      setFeedback({
        type: "error",
        title: "Dados obrigatÃ³rios",
        message: "Informe nome, e-mail e senha para criar sua conta.",
      });
      return;
    }

    if (!isValidEmail(form.email)) {
      setFeedback({
        type: "warning",
        title: "E-mail invÃ¡lido",
        message: "Digite um e-mail vÃ¡lido antes de continuar.",
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
        telefone: form.telefone,
        endereco: form.endereco,
        cep: form.cep,
        cidade: form.cidade,
        uf: form.uf,
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

          <div className="grid md:grid-cols-2 gap-4">
            <InputTexto label="Telefone" value={form.telefone} onChange={handleChange("telefone")} />
            <InputTexto label="Endereço" value={form.endereco} onChange={handleChange("endereco")} />
          </div>

          {/* CEP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2">
              <InputTexto
                label="CEP"
                value={form.cep}
                onChange={handleChange("cep")}
                placeholder="00000-000"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleBuscarCEP}
                className="w-full h-11"
              >
                Buscar CEP
              </Button>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputTexto label="Cidade" value={form.cidade} onChange={handleChange("cidade")} />
            <SelectUF value={form.uf} onChange={handleChange("uf")} />
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
