import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { HeartHandshake, ShieldCheck } from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import Layout from "../../components/layout/Layout";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import Loader from "../../components/ui/Loader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const SUGGESTED_VALUES = [20, 50, 100];

export default function Doar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valor, setValor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    data: instituicao,
    error,
    loading,
    refetch,
  } = useApiResource(() => api.getInstituicaoById(id), {
    initialData: null,
    deps: [id],
  });

  const valorNumerico = useMemo(() => Number.parseFloat(valor), [valor]);
  const valorInvalido = !Number.isFinite(valorNumerico) || valorNumerico < 1;

  async function handleDoar(event) {
    event.preventDefault();

    if (valorInvalido) {
      toast.error("Informe um valor de doação válido.");
      return;
    }

    try {
      setSubmitting(true);
      await api.postDoacao({
        instituicaoId: id,
        valor: valorNumerico,
        data: new Date().toISOString(),
      });

      toast.success("Obrigado pela sua doação!");
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao processar doação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <Loader text="Carregando instituição..." />
      </Layout>
    );
  }

  if (error || !instituicao) {
    return (
      <Layout className="py-12">
        <div className="mx-auto max-w-xl px-4">
          <EmptyState
            title="Não foi possível carregar a instituição"
            description={error || "Verifique se o link está correto e tente novamente."}
            actionLabel="Tentar novamente"
            onAction={refetch}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-slate-50 py-12">
      <div className="mx-auto max-w-xl px-4">
        <Breadcrumb
          items={[
            { label: "Buscar Instituições", href: "/instituicoes" },
            { label: instituicao.nome, href: `/detalhes/${id}` },
            { label: "Doar" },
          ]}
        />

        <FormCard
          title="Confirmar Doação"
          subtitle={`Você está doando para: ${instituicao.nome}`}
        >
          <form onSubmit={handleDoar} className="space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="flex items-start gap-3 text-sm font-medium leading-6 text-emerald-900">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                Sua doação ajuda a manter projetos de impacto social ativos.
              </p>
            </div>

            <InputTexto
              label="Valor da Doação (R$)"
              type="number"
              placeholder="Ex: 50.00"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              required
              min="1"
              step="0.01"
              aria-invalid={valor !== "" && valorInvalido}
            />

            <div className="grid grid-cols-3 gap-2" aria-label="Valores sugeridos">
              {SUGGESTED_VALUES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setValor(item.toString())}
                  className="min-h-11 rounded-xl border border-slate-200 font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
                >
                  R$ {item}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              variant="brand"
              className="min-h-11 w-full"
              disabled={submitting || valorInvalido}
            >
              <HeartHandshake size={18} aria-hidden="true" />
              {submitting ? "Processando..." : "Confirmar doação"}
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full rounded-xl py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Cancelar e voltar
            </button>
          </form>
        </FormCard>
      </div>
    </Layout>
  );
}
