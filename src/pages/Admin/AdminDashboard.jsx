import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { CheckCircle, XCircle, Building2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pendente: 0,
    aprovado: 0,
    rejeitado: 0,
  });

  const navigate = useNavigate();

  // 🔥 atualizar dados
  function atualizarDados(data) {
    setOngs(data);

    const total = data.length;
    const pendente = data.filter(i => i.status === "pendente").length;
    const aprovado = data.filter(i => i.status === "aprovado").length;
    const rejeitado = data.filter(i => i.status === "rejeitado").length;

    setStats({ total, pendente, aprovado, rejeitado });
  }

  // 🔥 carregar dados
  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("instituicoes")
        .select("*");

      if (data) atualizarDados(data);

      setLoading(false);
    }

    carregar();
  }, []);

  // ✅ aprovar
  async function aprovar(id) {
    const { error } = await supabase
      .from("instituicoes")
      .update({ status: "aprovado" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao aprovar");
      return;
    }

    const novosDados = ongs.map((ong) =>
      ong.id === id ? { ...ong, status: "aprovado" } : ong
    );

    atualizarDados(novosDados);
  }

  // ❌ rejeitar
  async function rejeitar(id) {
    const { error } = await supabase
      .from("instituicoes")
      .update({ status: "rejeitado" })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao rejeitar");
      return;
    }

    const novosDados = ongs.map((ong) =>
      ong.id === id ? { ...ong, status: "rejeitado" } : ong
    );

    atualizarDados(novosDados);
  }

  // 🚪 logout
  async function sair() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const chartData = [
    { name: "Pendentes", value: stats.pendente },
    { name: "Aprovadas", value: stats.aprovado },
    { name: "Rejeitadas", value: stats.rejeitado },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* 🔥 TOPO */}
        <div className="flex justify-between items-center">

          <div>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-emerald-600 hover:underline"
            >
              ← Voltar
            </button>

            <h1 className="text-2xl font-bold mt-2">
              Dashboard Administrativo
            </h1>
          </div>

          <button
            onClick={sair}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            <LogOut size={16} />
            Sair
          </button>

        </div>

        {/* 📊 CARDS */}
        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-white p-4 rounded-2xl border">
            <p className="text-sm text-slate-500">Total</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-2xl border">
            <p className="text-yellow-700 text-sm">Pendentes</p>
            <h2 className="text-2xl font-bold">{stats.pendente}</h2>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl border">
            <p className="text-green-700 text-sm">Aprovadas</p>
            <h2 className="text-2xl font-bold">{stats.aprovado}</h2>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border">
            <p className="text-red-700 text-sm">Rejeitadas</p>
            <h2 className="text-2xl font-bold">{stats.rejeitado}</h2>
          </div>

        </div>

        {/* 📈 GRÁFICO */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-semibold mb-4">Status das ONGs</h2>

          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" label>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📋 LISTA */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {ongs.map((ong) => (
            <div
              key={ong.id}
              className="bg-white p-5 rounded-2xl border shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Building2 />
                </div>

                <div>
                  <p className="font-bold">{ong.nome}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(ong.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-3">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    ong.status === "aprovado"
                      ? "text-green-600"
                      : ong.status === "rejeitado"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {ong.status}
                </span>
              </p>

              {ong.status === "pendente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => aprovar(ong.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                  >
                    Aprovar
                  </button>

                  <button
                    onClick={() => rejeitar(ong.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>

      </div>
    </Layout>
  );
}