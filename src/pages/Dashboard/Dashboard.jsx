import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

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

const MOCK = [
  { nome: "Instituto Esperança", doacoes: 500 },
  { nome: "Lar Solidário", doacoes: 800 },
  { nome: "Projeto Semeando", doacoes: 300 },
];

export default function Dashboard() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function carregar() {
      try {
        const res = await api.getInstituicoes();

        const lista =
          res?.length > 0
            ? res.map((i) => ({
                nome: i.nome,
                doacoes: Math.floor(Math.random() * 1000) + 100,
              }))
            : MOCK;

        if (mounted) setDados(lista);
      } catch {
        if (mounted) setDados(MOCK);
      }
    }

    carregar();
    return () => (mounted = false);
  }, []);

  const total = dados.reduce((acc, i) => acc + i.doacoes, 0);

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

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Total arrecadado" value={`R$ ${total}`} />
          <Card title="Instituições" value={dados.length} />
          <Card
            title="Média"
            value={`R$ ${dados.length ? Math.floor(total / dados.length) : 0}`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <ChartCard title="Doações por ONG">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="doacoes" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribuição">
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
          </ChartCard>

        </div>

      </div>
    </Layout>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <p className="text-slate-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-emerald-600">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}