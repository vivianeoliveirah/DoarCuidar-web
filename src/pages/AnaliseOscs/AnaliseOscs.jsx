import { useEffect, useMemo, useRef, useState } from "react";
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
  Activity,
  BarChart3,
  Binary,
  BookOpenCheck,
  Building2,
  Database,
  Layers3,
  MapPinned,
  Network,
  RefreshCw,
  Scale,
  Shapes,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";

import ChartSkeleton from "../../components/dashboard/ChartSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";
import MetricCard from "../../components/dashboard/MetricCard";
import Panel from "../../components/dashboard/Panel";
import Layout from "../../components/layout/Layout";
import { useApiResource } from "../../hooks/useApiResource";
import { api, getErrorMessage } from "../../services/api";
import { getActivityAxisLabel, getMatrixBranchLabel } from "./presentation";

const EMPTY_ANALYTICS = {
  resumo: null,
  estados: [],
  atividades: [],
  naturezas: [],
  clusters: [],
  modelo: null,
};

const PROFILE_COLORS = ["#059669", "#0891b2", "#d97706", "#475569", "#dc2626", "#7c3aed"];
const NATURE_COLORS = ["#059669", "#0891b2", "#d97706", "#64748b"];
const numberFormatter = new Intl.NumberFormat("pt-BR");
const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

function formatPercent(value) {
  return `${decimalFormatter.format(Number(value) || 0)}%`;
}

function AnalyticsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const source = payload[0]?.payload || {};
  const fullLabel =
    source.estado || source.atividade || source.natureza_juridica || label;

  return (
    <div className="max-w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-xl">
      <p className="font-bold leading-5 text-slate-950">{fullLabel}</p>
      <p className="mt-1 text-slate-600">
        {formatNumber(source.quantidade)} OSCs · {formatPercent(source.percentual_total)}
      </p>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div aria-live="polite" aria-busy="true" className="space-y-6">
      <span className="sr-only">Carregando análise das OSCs...</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            aria-hidden="true"
          >
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-5 h-8 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

function Overview({ resumo }) {
  const metrics = [
    {
      title: "OSCs analisadas",
      value: resumo.total_analisado,
      description: "Organizações presentes no conjunto público analisado.",
      icon: Building2,
      tone: "emerald",
    },
    {
      title: "UFs",
      value: resumo.quantidade_ufs,
      description: "Unidades federativas representadas nos dados.",
      icon: MapPinned,
      tone: "sky",
    },
    {
      title: "Municípios",
      value: resumo.quantidade_municipios,
      description: "Municípios distintos encontrados no conjunto.",
      icon: Network,
      tone: "slate",
    },
    {
      title: "Atividades econômicas",
      value: resumo.quantidade_atividades_economicas,
      description: "Atividades cadastrais distintas identificadas.",
      icon: Activity,
      tone: "amber",
    },
    {
      title: "Naturezas jurídicas",
      value: resumo.quantidade_naturezas_juridicas,
      description: "Categorias jurídicas presentes na análise.",
      icon: Scale,
      tone: "slate",
    },
    {
      title: "Perfis estruturais",
      value: resumo.numero_clusters,
      description: "Padrões identificados por aprendizagem não supervisionada.",
      icon: Shapes,
      tone: "emerald",
    },
  ];

  return (
    <section aria-labelledby="visao-geral-title">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
          Visão geral
        </p>
        <h2 id="visao-geral-title" className="mt-2 text-2xl font-extrabold text-slate-950">
          Dimensão do conjunto analisado
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            value={formatNumber(metric.value)}
          />
        ))}
      </div>
    </section>
  );
}

