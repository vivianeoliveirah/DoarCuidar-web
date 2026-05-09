import { ApiError, requestJson } from "./apiCore";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function requireBackendUrl() {
  if (!BACKEND_URL) {
    throw new ApiError(
      "Backend não configurado. Defina VITE_API_URL ou use VITE_API_MODE=supabase.",
      "UNAVAILABLE"
    );
  }

  return BACKEND_URL;
}

function backendRequest(path, options = {}) {
  return requestJson(requireBackendUrl(), path, options);
}

export const backendApi = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const search = params.toString();
    return await backendRequest(`/api/instituicoes${search ? `?${search}` : ""}`, {
      timeout: 12000,
    });
  },

  async getInstituicaoById(id) {
    return await backendRequest(`/api/instituicoes/${id}`);
  },

  async cadastrarInstituicao(data) {
    return await backendRequest("/api/instituicoes", {
      method: "POST",
      body: data,
    });
  },

  async atualizarStatus(id, status) {
    return await backendRequest(`/api/instituicoes/${id}`, {
      method: "PUT",
      body: { status },
    });
  },

  async deletarInstituicao(id) {
    return await backendRequest(`/api/instituicoes/${id}`, {
      method: "DELETE",
    });
  },

  async postDoacao(data) {
    const payload = {
      instituicao_nome: data.instituicao_nome || data.instituicao || data.nome || "",
      valor: Number(data.valor),
    };

    return await backendRequest("/api/doacoes", {
      method: "POST",
      body: payload,
    });
  },

  async getDoacoes() {
    return await backendRequest("/api/doacoes");
  },

  async getPerfil() {
    return await backendRequest("/api/perfil");
  },
};
