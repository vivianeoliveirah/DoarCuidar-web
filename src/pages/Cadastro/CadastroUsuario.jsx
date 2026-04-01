import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import CampoSenha from "../../components/ui/CampoSenha";
import Button from "../../components/ui/Button";
import SelectUF from "../../components/ui/SelectUF";

import { buscarCEP } from "../../services/cepService";

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

    } catch {
      alert("CEP não encontrado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    setLoading(true);

    const { error } = await registerUser({
  email: form.email,
  password: form.senha,
});

    setLoading(false);

    if (error) {
      alert("Erro ao criar conta");
      console.error(error);
    } else {
      alert("Conta criada com sucesso 🎉");
      navigate("/login");
    }
  };

  return (
    <Layout className="py-12 bg-slate-50">
      <FormCard
        title="Crie sua conta"
        subtitle="É rápido, seguro e você pode doar quando quiser."
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <InputTexto label="Nome completo" value={form.nome} onChange={handleChange("nome")} />
            <InputTexto label="E-mail" type="email" value={form.email} onChange={handleChange("email")} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <CampoSenha label="Senha" value={form.senha} onChange={handleChange("senha")} />
            <CampoSenha label="Confirmar senha" value={form.confirmarSenha} onChange={handleChange("confirmarSenha")} />
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

          <Button className="w-full h-12">
            {loading ? "Criando..." : "Criar conta"}
          </Button>

        </form>
      </FormCard>
    </Layout>
  );
}