import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, Heart, LogOut, MapPin, RefreshCw } from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { getSessionUser, logoutUser } from "../../services/authService";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function normalizeProfile(response) {
  return {
    user: response?.user || getSessionUser(),
    doacoes: Array.isArray(response?.doacoes) ? response.doacoes : [],
  };
}

export default function Perfil() {
  const navigate = useNavigate();
  const {
    data: profile,
    error,
    loading,
    refreshing,
    refetch,
  } = useApiResource(api.getPerfil, {
    initialData: {
      user: getSessionUser(),
      doacoes: [],
    },
    select: normalizeProfile,
  });

  const user = profile?.user;
  const doacoes = useMemo(() => profile?.doacoes || [], [profile?.doacoes]);

  const summary = useMemo(() => {
    const totalDoado = doacoes.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    const porOng = new Map();

    doacoes.forEach((item) => {
      const nome = item.instituicao_nome || "Instituição";
      porOng.set(nome, (porOng.get(nome) || 0) + Number(item.valor || 0));
    });

    const ranking = [...porOng.entries()]
      .map(([nome, total]) => ({ nome, total }))
      .sort((a, b) => b.total - a.total);

    return {
      ranking,
      topOng: ranking[0],
      totalDoado,
    };
  }, [doacoes]);

  const sair = () => {
    logoutUser();
    navigate("/");
  };

  if (loading && !user) {
    return (
      <Layout>
        <Loader text="Carregando perfil..." />
      </Layout>
    );
  }

  return (
    <Layout className="bg-slate-50">
      <div className="bg-emerald-700 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 text-white sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-100">Área do doador</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Meu Perfil</h1>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            aria-label="Atualizar dados do perfil"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} aria-hidden="true" />
            Atualizar
          </button>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-5xl space-y-6 px-4 pb-20">
        {error && (
          <EmptyState
            title="Não foi possível carregar o perfil"
            description={error}
            actionLabel="Tentar novamente"
            onAction={refetch}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-emerald-50 text-3xl font-bold text-emerald-700 shadow-sm">
              {user?.nome?.charAt(0).toUpperCase() || "D"}
            </div>

            <h2 className="text-xl font-bold text-slate-950">{user?.nome || "Doador"}</h2>
            <p className="mt-1 text-sm text-slate-500">{user?.email || "Email não informado"}</p>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-left">
              <p className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={18} aria-hidden="true" />
                {user?.uf || "-"}
              </p>
              <p className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar size={18} aria-hidden="true" />
                {user?.desde || "Cadastro recente"}
              </p>
              <p className="flex items-center gap-3 text-sm text-slate-600">
                <Heart size={18} aria-hidden="true" />
                <strong className="text-slate-950">
                  {currencyFormatter.format(summary.totalDoado)}
                </strong>
              </p>
            </div>

            <Button
              type="button"
              onClick={sair}
              className="mt-8 w-full border bg-white text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} aria-hidden="true" />
              Sair
            </Button>
          </aside>

          <div className="space-y-6 lg:col-span-2">
            <Panel title="Instituição que você mais ajudou">
              {summary.topOng ? (
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">{summary.topOng.nome}</h3>
                  <p className="mt-2 text-lg font-semibold text-emerald-700">
                    {currencyFormatter.format(summary.topOng.total)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Sem doações ainda.</p>
              )}
            </Panel>

            {summary.ranking.length > 0 && (
              <Panel title="Doações por instituição">
                <div className="h-64" aria-label="Gráfico de doações por instituição">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.ranking}>
                      <XAxis dataKey="nome" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                      <Bar dataKey="total" fill="#059669" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}
          </div>
        </div>

        <Panel title="Histórico de doações">
          {doacoes.length === 0 ? (
            <p className="text-sm text-slate-500">Você ainda não fez doações.</p>
          ) : (
            <div className="space-y-3">
              {doacoes.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {item.instituicao_nome || "Instituição"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(item.data || item.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold text-emerald-700">
                      {currencyFormatter.format(Number(item.valor || 0))}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/detalhes/${item.instituicao_id}`)}
                      className="mt-1 text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      Doar novamente
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </Layout>
  );
}
