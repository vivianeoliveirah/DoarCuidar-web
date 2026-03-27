import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function AdminInstituicoes() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      setLoading(true);
      const data = await api.getInstituicoes();
      setLista(data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function atualizarStatus(id, status) {
    try {
      await api.atualizarStatus(id, status);
      carregar();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Aprovação de ONGs
      </h1>

      {lista.length === 0 && (
        <p className="text-slate-500">Nenhuma instituição encontrada.</p>
      )}

      {lista.map((inst) => (
        <div
          key={inst.id}
          className="border p-4 mb-4 rounded-xl bg-white shadow-sm"
        >
          <h2 className="font-bold text-lg">{inst.nome}</h2>

          <p className="text-sm text-slate-500">{inst.cnpj}</p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                inst.status === "aprovado"
                  ? "text-green-600"
                  : inst.status === "rejeitado"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {inst.status}
            </span>
          </p>

          <div className="flex gap-2 mt-4">

            <button
              onClick={() => atualizarStatus(inst.id, "aprovado")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Aprovar
            </button>

            <button
              onClick={() => atualizarStatus(inst.id, "rejeitado")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Rejeitar
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}