import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  CalendarDays,
  HeartHandshake,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import ChartSkeleton from "../../components/dashboard/ChartSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

const PERIODS = [
  { id: "7dias", label: "7 dias" },
  { id: "mes", label: "Mês" },
  { id: "ano", label: "Ano" },
  { id: "todos", label: "Tudo" },
];

const chartColors = ["#059669", "#0f766e", "#14b8a6", "#64748b", "#94a3b8"];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function asList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function getDonationDate(donation) {
  return new Date(donation.created_at || donation.data || donation.date);
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function filterByPeriod(donations, period) {
  if (period === "todos") return donations;

  const now = new Date();

  return donations.filter((donation) => {
    const date = getDonationDate(donation);
    if (!isValidDate(date)) return false;

    if (period === "7dias") {
      return (now - date) / (1000 * 60 * 60 * 24) <= 7;
    }

    if (period === "mes") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    return date.getFullYear() === now.getFullYear();
  });
}

function buildMonthlySeries(donations) {
  const months = new Map();

  donations.forEach((donation) => {
    const date = getDonationDate(donation);
    if (!isValidDate(date)) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = months.get(key) || {
      key,
      label: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      total: 0,
      quantidade: 0,
    };

    current.total += Number(donation.valor || 0);
    current.quantidade += 1;
    months.set(key, current);
  });

  return [...months.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function buildInstitutionRanking(donations) {
  const ranking = new Map();

  donations.forEach((donation) => {
    const nome = donation.instituicao_nome || donation.instituicao || "Instituição";
    const current = ranking.get(nome) || { nome, total: 0, quantidade: 0 };

    current.total += Number(donation.valor || 0);
    current.quantidade += 1;
    ranking.set(nome, current);
  });

  return [...ranking.values()].sort((a, b) => b.total - a.total);
}

function buildCategoryDistribution(institutions) {
  const categories = new Map();

  institutions.forEach((institution) => {
    const category =
      institution.categoria ||
      institution.area_atuacao ||
      institution.segmento ||
      institution.uf ||
      "Social";
    categories.set(category, (categories.get(category) || 0) + 1);
  });

  return [...categories.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      {label && <p className="font-semibold text-slate-900">{label}</p>}
      {payload.map((item) => (
        <p key={`${item.name}-${item.dataKey}`} className="text-slate-600">
          {item.name}:{" "}
          <span className="font-semibold text-emerald-700">
            {item.dataKey === "total"
              ? currencyFormatter.format(item.value)
              : item.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("mes");
  const donationsResource = useApiResource(api.getDoacoes, {
    initialData: [],
    select: asList,
  });
  const institutionsResource = useApiResource(api.getInstituicoes, {
    initialData: [],
    select: asList,
  });

  const dashboard = useMemo(() => {
    const donations = donationsResource.data || [];
    const institutions = institutionsResource.data || [];
    const filteredDonations = filterByPeriod(donations, period);
    const monthly = buildMonthlySeries(filteredDonations);
    const ranking = buildInstitutionRanking(filteredDonations);
    const categoryDistribution = buildCategoryDistribution(institutions);
    const totalRaised = filteredDonations.reduce(
      (acc, donation) => acc + Number(donation.valor || 0),
      0
    );
    const activeCampaigns = institutions.filter(
      (institution) => institution.status === "aprovado" || institution.status === "ativa"
    ).length;
    const impactedPeople = Math.max(
      filteredDonations.length * 3 + activeCampaigns * 25,
      activeCampaigns * 10
    );
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const currentMonthTotal = donations.reduce((acc, donation) => {
      const date = getDonationDate(donation);
      if (!isValidDate(date)) return acc;
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        ? acc + Number(donation.valor || 0)
        : acc;
    }, 0);
    const previousMonthTotal = donations.reduce((acc, donation) => {
      const date = getDonationDate(donation);
      if (!isValidDate(date)) return acc;
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear
        ? acc + Number(donation.valor || 0)
        : acc;
    }, 0);
    const growth =
      previousMonthTotal > 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
        : currentMonthTotal > 0
          ? 100
          : 0;

    return {
      activeCampaigns,
      categoryDistribution,
      filteredDonations,
      growth,
      impactedPeople,
      institutions,
      monthly,
      ranking,
      recentCampaigns: [...institutions]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 6),
      recentDonations: [...filteredDonations]
        .sort((a, b) => getDonationDate(b) - getDonationDate(a))
        .slice(0, 6),
      totalRaised,
    };
  }, [donationsResource.data, institutionsResource.data, period]);

  const loading = donationsResource.loading || institutionsResource.loading;
  const error = donationsResource.error || institutionsResource.error;
  const refreshing = donationsResource.refreshing || institutionsResource.refreshing;

  const refetchAll = () => {
    donationsResource.refetch();
    institutionsResource.refetch();
  };

  return (
    <Layout className="bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Painel analítico</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Dashboard DoarCuidar
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Indicadores processados a partir das APIs de doações e instituições para acompanhar arrecadação, impacto social e transparência.
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

        <div id="relatorios" className="flex flex-wrap gap-2 scroll-mt-6" role="tablist" aria-label="Filtro por período">
          {PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={period === item.id}
              onClick={() => setPeriod(item.id)}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition ${
                period === item.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <EmptyState
            title="Não foi possível carregar o dashboard"
            description={error}
            actionLabel="Tentar novamente"
            onAction={refetchAll}
          />
        )}

        {!error && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                title="Total de doações"
                value={dashboard.filteredDonations.length}
                description="Contribuições registradas no período."
                icon={HeartHandshake}
                tone="sky"
              />
              <MetricCard
                title="Total arrecadado"
                value={currencyFormatter.format(dashboard.totalRaised)}
                description="Soma das doações processadas."
                icon={Wallet}
                tone="emerald"
              />
              <MetricCard
                title="Instituições"
                value={dashboard.institutions.length}
                description="Cadastros disponíveis na plataforma."
                icon={Building2}
                tone="slate"
              />
              <MetricCard
                title="Campanhas ativas"
                value={dashboard.activeCampaigns}
                description="Instituições aptas a receber apoio."
                icon={Target}
                tone="amber"
              />
              <MetricCard
                title="Pessoas impactadas"
                value={compactFormatter.format(dashboard.impactedPeople)}
                description="Estimativa calculada pelos dados disponíveis."
                icon={Users}
                tone="emerald"
              />
            </div>

            {loading ? (
              <ChartSkeleton />
            ) : (
              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                <Panel
                  title="Evolução mensal de doações"
                  description="Quantidade e valor arrecadado ao longo do tempo."
                >
                  <div className="h-80" aria-label="Gráfico de evolução mensal de doações">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboard.monthly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => compactFormatter.format(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar name="Total" dataKey="total" fill="#059669" radius={[8, 8, 0, 0]} />
                        <Bar name="Doações" dataKey="quantidade" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <Panel
                  title="Distribuição por categorias"
                  description="Categorias inferidas pelos dados de instituições."
                >
                  <div className="h-80" aria-label="Gráfico de distribuição por categorias">
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
                  title="Crescimento de arrecadação"
                  description={`Comparativo mensal atual: ${Math.round(dashboard.growth)}%.`}
                  className="xl:col-span-2"
                >
                  <div className="h-72" aria-label="Gráfico de crescimento de arrecadação">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboard.monthly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => compactFormatter.format(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          name="Total"
                          dataKey="total"
                          stroke="#059669"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#059669" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <Panel
                  title="Instituições mais apoiadas"
                  description="Ranking por valor e volume de doações."
                  className="xl:col-span-2"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                    <div className="h-72" aria-label="Gráfico de instituições mais apoiadas">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboard.ranking.slice(0, 6)} layout="vertical" margin={{ left: 20, right: 12 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="nome" width={110} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar name="Total" dataKey="total" fill="#059669" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] text-left text-sm">
                        <thead className="text-xs uppercase tracking-wide text-slate-500">
                          <tr className="border-b border-slate-100">
                            <th className="px-3 py-3 font-semibold">Instituição</th>
                            <th className="px-3 py-3 font-semibold">Doações</th>
                            <th className="px-3 py-3 text-right font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dashboard.ranking.slice(0, 6).map((item) => (
                            <tr key={item.nome} className="hover:bg-slate-50">
                              <td className="px-3 py-4 font-semibold text-slate-950">{item.nome}</td>
                              <td className="px-3 py-4 text-slate-600">{item.quantidade}</td>
                              <td className="px-3 py-4 text-right font-bold text-emerald-700">
                                {currencyFormatter.format(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Panel>

                <Panel
                  title="Últimas doações"
                  description="Registros mais recentes retornados pela API."
                >
                  <div id="doacoes" className="scroll-mt-6 overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr className="border-b border-slate-100">
                          <th className="px-3 py-3 font-semibold">Instituição</th>
                          <th className="px-3 py-3 font-semibold">Data</th>
                          <th className="px-3 py-3 text-right font-semibold">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dashboard.recentDonations.map((item, index) => (
                          <tr key={item.id || `${item.instituicao_id}-${index}`} className="hover:bg-slate-50">
                            <td className="px-3 py-4 font-semibold text-slate-950">
                              {item.instituicao_nome || item.instituicao || "Instituição"}
                            </td>
                            <td className="px-3 py-4 text-slate-600">
                              {getDonationDate(item).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-3 py-4 text-right font-bold text-emerald-700">
                              {currencyFormatter.format(Number(item.valor || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <Panel
                  title="Campanhas recentes"
                  description="Instituições recém-cadastradas ou atualizadas."
                >
                  <div className="space-y-3">
                    {dashboard.recentCampaigns.map((item) => (
                      <article key={item.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-950">{item.nome}</h3>
                            <p className="mt-1 text-xs text-slate-500">{item.uf || "UF não informada"}</p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {item.status || "cadastrada"}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
