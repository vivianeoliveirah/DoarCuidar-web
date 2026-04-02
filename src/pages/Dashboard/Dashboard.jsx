import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [periodo, setPeriodo] = useState("mes");

  

  useEffect(() => {
  async function carregar() {
    try {
      const res = await api.getDoacoes();

      setDados(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    }
  }

  carregar();
}, []);

  // 🎯 FILTRO
  function filtrarPorPeriodo(lista) {
    const agora = new Date();

    return lista.filter((d) => {
      const data = new Date(d.created_at);

      if (periodo === "7dias") {
        return (agora - data) / (1000 * 60 * 60 * 24) <= 7;
      }

      if (periodo === "mes") {
        return data.getMonth() === agora.getMonth();
      }

      if (periodo === "ano") {
        return data.getFullYear() === agora.getFullYear();
      }

      return true;
    });
  }

  const doacoesFiltradas = filtrarPorPeriodo(dados);

  // 📊 TOTAL
  const total = doacoesFiltradas.reduce(
    (acc, d) => acc + Number(d.valor || 0),
    0
  );

  // 📈 CRESCIMENTO
  function calcularCrescimento(lista) {
    const agora = new Date();

    const atual = lista.filter((d) => {
      const data = new Date(d.created_at);
      return data.getMonth() === agora.getMonth();
    });

    const anterior = lista.filter((d) => {
      const data = new Date(d.created_at);
      return data.getMonth() === agora.getMonth() - 1;
    });

    const totalAtual = atual.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    const totalAnterior = anterior.reduce(
      (acc, d) => acc + Number(d.valor || 0),
      0
    );

    if (totalAnterior === 0) return 100;

    return ((totalAtual - totalAnterior) / totalAnterior) * 100;
  }

  const crescimento = calcularCrescimento(dados);

  // 📊 AGRUPAR POR MÊS
  const porMes = {};

  doacoesFiltradas.forEach((d) => {
    const data = new Date(d.created_at);
    const mes = data.toLocaleString("pt-BR", { month: "short" });

    if (!porMes[mes]) porMes[mes] = 0;

    porMes[mes] += Number(d.valor || 0);
  });

  const dadosGrafico = Object.keys(porMes).map((mes) => ({
    mes,
    total: porMes[mes],
  }));

  // 🧠 INSIGHT
  function gerarInsight() {
    if (total === 0) return "Você ainda não realizou doações 😢";

    if (crescimento > 0)
      return "Você está aumentando suas doações 📈";

    if (crescimento < 0)
      return "Suas doações diminuíram este mês ⚠️";

    return "Seu padrão está estável 👍";
  }

  return (
    <Layout className="bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard de Doações
        </h1>

        {/* 🔥 FILTRO */}
        <div className="flex gap-2 mb-6">
          {["7dias", "mes", "ano"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 rounded ${
                periodo === p
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* 📊 CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="Total" value={`R$ ${total}`} />
          <Card title="Doações" value={doacoesFiltradas.length} />
          <Card
            title="Crescimento"
            value={`${Math.floor(crescimento)}%`}
          />
        </div>

        {/* 📈 GRÁFICO */}
        <div className="bg-white p-6 rounded-2xl border mb-6">
          <h3 className="mb-4 font-semibold">Doações por mês</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🧠 INSIGHT */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-semibold mb-2">Insight</h3>
          <p>{gerarInsight()}</p>
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