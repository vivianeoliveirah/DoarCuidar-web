import { useState } from "react";
import { getErrorMessage } from "../../services/api";
import toast from "react-hot-toast";

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
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  function montarDescricaoCNPJ(data, descricaoAtual) {
    const partes = [
      data.cnae_fiscal_descricao,
      data.municipio && data.uf ? `Localizada em ${data.municipio}/${data.uf}.` : null,
      data.descricao_porte ? `Porte: ${data.descricao_porte}.` : null,
    ].filter(Boolean);

    return descricaoAtual || partes.join(" ");
  }

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
        const message = "Digite o CNPJ primeiro.";
        setFormError(message);
        toast.error(message);
        return;
      }

      setLoadingCNPJ(true);
      setFormError("");
      setFormSuccess("");

      const data = await consultarCNPJ(form.cnpj);
      const nome =
        data.nome_fantasia ||
        data.razao_social ||
        data.nome ||
        data.estabelecimento?.nome_fantasia ||
        data.estabelecimento?.razao_social;

      setForm(prev => ({
        ...prev,
        cnpj: data.cnpj || prev.cnpj,
        nome: nome || prev.nome,
        uf: data.uf || data.estabelecimento?.estado?.sigla || prev.uf,
        descricao: montarDescricaoCNPJ(data, prev.descricao),
      }));

      if (nome || data.uf) {
        toast.success("CNPJ consultado com sucesso.");
      } else {
        toast("CNPJ encontrado, mas a API retornou poucas informações.");
      }

    } catch (error) {
      const mensagem = getErrorMessage(error);
      setFormError(mensagem);
      toast.error(mensagem);
    } finally {
      setLoadingCNPJ(false);
    }
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.nome || !form.cnpj || !form.email || !form.uf) {
      const message = "Preencha todos os campos obrigatórios.";
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setLoadingSubmit(true);

      await criarInstituicao({
        ...form,
        status: "pendente", // 🔥 IMPORTANTE
      });

      const successMessage = "Instituição enviada para análise.";
      setFormSuccess(successMessage);
      toast.success(successMessage);

      setForm({
        nome: "",
        cnpj: "",
        email: "",
        uf: "",
        descricao: ""
      });

    } catch (error) {
      const mensagem = getErrorMessage(error);
      setFormError(mensagem);
      toast.error(mensagem);
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
                disabled={loadingCNPJ || loadingSubmit}
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

          {formError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
              {formSuccess}
            </div>
          )}

          <Button
            type="submit"
            variant="brand"
            className="w-full h-12 text-lg"
            disabled={loadingSubmit || loadingCNPJ}
          >
            {loadingSubmit ? "Enviando..." : "Cadastrar ONG"}
          </Button>

        </form>

      </FormCard>

    </Layout>
  );
}
