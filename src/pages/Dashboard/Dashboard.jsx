import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  HeartHandshake,
  MapPinned,
  RefreshCw,
  Search,
} from "lucide-react";

import ChartSkeleton from "../../components/dashboard/ChartSkeleton";
import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const EMPTY_DASHBOARD = {
  resumo: {
    apoios_registrados: 0,
    instituicoes_apoiadas: 0,
    estados_alcancados: 0,
  },
  ultimos_apoios: [],
  evolucao_mensal: [],
  instituicoes_apoiadas_detalhes: [],
};

function asPersonalDashboard(response) {
  const data = response?.data || response || {};
  const resumo = data.resumo || {};

  return {
    resumo: {
      apoios_registrados: Number(resumo.apoios_registrados) || 0,
      instituicoes_apoiadas: Number(resumo.instituicoes_apoiadas) || 0,
      estados_alcancados: Number(resumo.estados_alcancados) || 0,
    },
    ultimos_apoios: Array.isArray(data.ultimos_apoios) ? data.ultimos_apoios : [],
    evolucao_mensal: Array.isArray(data.evolucao_mensal) ? data.evolucao_mensal : [],
    instituicoes_apoiadas_detalhes: Array.isArray(data.instituicoes_apoiadas_detalhes)
      ? data.instituicoes_apoiadas_detalhes
      : [],
  };
}

function formatMonth(value) {
  const [year, month] = String(value || "").split("-");
  if (!year || !month) return value || "Período não informado";

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return date.toLocaleDateString("pt-BR");
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-900">{formatMonth(label)}</p>
      <p className="text-slate-600">
        Apoios: <span className="font-semibold text-emerald-700">{payload[0].value}</span>
      </p>
    </div>
  );
}

function PanelEmptyState({ children }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <p className="max-w-sm text-sm leading-6 text-slate-500">{children}</p>
    </div>
  );
}

export default function Dashboard() {
  const dashboardResource = useApiResource(api.getPersonalDashboard, {
    initialData: EMPTY_DASHBOARD,
    select: asPersonalDashboard,
  });

  const dashboard = dashboardResource.data || EMPTY_DASHBOARD;
  const summary = dashboard.resumo || EMPTY_DASHBOARD.resumo;
  const hasSupports = summary.apoios_registrados > 0;
  const monthlyData = useMemo(
    () =>
      dashboard.evolucao_mensal.map((item) => ({
        ...item,
        label: formatMonth(item.mes),
      })),
    [dashboard.evolucao_mensal]
  );

  return (
    <Layout className="bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Sua atividade</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Meu Painel</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Acompanhe os apoios que você registrou. O DoarCuidar não processa pagamentos.
            </p>
          </div>

          <button
            type="button"
            onClick={dashboardResource.refetch}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label="Atualizar dados do painel"
          >
            <RefreshCw
              size={16}
              className={dashboardResource.refreshing ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Atualizar
          </button>
        </div>

        {dashboardResource.error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
          >
            {dashboardResource.error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Apoios registrados"
            value={summary.apoios_registrados}
            description="Registros informativos feitos por você."
            icon={HeartHandshake}
            tone="emerald"
          />
          <MetricCard
            title="Instituições apoiadas"
            value={summary.instituicoes_apoiadas}
            description="Instituições distintas no seu histórico."
            icon={Building2}
            tone="sky"
          />
          <MetricCard
            title="Estados alcançados"
            value={summary.estados_alcancados}
            description="UFs identificadas entre seus apoios."
            icon={MapPinned}
            tone="amber"
          />
        </div>

        {dashboardResource.loading && !dashboardResource.hasLoaded ? (
          <ChartSkeleton />
        ) : !hasSupports ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm shadow-slate-950/5">
            <HeartHandshake size={32} className="text-emerald-700" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Nenhum apoio registrado ainda.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Quando você registrar um apoio, seu histórico aparecerá aqui.
            </p>
            <Link
              to="/instituicoes"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <Search size={16} aria-hidden="true" />
              Encontrar instituições
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel
              title="Evolução mensal"
              description="Apoios registrados por mês no seu histórico."
            >
              {monthlyData.length === 0 ? (
                <PanelEmptyState>
                  A evolução mensal ainda não possui dados suficientes.
                </PanelEmptyState>
              ) : (
                <div
                  className="h-72"
                  aria-label="Gráfico da evolução mensal dos seus apoios"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="mes"
                        tickFormatter={formatMonth}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        name="Apoios"
                        dataKey="apoios_registrados"
                        fill="#059669"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>

            <Panel
              title="Instituições apoiadas"
              description="Instituições presentes exclusivamente no seu histórico."
            >
              {dashboard.instituicoes_apoiadas_detalhes.length === 0 ? (
                <PanelEmptyState>Nenhuma instituição apoiada para exibir.</PanelEmptyState>
              ) : (
                <div className="space-y-3">
                  {dashboard.instituicoes_apoiadas_detalhes.map((item) => (
                    <article
                      key={item.nome}
                      className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4"
                    >
                      <div>
                        <h3 className="font-bold text-slate-950">
                          {item.nome || "Instituição"}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.uf || "UF não informada"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">
                        {item.apoios_registrados}{" "}
                        {item.apoios_registrados === 1 ? "apoio" : "apoios"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title="Histórico de apoios"
              description="Seus registros mais recentes, sem confirmação de pagamento."
              className="xl:col-span-2"
            >
              {dashboard.ultimos_apoios.length === 0 ? (
                <PanelEmptyState>Nenhum apoio registrado ainda.</PanelEmptyState>
              ) : (
                <div id="doacoes" className="grid scroll-mt-6 gap-3 md:grid-cols-2">
                  {dashboard.ultimos_apoios.map((item, index) => (
                    <article
                      key={item.id || `${item.instituicao_nome}-${index}`}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-950">
                            {item.instituicao_nome || "Instituição"}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {item.uf || "UF não informada"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        )}
      </section>
    </Layout>
  );
}
