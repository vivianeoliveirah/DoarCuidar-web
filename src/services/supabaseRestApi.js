import { ApiError, requestJson } from "./apiCore";
import { backendApi } from "./backendApi";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "";
const SUPABASE_REST_URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : "";

function requireSupabaseConfig() {
  if (!SUPABASE_REST_URL || !SUPABASE_KEY) {
    throw new ApiError(
      "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_KEY.",
      "UNAVAILABLE"
    );
  }
}

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function normalizeSearch(value) {
  return String(value || "").trim();
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildInstituicoesPath(query = "", uf = "") {
  const params = new URLSearchParams();
  const search = normalizeSearch(query);
  const cnpj = onlyDigits(search);

  params.set("select", "*");
  params.set("order", "created_at.desc");

  if (uf) params.set("uf", `eq.${String(uf).toUpperCase()}`);

  if (search) {
    const escapedSearch = search.replace(/[(),]/g, " ");
    const filters = [
      `nome.ilike.*${escapedSearch}*`,
      `descricao.ilike.*${escapedSearch}*`,
      `cnpj.ilike.*${cnpj || escapedSearch}*`,
    ];
    params.set("or", `(${filters.join(",")})`);
  }

  return `/instituicoes?${params.toString()}`;
}

function supabaseRequest(path, options = {}) {
  requireSupabaseConfig();
  return requestJson(SUPABASE_REST_URL, path, {
    ...options,
    headers: getSupabaseHeaders(options.headers),
  });
}

export const supabaseRestApi = {
  async getInstituicoes(query = "", uf = "") {
    return await supabaseRequest(buildInstituicoesPath(query, uf), {
      timeout: 10000,
    });
  },

  async getInstituicaoById(id) {
    const params = new URLSearchParams({
      id: `eq.${id}`,
      select: "*",
      limit: "1",
    });
    const response = await supabaseRequest(`/instituicoes?${params.toString()}`, {
      timeout: 10000,
    });

    return Array.isArray(response) ? response[0] || null : response;
  },

  async cadastrarInstituicao(data) {
    return await supabaseRequest("/instituicoes", {
      method: "POST",
      body: data,
      headers: {
        Prefer: "return=representation",
      },
    });
  },

  async atualizarStatus(id, status) {
    return await supabaseRequest(`/instituicoes?id=eq.${id}`, {
      method: "PATCH",
      body: { status },
      headers: {
        Prefer: "return=representation",
      },
    });
  },

  async deletarInstituicao(id) {
    return await supabaseRequest(`/instituicoes?id=eq.${id}`, {
      method: "DELETE",
    });
  },

  async postDoacao(data) {
    return await backendApi.postDoacao(data);
  },

  async getDoacoes() {
    return await backendApi.getDoacoes();
  },

  async getPerfil() {
    return await backendApi.getPerfil();
  },
};
