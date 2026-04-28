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

const fallbackInstitutions = {
  "fallback-amigos-do-bem": {
    id: "fallback-amigos-do-bem",
    nome: "AMIGOS DO BEM",
    cnpj: "05.108.918/0001-72",
    uf: "SP",
    descricao:
      "Transforma vidas por meio de educação, geração de renda e projetos de desenvolvimento local para combater a fome e a miséria.",
    email: "",
    telefone: "",
    site: "",
  },
};

export default function DetalhesInstituicao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallbackInstitution = fallbackInstitutions[id];
  const {
    data: apiInstituicao,
    error,
    loading,
    refetch,
  } = useApiResource(() => api.getInstituicaoById(id), {
    initialData: null,
    deps: [id],
    enabled: !fallbackInstitution,
  });
  const instituicao = fallbackInstitution || apiInstituicao;

  if (loading && !fallbackInstitution) {
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

  return (
    <Layout className="bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Breadcrumb
          items={[
            { label: "Buscar Instituições", href: "/instituicoes" },
            { label: instituicao.nome },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Building2 size={38} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    CNPJ {instituicao.cnpj || "não informado"}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    {instituicao.nome || "Instituição sem nome"}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                      <MapPin size={16} aria-hidden="true" />
                      {instituicao.uf || "-"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      <ShieldCheck size={16} aria-hidden="true" />
                      Ativa
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-950">Sobre a instituição</h2>
              <p className="mt-4 leading-7 text-slate-600">
                {instituicao.descricao || "Esta instituição ainda não possui descrição."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Mail size={16} aria-hidden="true" />
                    {instituicao.email || "Não informado"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefone</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Phone size={16} aria-hidden="true" />
                    {instituicao.telefone || "Não informado"}
                  </p>
                </div>
              </div>
            </section>
          </main>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:sticky lg:top-24">
            <Heart size={40} className="mx-auto mb-4 text-emerald-600" fill="currentColor" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-950">Faça uma doação</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ajude {instituicao.nome} a ampliar seu impacto.
            </p>

            <Button
              type="button"
              className="mt-6 w-full"
              onClick={() => navigate(fallbackInstitution ? "/instituicoes" : `/doar/${instituicao.id}`)}
            >
              {fallbackInstitution ? "Voltar para a busca" : "Doar via PIX"}
            </Button>

            {instituicao.site ? (
              <a
                href={instituicao.site}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block"
              >
                <Button type="button" variant="outline" className="w-full">
                  <ExternalLink size={16} aria-hidden="true" />
                  Visitar site
                </Button>
              </a>
            ) : (
              <Button type="button" variant="outline" className="mt-3 w-full" disabled>
                Site não disponível
              </Button>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}
