import { supabaseRest } from "./supabaseRest.js";

function normalizeSearch(value) {
  return String(value || "").trim();
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildInstituicoesPath({ nome = "", q = "", uf = "" } = {}) {
  const params = new URLSearchParams();
  const search = normalizeSearch(nome || q);
  const cnpj = onlyDigits(search);

  params.set("select", "*");
  params.set("order", "created_at.desc");

  if (uf) params.set("uf", `eq.${String(uf).toUpperCase()}`);

  if (search) {
    const sanitized = search.replace(/[%,()]/g, " ");
    const filters = [
      `nome.ilike.%${sanitized}%`,
      `descricao.ilike.%${sanitized}%`,
      `cnpj.ilike.%${cnpj || sanitized}%`,
    ];
    params.set("or", `(${filters.join(",")})`);
  }

  return `/instituicoes?${params.toString()}`;
}

export async function listarInstituicoes(filters = {}) {
  return await supabaseRest(buildInstituicoesPath(filters));
}

export async function buscarInstituicaoPorId(id) {
  const params = new URLSearchParams({
    id: `eq.${id}`,
    select: "*",
    limit: "1",
  });
  const data = await supabaseRest(`/instituicoes?${params.toString()}`);
  return Array.isArray(data) ? data[0] || null : data;
}

export async function criarInstituicao(payload) {
  return await supabaseRest("/instituicoes", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      uf: payload.uf ? String(payload.uf).toUpperCase() : payload.uf,
    }),
    headers: {
      Prefer: "return=representation",
    },
  });
}

export async function atualizarStatusInstituicao(id, status) {
  return await supabaseRest(`/instituicoes?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: {
      Prefer: "return=representation",
    },
  });
}

export async function deletarInstituicao(id) {
  return await supabaseRest(`/instituicoes?id=eq.${id}`, {
    method: "DELETE",
  });
}
