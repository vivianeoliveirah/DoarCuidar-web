import { supabaseRest } from "./supabaseRest.js";

export async function listarDoacoes(userId = "") {
  const params = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
  });

  if (userId) params.set("user_id", `eq.${userId}`);

  return await supabaseRest(`/doacoes?${params.toString()}`);
}

export async function criarDoacao(payload, userId = "") {
  const data = {
    instituicao_nome: payload.instituicao_nome || payload.instituicao || payload.nome || "",
    valor: Number(payload.valor),
  };

  if (payload.instituicao_id) data.instituicao_id = payload.instituicao_id;
  if (userId) data.user_id = userId;

  return await supabaseRest("/doacoes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Prefer: "return=representation",
    },
  });
}
