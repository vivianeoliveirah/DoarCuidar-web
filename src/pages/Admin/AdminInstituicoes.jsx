import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function AdminInstituicoes() {
  const [lista, setLista] = useState([]);

  async function carregar() {
    const { data } = await supabase
      .from("instituicoes")
      .select("*")
      .order("created_at", { ascending: false });

    setLista(data);
  }

  useEffect(() => {
  let ativo = true;

  async function carregar() {
    const { data } = await supabase
      .from("instituicoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (ativo && data) {
      setLista(data);
    }
  }

  carregar();

  return () => {
    ativo = false;
  };
}, []);

  async function atualizarStatus(id, status) {
    await supabase
      .from("instituicoes")
      .update({ status })
      .eq("id", id);

    carregar();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Aprovação de ONGs
      </h1>

      {lista.map((inst) => (
        <div key={inst.id} className="border p-4 mb-4 rounded-xl">

          <h2 className="font-bold">{inst.nome}</h2>
          <p>{inst.cnpj}</p>
          <p>Status: {inst.status}</p>

          <div className="flex gap-2 mt-2">
            <button onClick={() => atualizarStatus(inst.id, "aprovado")}>
              Aprovar
            </button>

            <button onClick={() => atualizarStatus(inst.id, "rejeitado")}>
              Rejeitar
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}