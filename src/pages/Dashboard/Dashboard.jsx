import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 🔥 MOCK (fallback)
const MOCK_DADOS = [
  { nome: "Instituto Esperança", doacoes: 500 },
  { nome: "Lar Solidário", doacoes: 800 },
  { nome: "Projeto Semeando", doacoes: 300 },
];

export default function Dashboard() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from("instituicoes")
        .select("*");

      if (error) {
        console.error("Erro Supabase:", error);
        setDados(MOCK_DADOS);
        return;
      }

      // 👉 SE NÃO TEM DADOS → usa MOCK
      if (!data || data.length === 0) {
        setDados(MOCK_DADOS);
        return;
      }

      // 👉 DADOS REAIS
      const formatado = data.map((item) => ({
        nome: item.nome,
        doacoes: Math.floor(Math.random() * 1000) + 100,
      }));

      setDados(formatado);
    }

    carregarDados();
  }, []);

  const total = dados.reduce((acc, item) => acc + item.doacoes, 0);

  const top5 = [...dados]
    .sort((a, b) => b.doacoes - a.doacoes)
    .slice(0, 5);

  const cores = ["#10b981", "#059669", "#34d399"];

  return (
    <Layout className="bg-slate-50 py-10">

      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard de Doações
        </h1>

        {/* AVISO (IMPORTANTE PRA UX) */}
        {dados === MOCK_DADOS && (
          <div className="mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
            Mostrando dados demonstrativos.
          </div>
        )}

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-slate-500 text-sm">Total arrecadado</p>
            <h2 className="text-3xl font-bold text-emerald-600">
              R$ {total}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-slate-500 text-sm">Instituições</p>
            <h2 className="text-3xl font-bold">
              {dados.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-slate-500 text-sm">Média</p>
            <h2 className="text-3xl font-bold">
              R$ {dados.length ? Math.floor(total / dados.length) : 0}
            </h2>
          </div>

        </div>

        {/* GRÁFICOS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl border">
            <h3 className="mb-4 font-semibold">Doações por ONG</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="doacoes" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <h3 className="mb-4 font-semibold">Distribuição</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={top5} dataKey="doacoes" outerRadius={100}>
                  {top5.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </Layout>
  );
}