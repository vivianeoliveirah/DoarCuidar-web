import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, RefreshCw, Search } from "lucide-react";

import EmptyState from "../../components/dashboard/EmptyState";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import InputTexto from "../../components/ui/InputTexto";
import SelectUF from "../../components/ui/SelectUF";
import { useApiResource } from "../../hooks/useApiResource";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { api } from "../../services/api";

function asInstitutionList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}


export default function BuscarInstituicoes() {
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const debouncedSearch = useDebouncedValue(busca.trim().toLowerCase(), 300);
  const {
    data: instituicoes,
    error,
    loading,
    refreshing,
    refetch,
  } = useApiResource(() => api.getInstituicoes(debouncedSearch, uf), {
    initialData: [],
    deps: [debouncedSearch, uf],
    select: asInstitutionList,
  });

  const instituicoesFiltradas = useMemo(() => {
    return instituicoes.filter((inst) => {
      const nome = `${inst.nome || ""} ${inst.razao_social || ""}`.toLowerCase();
      const cnpj = inst.cnpj || "";
      const buscaMatch =
        !debouncedSearch ||
        nome.includes(debouncedSearch) ||
        cnpj.includes(debouncedSearch);
      const ufMatch = !uf || inst.uf === uf;

      return buscaMatch && ufMatch;
    });
  }, [debouncedSearch, instituicoes, uf]);
  const showLoading = loading && instituicoes.length === 0;

  return (
    <Layout className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
              Rede DoarCuidar
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Buscar Instituições
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Encontre causas reais, filtre por estado e escolha uma instituição para apoiar com confiança.
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Atualizar lista de instituições"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} aria-hidden="true" />
            Atualizar
          </button>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_12rem_auto] md:items-end">
          <InputTexto
            label="Nome ou CNPJ"
            name="q"
            placeholder="Ex: Instituto..."
            aria-label="Buscar instituição por nome ou CNPJ"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />

          <SelectUF value={uf} onChange={(event) => setUf(event.target.value)} />

          <Button
            type="button"
            variant="brand"
            className="min-h-12 px-8"
            onClick={() => setBusca((current) => current.trim())}
            aria-label="Buscar instituições"
          >
            <Search size={18} aria-hidden="true" />
            Buscar
          </Button>
        </div>


        {error && instituicoesFiltradas.length === 0 ? (
          <EmptyState
            title="Não foi possível carregar as instituições"
            description={error}
            actionLabel="Tentar novamente"
            onAction={refetch}
          />
        ) : showLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite" aria-label="Carregando instituições">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-2xl bg-white p-6 shadow-sm shadow-slate-950/5 ring-1 ring-slate-200">
                <div className="h-5 w-2/3 rounded-full bg-slate-200" />
                <div className="mt-5 h-3 w-1/2 rounded-full bg-slate-100" />
                <div className="mt-8 space-y-3">
                  <div className="h-3 rounded-full bg-slate-100" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : instituicoesFiltradas.length === 0 ? (
          <EmptyState
            title="Nenhuma instituição encontrada"
            description="Ajuste os filtros ou atualize a lista para consultar novas instituições."
            actionLabel="Limpar filtros"
            onAction={() => {
              setBusca("");
              setUf("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instituicoesFiltradas.map((inst) => (
              <Link
                to={`/detalhes/${inst.id}`}
                key={inst.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-slate-950/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold leading-snug text-slate-950 transition group-hover:text-emerald-700">
                    {inst.nome}
                  </h2>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    <MapPin size={12} aria-hidden="true" />
                    {inst.uf || "-"}
                  </span>
                </div>

                <p className="mb-4 font-mono text-xs text-slate-500">
                  {inst.cnpj || "CNPJ não informado"}
                </p>

                <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">
                    CNPJ verificado
                  </span>
                  <span className="rounded-full bg-slate-50 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                    Dados institucionais
                  </span>
                </div>

                <p className="mb-6 line-clamp-3 text-sm leading-6 text-slate-600">
                  {inst.descricao || "Sem descrição disponível."}
                </p>

                <span className="text-sm font-bold text-emerald-700">
                  Ver detalhes
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
