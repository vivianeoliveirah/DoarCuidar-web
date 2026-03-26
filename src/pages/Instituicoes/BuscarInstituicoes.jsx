import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import InputTexto from "../../components/ui/InputTexto";
import SelectUF from "../../components/ui/SelectUF";
import Button from "../../components/ui/Button";

import { Search, MapPin } from "lucide-react";
import { supabase } from "../../services/supabase";

export default function BuscarInstituicoes() {
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const [instituicoes, setInstituicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);

      const { data, error } = await supabase
        .from("instituicoes")
        .select("*")
        .eq("status", "aprovado") // 🔥 só ONGs aprovadas
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar instituições:", error);
        setInstituicoes([]);
      } else {
        setInstituicoes(data);
      }

      setCarregando(false);
    }

    carregarDados();
  }, []);

  // 🔍 filtro
  const instituicoesFiltradas = instituicoes.filter((inst) => {
    const nome = inst.nome || "";
    const cnpj = inst.cnpj || "";

    const buscaMatch =
      nome.toLowerCase().includes(busca.toLowerCase()) ||
      cnpj.includes(busca);

    const ufMatch = uf === "" || inst.uf === uf;

    return buscaMatch && ufMatch;
  });

  return (
    <Layout className="py-12">
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Buscar Instituições
          </h1>

          <p className="text-slate-500 mt-2">
            Encontre causas reais e faça a diferença 💚
          </p>
        </div>

        {/* FILTROS */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border mb-10 flex flex-col md:flex-row gap-4 items-end">

          <InputTexto
  label="Nome ou CNPJ"
  placeholder="Ex: Instituto..."
  aria-label="Buscar instituição por nome ou CNPJ"
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
/>

          <div className="w-full md:w-48">
            <SelectUF value={uf} onChange={(e) => setUf(e.target.value)} />
          </div>

          <Button variant="brand" className="h-11 px-8 gap-2">
            <Search size={18} />
            Buscar
          </Button>
        </div>

        {/* RESULTADOS */}
        {carregando ? (
          <div className="text-center py-20 text-slate-400">
            Carregando instituições...
          </div>
        ) : instituicoesFiltradas.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            Nenhuma instituição encontrada 😔
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {instituicoesFiltradas.map((inst) => (
              <Link
                to={`/detalhes/${inst.id}`} // ✅ CORRETO
                key={inst.id}
                className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">

                  <h3 className="font-bold text-xl group-hover:text-emerald-600 transition">
                    {inst.nome}
                  </h3>

                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <MapPin size={12} />
                    {inst.uf}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 font-mono">
                  {inst.cnpj}
                </p>

                <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                  {inst.descricao || "Sem descrição disponível."}
                </p>

                <div className="text-emerald-600 font-semibold text-sm group-hover:underline">
                  Ver detalhes →
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </Layout>
  );
}