function StatesChart({ estados }) {
  const chartHeight = Math.max(560, estados.length * 27);

  return (
    <Panel
      className="min-w-0 overflow-hidden"
      title="Distribuição geográfica"
      description="Quantidade e participação das OSCs do conjunto analisado em cada estado."
    >
      <div
        className="w-full overflow-x-auto"
        role="img"
        aria-label="Gráfico de barras da distribuição das OSCs por estado"
      >
        <div className="min-w-[42rem]" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={estados}
              layout="vertical"
              margin={{ top: 4, right: 42, left: 16, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatNumber}
              />
              <YAxis
                type="category"
                dataKey="estado"
                width={138}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#475569" }}
              />
              <Tooltip content={<AnalyticsTooltip />} />
              <Bar
                name="OSCs"
                dataKey="quantidade"
                fill="#059669"
                radius={[0, 5, 5, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <details className="mt-5 border-t border-slate-100 pt-4">
        <summary className="cursor-pointer text-sm font-bold text-emerald-700">
          Ver tabela completa por estado
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-3 font-semibold">Estado</th>
                <th className="pb-3 text-right font-semibold">OSCs</th>
                <th className="pb-3 text-right font-semibold">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estados.map((item) => (
                <tr key={item.estado}>
                  <td className="py-3 font-medium text-slate-800">{item.estado}</td>
                  <td className="py-3 text-right text-slate-600">
                    {formatNumber(item.quantidade)}
                  </td>
                  <td className="py-3 text-right font-semibold text-emerald-700">
                    {formatPercent(item.percentual_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}

function ActivitiesChart({ atividades }) {
  return (
    <Panel
      className="min-w-0 overflow-hidden"
      title="Atividades econômicas predominantes"
      description="As atividades mais frequentes entre as OSCs presentes no conjunto analisado."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
        <div
          className="h-[32rem] min-w-0"
          role="img"
          aria-label="Gráfico das dez atividades econômicas predominantes"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={atividades}
              layout="vertical"
              margin={{ top: 4, right: 30, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="atividade"
                width={158}
                tickLine={false}
                axisLine={false}
                tickFormatter={getActivityAxisLabel}
                tick={{ fontSize: 11, fill: "#475569" }}
              />
              <Tooltip content={<AnalyticsTooltip />} />
              <Bar
                name="OSCs"
                dataKey="quantidade"
                fill="#0891b2"
                radius={[0, 5, 5, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ol className="space-y-2" aria-label="Lista completa das atividades econômicas">
          {atividades.map((item) => (
            <li
              key={item.atividade}
              className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 border-b border-slate-100 py-2.5 last:border-0"
            >
              <span className="font-mono text-xs font-bold text-cyan-700">
                {String(item.posicao).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium leading-5 text-slate-700">
                {item.atividade}
              </span>
              <span className="whitespace-nowrap text-xs font-bold text-slate-500">
                {formatPercent(item.percentual_total)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}

function NaturesChart({ naturezas }) {
  return (
    <Panel
      className="min-w-0 overflow-hidden"
      title="Natureza jurídica"
      description="Composição jurídica das organizações presentes nos dados analisados."
    >
      <div className="flex min-w-0 flex-col gap-5">
        <div
          className="mx-auto h-80 w-full max-w-md"
          role="img"
          aria-label="Gráfico da distribuição por natureza jurídica"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={naturezas}
                dataKey="quantidade"
                nameKey="natureza_juridica"
                innerRadius={76}
                outerRadius={124}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {naturezas.map((item, index) => (
                  <Cell
                    key={item.natureza_juridica}
                    fill={NATURE_COLORS[index % NATURE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<AnalyticsTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="grid min-w-0 gap-x-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {naturezas.map((item, index) => (
            <li
              key={item.natureza_juridica}
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border-t border-slate-100 py-3"
            >
              <span
                className="mt-1.5 h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: NATURE_COLORS[index % NATURE_COLORS.length] }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-5 text-slate-900">
                  {item.natureza_juridica}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {formatNumber(item.quantidade)} OSCs
                </p>
              </div>
              <span className="whitespace-nowrap text-sm font-extrabold text-slate-700">
                {formatPercent(item.percentual_total)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function Characteristic({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold leading-5 text-slate-700">{value}</dd>
    </div>
  );
}

function Profiles({ clusters, onSelectProfile }) {
  return (
    <section aria-labelledby="profiles-title" className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            Aprendizagem de máquina
          </p>
          <h2 id="profiles-title" className="mt-2 text-3xl font-extrabold text-slate-950">
            Perfis estruturais identificados
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A aprendizagem não supervisionada foi utilizada para identificar padrões
            recorrentes entre as organizações analisadas a partir de características
            cadastrais, territoriais e de atuação.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {clusters.map((cluster, index) => (
            <article
              key={cluster.cluster_id}
              className="flex min-h-[25rem] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-950/5"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: PROFILE_COLORS[index % PROFILE_COLORS.length] }}
                  aria-hidden="true"
                >
                  <Layers3 size={20} />
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">
                  Perfil estrutural {index + 1}
                </span>
              </div>

              <h3 className="mt-5 text-base font-extrabold leading-6 text-slate-950">
                {cluster.descricao}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <strong className="text-2xl font-black text-slate-950">
                  {formatNumber(cluster.quantidade)}
                </strong>
                <span className="text-sm font-bold text-emerald-700">
                  {formatPercent(cluster.percentual_total)}
                </span>
              </div>

              <dl className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                <Characteristic
                  label="Atividade mais frequente"
                  value={cluster.atividades_predominantes?.[0]?.categoria}
                />
                <Characteristic
                  label="Natureza predominante"
                  value={cluster.naturezas_juridicas_predominantes?.[0]?.categoria}
                />
                <Characteristic
                  label="Maior presença territorial"
                  value={cluster.estados_predominantes?.[0]?.categoria}
                />
              </dl>

              <button
                type="button"
                onClick={(event) => onSelectProfile(cluster, event.currentTarget)}
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 pt-2 pb-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600"
                aria-label={`Ver detalhes do perfil ${index + 1}`}
              >
                <BarChart3 size={17} aria-hidden="true" />
                Ver composição
              </button>
              <p className="mt-3 text-center font-mono text-[11px] text-slate-400">
                Identificador técnico: {cluster.cluster_id}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailList({ title, items = [], formatCategory = (value) => value }) {
  return (
    <section>
      <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={`${title}-${item.categoria}`}
              className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5"
            >
              <span className="text-sm font-medium leading-5 text-slate-700">
                {formatCategory(item.categoria)}
              </span>
              <span className="whitespace-nowrap text-xs font-bold text-emerald-700">
                {formatPercent(item.percentual_cluster)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Sem dados para esta dimensão.</p>
      )}
    </section>
  );
}

export function ProfileDialog({ state, onClose, onRetry, returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!state.open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const returnTarget = returnFocusRef?.current || document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus?.();
    };
  }, [state.open, returnFocusRef]);

  if (!state.open) return null;
  const profile = state.data;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Composição do perfil
            </p>
            <h2 id="profile-dialog-title" className="mt-1 text-xl font-extrabold text-slate-950">
              {profile?.descricao || "Carregando perfil estrutural"}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Fechar detalhes do perfil"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {state.loading && (
            <div role="status" className="flex min-h-44 items-center justify-center gap-3 text-slate-600">
              <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" aria-hidden="true" />
              Carregando composição completa...
            </div>
          )}

          {state.error && !state.loading && (
            <EmptyState
              title="Não foi possível carregar o perfil"
              description={state.error}
              actionLabel="Tentar novamente"
              onAction={onRetry}
            />
          )}

          {profile && !state.loading && !state.error && (
            <>
              <div className="grid gap-3 border-b border-slate-100 pb-6 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase text-emerald-700">OSCs no perfil</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {formatNumber(profile.quantidade)}
                  </p>
                </div>
                <div className="rounded-xl bg-cyan-50 p-4">
                  <p className="text-xs font-bold uppercase text-cyan-700">Participação no conjunto</p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {formatPercent(profile.percentual_total)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-7 md:grid-cols-2">
                <DetailList title="Principais atividades" items={profile.atividades_predominantes} />
                <DetailList
                  title="Principais naturezas jurídicas"
                  items={profile.naturezas_juridicas_predominantes}
                />
                <DetailList title="Principais estados" items={profile.estados_predominantes} />
                <DetailList
                  title="Matriz e filial"
                  items={profile.matriz_filial}
                  formatCategory={getMatrixBranchLabel}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Methodology({ modelo }) {
  const steps = [
    { label: "Dados públicos", icon: Database },
    { label: "Tratamento dos dados", icon: BookOpenCheck },
    { label: "Análise exploratória", icon: BarChart3 },
    { label: "Aprendizagem não supervisionada", icon: Binary },
    { label: `${formatNumber(modelo.numero_clusters)} perfis estruturais`, icon: Shapes },
  ];
  const technicalDetails = [
    ["Algoritmo", modelo.algoritmo],
    ["Número de perfis (K)", formatNumber(modelo.numero_clusters)],
    ["Registros analisados", formatNumber(modelo.numero_registros)],
    ["Dimensões", formatNumber(modelo.numero_dimensoes)],
    ["Silhouette de referência", decimalFormatter.format(modelo.silhouette_score)],
    ["ARI de estabilidade", decimalFormatter.format(modelo.estabilidade_ari)],
    ["Semente do modelo", modelo.seed],
  ];

  return (
    <section aria-labelledby="methodology-title" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-400">
            Metodologia
          </p>
          <h2 id="methodology-title" className="mt-2 text-3xl font-extrabold">
            Como os perfis foram identificados
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            O processo combina preparação, exploração e agrupamento dos dados públicos.
            As métricas abaixo descrevem o comportamento técnico do modelo e não
            avaliam as organizações analisadas.
          </p>
        </div>

        <ol className="mt-8 grid gap-3 md:grid-cols-5" aria-label="Etapas da metodologia">
          {steps.map((step, index) => (
            <li key={step.label} className="relative border-l-2 border-emerald-500 py-2 pl-4 md:border-l-0 md:border-t-2 md:pt-5 md:pl-0">
              <step.icon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold leading-5 text-white">{step.label}</p>
              <span className="mt-1 block font-mono text-[10px] text-slate-500">
                ETAPA {String(index + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>

        <details className="mt-8 border-t border-white/10 pt-5">
          <summary className="cursor-pointer text-sm font-bold text-emerald-300">
            Detalhes técnicos
          </summary>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {technicalDetails.map(([label, value]) => (
              <div key={label} className="bg-slate-900 p-4">
                <dt className="text-xs font-semibold text-slate-400">{label}</dt>
                <dd className="mt-2 font-mono text-sm font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}

export function AnaliseOscsContent({
  data = EMPTY_ANALYTICS,
  loading = false,
  refreshing = false,
  error = "",
  onRetry = () => {},
  onSelectProfile = () => {},
  profileDetail = { open: false, loading: false, error: "", data: null },
  onCloseProfile = () => {},
  onRetryProfile = () => {},
  profileTriggerRef,
}) {
  const resumo = data.resumo;
  const estados = Array.isArray(data.estados) ? data.estados : [];
  const atividades = Array.isArray(data.atividades) ? data.atividades : [];
  const naturezas = Array.isArray(data.naturezas) ? data.naturezas : [];
  const clusters = Array.isArray(data.clusters) ? data.clusters : [];
  const modelo = data.modelo;
  const hasData = Boolean(resumo && modelo && clusters.length);

  return (
    <Layout className="overflow-x-hidden bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Workflow size={18} aria-hidden="true" />
              Projeto Integrador · análise em escala
            </div>
            <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Análise das OSCs
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Panorama das Organizações da Sociedade Civil a partir de dados públicos e
              aprendizagem de máquina. Os indicadores representam as OSCs presentes no
              conjunto analisado.
            </p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            disabled={loading || refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 lg:self-auto"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Atualizar dados
          </button>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-7xl space-y-8 px-4 py-8 sm:px-6">
        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button type="button" onClick={onRetry} className="font-bold underline underline-offset-4">
              Tentar novamente
            </button>
          </div>
        )}

        {loading && !hasData ? (
          <AnalyticsLoading />
        ) : !hasData ? (
          <EmptyState
            title="Resultados analíticos indisponíveis"
            description="Não há dados suficientes para montar esta visualização agora."
            actionLabel="Tentar novamente"
            onAction={onRetry}
          />
        ) : (
          <>
            <Overview resumo={resumo} />
            {estados.length ? <StatesChart estados={estados} /> : null}
            <div className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              {atividades.length ? <ActivitiesChart atividades={atividades} /> : null}
              {naturezas.length ? <NaturesChart naturezas={naturezas} /> : null}
            </div>
          </>
        )}
      </div>

      {hasData && <Profiles clusters={clusters} onSelectProfile={onSelectProfile} />}
      {hasData && modelo && <Methodology modelo={modelo} />}

      {hasData && (
        <section className="border-t border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 py-7 sm:px-6">
            <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h2 className="font-extrabold text-amber-950">Sobre os perfis identificados</h2>
              <p className="mt-2 max-w-5xl text-sm leading-7 text-amber-950">
                Os perfis representam padrões estruturais encontrados nos
                dados públicos analisados. Eles não constituem avaliação de qualidade,
                confiabilidade, transparência, impacto social ou legitimidade das
                organizações.
              </p>
            </div>
          </div>
        </section>
      )}

      <ProfileDialog
        state={profileDetail}
        onClose={onCloseProfile}
        onRetry={onRetryProfile}
        returnFocusRef={profileTriggerRef}
      />
    </Layout>
  );
}

export default function AnaliseOscs() {
  const resource = useApiResource(api.getOscAnalytics, {
    initialData: EMPTY_ANALYTICS,
  });
  const [profileDetail, setProfileDetail] = useState({
    open: false,
    loading: false,
    error: "",
    data: null,
  });
  const profileTriggerRef = useRef(null);

  const selectedClusterId = profileDetail.data?.cluster_id;

  const loadProfile = async (cluster, trigger) => {
    if (trigger) profileTriggerRef.current = trigger;
    setProfileDetail({ open: true, loading: true, error: "", data: cluster });
    try {
      const detail = await api.getOscCluster(cluster.cluster_id);
      setProfileDetail({ open: true, loading: false, error: "", data: detail });
    } catch (error) {
      setProfileDetail((current) => ({
        ...current,
        loading: false,
        error: getErrorMessage(error),
      }));
    }
  };

  const retryProfile = () => {
    const cluster = resource.data?.clusters?.find(
      (item) => item.cluster_id === selectedClusterId
    );
    if (cluster) loadProfile(cluster);
  };

  const contentProps = useMemo(
    () => ({
      data: resource.data || EMPTY_ANALYTICS,
      loading: resource.loading,
      refreshing: resource.refreshing,
      error: resource.error || "",
      onRetry: resource.error ? resource.reload : resource.refetch,
      onSelectProfile: loadProfile,
      profileDetail,
      onCloseProfile: () =>
        setProfileDetail({ open: false, loading: false, error: "", data: null }),
      onRetryProfile: retryProfile,
      profileTriggerRef,
    }),
    // The handlers intentionally track the current resource and selected profile state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource, profileDetail, selectedClusterId]
  );

  return <AnaliseOscsContent {...contentProps} />;
}
