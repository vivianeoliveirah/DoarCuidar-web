import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Building2,
  CheckCircle2,
  Clock3,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";
import { logoutUser } from "../../services/authService";

const STATUS_META = {
  pendente: {
    label: "Pendente",
    tone: "amber",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  aprovado: {
    label: "Aprovada",
    tone: "emerald",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  rejeitado: {
    label: "Rejeitada",
    tone: "red",
    className: "bg-red-50 text-red-700 ring-red-100",
  },
};

const CHART_COLORS = ["#f59e0b", "#059669", "#ef4444"];

function asInstitutionList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pendente;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [savingId, setSavingId] = useState(null);
  const {
    data: instituicoes,
    error,
    loading,
    refreshing,
    refetch,
  } = useApiResource(api.getInstituicoes, {
    initialData: [],
    select: asInstitutionList,
  });

  const stats = useMemo(() => {
    return instituicoes.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { total: 0, pendente: 0, aprovado: 0, rejeitado: 0 }
    );
  }, [instituicoes]);

  const chartData = useMemo(
    () => [
      { name: "Pendentes", value: stats.pendente },
      { name: "Aprovadas", value: stats.aprovado },
      { name: "Rejeitadas", value: stats.rejeitado },
    ],
    [stats]
  );

  const recentInstitutions = useMemo(() => {
    return [...instituicoes]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 8);
  }, [instituicoes]);

  async function updateStatus(id, status) {
    try {
      setSavingId(id);
      await api.atualizarStatus(id, status);
      await refetch();
    } finally {
      setSavingId(null);
    }
  }

  const sair = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Layout className="bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Administração</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Dashboard Administrativo
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Gerencie instituições, acompanhe aprovações e mantenha a qualidade da rede DoarCuidar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refetch}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              aria-label="Atualizar instituições"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} aria-hidden="true" />
              Atualizar
            </button>
            <button
              type="button"
              onClick={sair}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>

        {error ? (
          <EmptyState
            title="Não foi possível carregar as instituições"
            description={error}
            actionLabel="Tentar novamente"
            onAction={refetch}
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Instituições"
                value={loading ? "..." : stats.total}
                description="Cadastros recebidos pela plataforma."
                icon={Building2}
                tone="slate"
              />
              <MetricCard
                title="Pendentes"
                value={loading ? "..." : stats.pendente}
                description="Aguardando análise administrativa."
                icon={Clock3}
                tone="amber"
              />
              <MetricCard
                title="Aprovadas"
                value={loading ? "..." : stats.aprovado}
                description="Disponíveis para receber doações."
                icon={CheckCircle2}
                tone="emerald"
              />
              <MetricCard
                title="Rejeitadas"
                value={loading ? "..." : stats.rejeitado}
                description="Cadastros que não atenderam aos critérios."
                icon={XCircle}
                tone="red"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Panel
                title="Distribuição por status"
                description="Visão rápida do fluxo de validação."
              >
                <div className="h-72" aria-label="Gráfico de status das instituições">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={4}
                      >
                        {chartData.map((_, index) => (
                          <Cell key={CHART_COLORS[index]} fill={CHART_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="rounded-xl bg-slate-50 p-3">
                      <span
                        className="mx-auto mb-2 block h-2 w-8 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index] }}
                      />
                      <p className="font-semibold text-slate-900">{item.value}</p>
                      <p className="text-xs text-slate-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                title="Fila de análise"
                description="Priorize os cadastros pendentes mais recentes."
                action={
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                    <ShieldCheck size={16} aria-hidden="true" />
                    Acesso admin
                  </span>
                }
              >
                {recentInstitutions.length === 0 ? (
                  <EmptyState
                    title="Nenhuma instituição encontrada"
                    description="Quando novos cadastros chegarem, eles aparecerão nesta lista."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr className="border-b border-slate-100">
                          <th className="px-3 py-3 font-semibold">Instituição</th>
                          <th className="px-3 py-3 font-semibold">UF</th>
                          <th className="px-3 py-3 font-semibold">Cadastro</th>
                          <th className="px-3 py-3 font-semibold">Status</th>
                          <th className="px-3 py-3 text-right font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentInstitutions.map((ong) => (
                          <tr key={ong.id} className="hover:bg-slate-50">
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                  <Building2 size={18} aria-hidden="true" />
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-950">{ong.nome}</p>
                                  <p className="truncate text-xs text-slate-500">{ong.cnpj || "CNPJ não informado"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-slate-600">{ong.uf || "-"}</td>
                            <td className="px-3 py-4 text-slate-600">
                              {ong.created_at
                                ? new Date(ong.created_at).toLocaleDateString("pt-BR")
                                : "-"}
                            </td>
                            <td className="px-3 py-4">
                              <StatusBadge status={ong.status} />
                            </td>
                            <td className="px-3 py-4">
                              {ong.status === "pendente" ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateStatus(ong.id, "aprovado")}
                                    disabled={savingId === ong.id}
                                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                                  >
                                    Aprovar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateStatus(ong.id, "rejeitado")}
                                    disabled={savingId === ong.id}
                                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                                  >
                                    Rejeitar
                                  </button>
                                </div>
                              ) : (
                                <span className="block text-right text-xs font-medium text-slate-400">
                                  Revisado
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
