import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import Layout from "../../components/layout/Layout";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

function getLastVerification(instituicao) {
  const date = instituicao.updated_at || instituicao.created_at;
  return date ? new Date(date).toLocaleDateString("pt-BR") : "Não informado";
}

function getInstitutionName(instituicao) {
  return instituicao.nome_fantasia || instituicao.nome || instituicao.razao_social || "Instituição";
}

export default function DetalhesInstituicao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: apiInstituicao,
    error,
    loading,
    refetch,
  } = useApiResource(() => api.getInstituicaoById(id), {
    initialData: null,
    deps: [id],
  });
  const instituicao = apiInstituicao;

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
        <div className="mx-auto max-w-2xl px-4">
          <EmptyState
            title="Instituição não encontrada"
            description={error || "Verifique se o link está correto ou volte para a busca."}
            actionLabel="Tentar novamente"
            onAction={refetch}
          />
        </div>
      </Layout>
    );
  }

  const nome = getInstitutionName(instituicao);
  const detalhes = [
    ["Razão social", instituicao.razao_social || instituicao.nome || "Não informado"],
    ["Nome fantasia", instituicao.nome_fantasia || instituicao.nome || "Não informado"],
    ["CNPJ", instituicao.cnpj || "Não informado"],
    ["Cidade/UF", `${instituicao.cidade || instituicao.municipio || "-"} / ${instituicao.uf || "-"}`],
    ["Base de consulta", instituicao.fonte_validacao || "Consulta pública de CNPJ"],
    ["Área de atuação", instituicao.area_atuacao || instituicao.categoria || "Social"],
    ["Última verificação", getLastVerification(instituicao)],
    ["Fonte da validação", instituicao.fonte_validacao || "Consulta pública de CNPJ"],
  ];

  return (
    <Layout className="bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumb
          items={[
            { label: "Buscar Instituições", href: "/instituicoes" },
            { label: nome },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Building2 size={38} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Perfil institucional verificado
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {nome}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                      <MapPin size={16} aria-hidden="true" />
                      {instituicao.uf || "-"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      <ShieldCheck size={16} aria-hidden="true" />
                      CNPJ verificado
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      Dados institucionais
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
              <h2 className="text-xl font-bold text-slate-950">Dados institucionais</h2>
              <dl className="mt-5 grid gap-4 md:grid-cols-2">
                {detalhes.map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-8 text-xl font-bold text-slate-950">Sobre a instituição</h2>
              <p className="mt-4 leading-7 text-slate-600">
                {instituicao.descricao || "Esta instituição ainda não possui descrição."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email oficial</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Mail size={16} aria-hidden="true" />
                    {instituicao.email || "Não informado"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefone oficial</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Phone size={16} aria-hidden="true" />
                    {instituicao.telefone || "Não informado"}
                  </p>
                </div>
              </div>
            </section>
          </main>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-950/5 lg:sticky lg:top-24">
            <Heart size={40} className="mx-auto mb-4 text-emerald-600" fill="currentColor" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-950">Canais oficiais</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              O pagamento deve ser feito diretamente pelos canais oficiais da instituição. No DoarCuidar, você pode registrar o apoio para acompanhar seu histórico.
            </p>

            {instituicao.site ? (
              <a
                href={instituicao.site}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block"
              >
                <Button type="button" className="w-full">
                  <ExternalLink size={16} aria-hidden="true" />
                  Visitar site oficial
                </Button>
              </a>
            ) : (
              <Button type="button" className="mt-6 w-full" disabled>
                Site não disponível
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => navigate(`/doar/${instituicao.id}`)}
            >
              Registrar apoio no DoarCuidar
            </Button>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
