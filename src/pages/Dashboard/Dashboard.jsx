import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  FileCheck2,
  Globe2,
  HeartHandshake,
  MapPinned,
  RefreshCw,
  SearchCheck,
} from "lucide-react";

import ChartSkeleton from "../../components/dashboard/ChartSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const chartColors = ["#059669", "#0f766e", "#14b8a6", "#64748b", "#94a3b8"];


function asList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function hasOfficialChannel(institution) {
  return hasValue(institution.site) || hasValue(institution.email) || hasValue(institution.telefone);
}

function getInstitutionName(institution) {
  return institution.nome_fantasia || institution.nome || institution.razao_social || "Instituicao";
}

function getSupportDate(support) {
  return new Date(support.created_at || support.data || support.date);
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function percent(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function buildUfDistribution(institutions) {
  const states = new Map();

  institutions.forEach((institution) => {
    const uf = institution.uf || "NI";
    states.set(uf, (states.get(uf) || 0) + 1);
  });

  return [...states.entries()]
    .map(([uf, total]) => ({ uf, total }))
    .sort((a, b) => b.total - a.total || a.uf.localeCompare(b.uf))
    .slice(0, 8);
}

function buildCategoryDistribution(institutions) {
  const categories = new Map();

  institutions.forEach((institution) => {
    const category =
      institution.categoria ||
      institution.area_atuacao ||
      institution.segmento ||
      "Sem categoria";
    categories.set(category, (categories.get(category) || 0) + 1);
  });

  return [...categories.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function buildQualityData(institutions) {
  const total = institutions.length;
  const withCnpj = institutions.filter((item) => hasValue(item.cnpj)).length;
  const withUf = institutions.filter((item) => hasValue(item.uf)).length;
  const withDescription = institutions.filter((item) => hasValue(item.descricao)).length;
  const withChannel = institutions.filter(hasOfficialChannel).length;

  return [
    { name: "CNPJ", value: withCnpj, percent: percent(withCnpj, total) },
    { name: "UF", value: withUf, percent: percent(withUf, total) },
    { name: "Descricao", value: withDescription, percent: percent(withDescription, total) },
    { name: "Canal oficial", value: withChannel, percent: percent(withChannel, total) },
  ];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      {label && <p className="font-semibold text-slate-900">{label}</p>}
      {payload.map((item) => (
        <p key={`${item.name}-${item.dataKey}`} className="text-slate-600">
          {item.name}: <span className="font-semibold text-emerald-700">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const institutionsResource = useApiResource(api.getInstituicoes, {
    initialData: [],
    select: asList,
  });
  const supportsResource = useApiResource(api.getDoacoes, {
    initialData: [],
    select: asList,
  });


  const dashboard = useMemo(() => {
    const institutions = institutionsResource.data || [];
    const supports = supportsResource.data || [];
    const withCnpj = institutions.filter((item) => hasValue(item.cnpj)).length;
    const withChannel = institutions.filter(hasOfficialChannel).length;
    const ufs = new Set(institutions.map((item) => item.uf).filter(Boolean));

    return {
      institutions,
      supports,
      withCnpj,
      withChannel,
      ufCount: ufs.size,
      ufDistribution: buildUfDistribution(institutions),
      categoryDistribution: buildCategoryDistribution(institutions),
      qualityData: buildQualityData(institutions),
      recentInstitutions: [...institutions]
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))
        .slice(0, 6),
      recentSupports: [...supports]
        .sort((a, b) => getSupportDate(b) - getSupportDate(a))
        .slice(0, 6),
    };
  }, [institutionsResource.data, supportsResource.data]);

  const loading =
    (institutionsResource.loading || supportsResource.loading) &&
    !dashboard.institutions.length;
  const refreshing = institutionsResource.refreshing || supportsResource.refreshing;

  const refetchAll = () => {
    institutionsResource.refetch();
    supportsResource.refetch();
  };

  return (
    <Layout className="bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Painel de transparencia</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Dashboard DoarCuidar
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Indicadores sobre busca, cobertura e qualidade dos dados institucionais.
              O painel não mede dinheiro arrecadado, porque o DoarCuidar não processa pagamentos.
            </p>
          </div>

          <button
            type="button"
            onClick={refetchAll}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label="Atualizar dados do dashboard"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Atualizar
          </button>
        </div>

        {(institutionsResource.error || supportsResource.error) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {institutionsResource.error || supportsResource.error}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Instituicoes disponiveis"
            value={dashboard.institutions.length}
            description="Registros retornados pela API para consulta pública."
            icon={Building2}
            tone="emerald"
          />
          <MetricCard
            title="Estados cobertos"
            value={dashboard.ufCount}
            description="UFs diferentes presentes na base consultada."
            icon={MapPinned}
            tone="sky"
          />
          <MetricCard
            title="Com CNPJ"
            value={percent(dashboard.withCnpj, dashboard.institutions.length)}
            description={`${dashboard.withCnpj} de ${dashboard.institutions.length} registros.`}
            icon={FileCheck2}
            tone="slate"
          />
          <MetricCard
            title="Com canal oficial"
            value={percent(dashboard.withChannel, dashboard.institutions.length)}
            description="Site, e-mail ou telefone informado."
            icon={Globe2}
            tone="amber"
          />
          <MetricCard
            title="Apoios registrados"
            value={dashboard.supports.length}
            description="Registros de acompanhamento, sem valor financeiro consolidado."
            icon={HeartHandshake}
            tone="emerald"
          />
        </div>

        {loading ? (
          <ChartSkeleton />
        ) : dashboard.institutions.length === 0 ? (
          <EmptyState
            title="Nenhuma instituição disponível"
            description="Atualize os dados ou tente novamente em instantes."
            actionLabel="Atualizar"
            onAction={refetchAll}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel
              title="Cobertura por estado"
              description="Distribuição das instituições encontradas por UF."
            >
              <div className="h-80" aria-label="Gráfico de cobertura por estado">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.ufDistribution} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="uf" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Instituicoes" dataKey="total" fill="#059669" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel
              title="Áreas de atuação"
              description="Categorias informadas ou inferidas pelos dados."
            >
              <div className="h-80" aria-label="Gráfico de áreas de atuação">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard.categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={98}
                      paddingAngle={4}
                    >
                      {dashboard.categoryDistribution.map((item, index) => (
                        <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel
              title="Qualidade dos dados"
              description="Campos essenciais para a pessoa decidir com mais contexto."
              className="xl:col-span-2"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="h-72" aria-label="Gráfico de qualidade dos dados">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.qualityData} layout="vertical" margin={{ left: 24, right: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar name="Registros" dataKey="value" fill="#0f766e" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid content-center gap-3">
                  {dashboard.qualityData.map((item) => (
                    <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold text-slate-950">{item.name}</p>
                        <span className="text-sm font-bold text-emerald-700">{item.percent}</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-600"
                          style={{ width: item.percent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel
              title="Instituicoes recentes"
              description="Ultimos registros disponiveis para consulta."
            >
              <div className="space-y-3">
                {dashboard.recentInstitutions.map((item) => (
                  <article key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-950">{getInstitutionName(item)}</h3>
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {item.cnpj || "CNPJ não informado"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {item.uf || "UF"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel
              title="Apoios registrados"
              description="Historico de acompanhamento, sem confirmar pagamento real."
            >
              {dashboard.recentSupports.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum apoio registrado ainda.</p>
              ) : (
                <div id="doacoes" className="scroll-mt-6 space-y-3">
                  {dashboard.recentSupports.map((item, index) => {
                    const date = getSupportDate(item);

                    return (
                      <article
                        key={item.id || `${item.instituicao_id}-${index}`}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <h3 className="font-bold text-slate-950">
                          {item.instituicao_nome || item.instituicao || "Instituição"}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {isValidDate(date) ? date.toLocaleDateString("pt-BR") : "Data não informada"}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel
              title="Proximos dados uteis"
              description="Boas métricas para evoluir o produto sem depender de valor doado."
              className="xl:col-span-2"
            >
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  "Instituicoes favoritadas por usuario.",
                  "Termos e estados mais pesquisados.",
                  "Quantidade de acessos aos canais oficiais.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    <SearchCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}
      </section>
    </Layout>
  );
}
