import { useState } from "react";
import Layout from "../../components/layout/Layout";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import Button from "../../components/ui/Button";
import SelectUF from "../../components/ui/SelectUF";
import { consultarCNPJ } from "../../services/cnpjService";
import { criarInstituicao } from "../../services/instituicoesService";

export default function CadastroInstituicao() {

  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    email: "",
    uf: "",
    descricao: ""
  });

  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleChange = (key) => (e) => {
    setForm(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  // 🔍 BUSCAR CNPJ
  const buscarCNPJ = async () => {
    try {
      if (!form.cnpj) {
        alert("Digite o CNPJ primeiro");
        return;
      }

      setLoadingCNPJ(true);

      const data = await consultarCNPJ(form.cnpj);

      setForm(prev => ({
        ...prev,
        nome: data.nome_fantasia || data.razao_social || prev.nome,
        uf: data.uf || prev.uf
      }));

    } catch (error) {
      console.error("Erro ao consultar CNPJ:", error);
      alert("CNPJ não encontrado ou inválido.");
    } finally {
      setLoadingCNPJ(false);
    }
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.cnpj || !form.email || !form.uf) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoadingSubmit(true);

      await criarInstituicao({
        ...form,
        status: "pendente", // 🔥 IMPORTANTE
      });

      alert("Instituição enviada para análise ✅");

      setForm({
        nome: "",
        cnpj: "",
        email: "",
        uf: "",
        descricao: ""
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar instituição.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Layout className="py-12 bg-slate-50">

      <FormCard
        title="Cadastrar Instituição"
        subtitle="Sua ONG passará por análise antes de aparecer na plataforma."
      >

        <form onSubmit={handleSubmit} className="space-y-4">

          <InputTexto
            label="Nome da Instituição"
            value={form.nome}
            onChange={handleChange("nome")}
            placeholder="Ex: Instituto Esperança"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2">
              <InputTexto
                label="CNPJ"
                value={form.cnpj}
                onChange={handleChange("cnpj")}
                placeholder="00.000.000/0001-00"
                required
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={buscarCNPJ}
                className="w-full h-11"
              >
                {loadingCNPJ ? "Consultando..." : "Consultar CNPJ"}
              </Button>
            </div>

          </div>

          <SelectUF
            value={form.uf}
            onChange={handleChange("uf")}
          />

          <InputTexto
            label="E-mail de Contato"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="ong@contato.com"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição das Atividades
            </label>

            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none min-h-30 resize-none"
              value={form.descricao}
              onChange={handleChange("descricao")}
              placeholder="Conte um pouco sobre o trabalho da sua ONG..."
              required
            />
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full h-12 text-lg"
          >
            {loadingSubmit ? "Enviando..." : "Cadastrar ONG"}
          </Button>

        </form>

      </FormCard>

    </Layout>
  );
}