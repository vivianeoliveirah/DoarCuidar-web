import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getSessionUser, logoutUser } from "../../services/authService";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { MapPin, Calendar, Heart, LogOut } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Perfil() {
  const [user, setUser] = useState(getSessionUser());
  const [doacoes, setDoacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      try {
        const data = await api.getPerfil();
        setUser(data.user || getSessionUser());
        setDoacoes(data.doacoes || []);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }

    carregar();
  }, []);

  const sair = () => {
    logoutUser();
    navigate("/");
  };

  const totalDoado = doacoes.reduce(
    (acc, d) => acc + Number(d.valor || 0),
    0
  );

  const resumoPorOng = {};

  doacoes.forEach((d) => {
    const nome = d.instituicao_nome || "ONG";

    if (!resumoPorOng[nome]) {
      resumoPorOng[nome] = 0;
    }

    resumoPorOng[nome] += Number(d.valor);
  });

  const ranking = Object.entries(resumoPorOng).map(([nome, total]) => ({
    nome,
    total,
  }));

  ranking.sort((a, b) => b.total - a.total);

  const topOng = ranking[0];

  if (!user) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <Layout className="bg-slate-50">
      <div className="h-48 bg-emerald-600"></div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-20 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-sm border p-8 text-center h-fit">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-4 border-white shadow-sm">
              {user.nome?.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold">{user.nome}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.email}</p>

            <div className="space-y-4 text-left border-t pt-6">
              <div className="flex gap-3 text-sm">
                <MapPin size={18} /> {user.uf || "-"}
              </div>
              <div className="flex gap-3 text-sm">
                <Calendar size={18} /> {user.desde}
              </div>
              <div className="flex gap-3 text-sm">
                <Heart size={18} />
                <b>R$ {totalDoado.toFixed(2)}</b>
              </div>
            </div>

            <Button
              onClick={sair}
              className="w-full mt-8 bg-white border text-red-600"
            >
              <LogOut size={18} /> Sair
            </Button>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-slate-500">Você mais ajudou</p>
            {topOng ? (
              <>
                <h3 className="text-xl font-bold">{topOng.nome}</h3>
                <p className="text-emerald-600 font-semibold">
                  R$ {topOng.total.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-slate-400">Sem doações ainda</p>
            )}
          </div>
        </div>

        {ranking.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Doações por ONG</h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ranking}>
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border shadow-sm">
          <h3 className="text-xl font-bold mb-6">Histórico de Doações</h3>

          {doacoes.length === 0 ? (
            <p className="text-slate-500">Você ainda não fez doações.</p>
          ) : (
            <div className="space-y-4">
              {doacoes.map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center p-4 rounded-2xl bg-slate-50"
                >
                  <div>
                    <p className="font-bold">{d.instituicao_nome || "ONG"}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(d.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-emerald-600 font-bold">
                      R$ {Number(d.valor).toFixed(2)}
                    </p>

                    <button
                      onClick={() => navigate(`/detalhes/${d.instituicao_id}`)}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Doar novamente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
