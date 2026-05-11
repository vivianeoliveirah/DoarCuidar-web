import { requestJson } from "./apiCore";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api";

function buildInstituicoesPath(query = "", uf = "") {
  const params = new URLSearchParams();
  const normalizedQuery = String(query || "").trim();

  if (normalizedQuery) params.set("nome", normalizedQuery);
  if (uf) params.set("uf", String(uf).toUpperCase());

  const search = params.toString();
  return `/instituicoes${search ? `?${search}` : ""}`;
}

function backendRequest(path, options = {}) {
  return requestJson(BACKEND_URL, `${API_PREFIX}${path}`, options);
}

function isUnsupportedRead(error) {
  return error?.statusCode === 404 || error?.statusCode === 405;
}

export const api = {
  async getInstituicoes(query = "", uf = "") {
    return await backendRequest(buildInstituicoesPath(query, uf), {
      timeout: 12000,
    });
  },

  async getInstituicaoById(id) {
    return await backendRequest(`/instituicoes/${id}`, {
      timeout: 12000,
    });
  },

  async cadastrarInstituicao(data) {
    return await backendRequest("/instituicoes", {
      method: "POST",
      body: data,
    });
  },

  async atualizarStatus(id, status) {
    return await backendRequest(`/instituicoes/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  async deletarInstituicao(id) {
    return await backendRequest(`/instituicoes/${id}`, {
      method: "DELETE",
    });
  },

  async postDoacao(data) {
    return await backendRequest("/doacoes", {
      method: "POST",
      body: data,
    });
  },

  async getDoacoes() {
    try {
      return await backendRequest("/doacoes");
    } catch (error) {
      if (isUnsupportedRead(error)) return [];
      throw error;
    }
  },

  async getPerfil() {
    try {
      return await backendRequest("/perfil");
    } catch (error) {
      if (error?.statusCode === 401 || isUnsupportedRead(error)) {
        return { user: null, doacoes: [] };
      }
      throw error;
    }
  },
};

export const apiMode = "backend";

export {
  ApiError,
  ExternalApiError,
  clearApiCache,
  createExternalFetchOptions,
  createFetchOptions,
  getErrorMessage,
  handleResponse,
} from "./apiCore";
