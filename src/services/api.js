import { requestJson } from "./apiCore";
import { API_BASE_URL } from "./config";

const API_ENDPOINTS = {
  instituicoes: "/api/instituicoes",
  doacoes: "/api/doacoes",
  dashboard: "/api/dashboard",
  personalDashboard: "/api/dashboard/me",
  perfil: "/api/perfil",
  analyticsOsc: "/api/analytics/osc",
};

function buildInstituicoesPath(query = "", uf = "") {
  const params = new URLSearchParams();
  const normalizedQuery = String(query || "").trim();

  if (normalizedQuery) params.set("nome", normalizedQuery);
  if (uf) params.set("uf", String(uf).toUpperCase());

  const search = params.toString();
  return `${API_ENDPOINTS.instituicoes}${search ? `?${search}` : ""}`;
}

function backendRequest(path, options = {}) {
  return requestJson(API_BASE_URL, path, options);
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
    return await backendRequest(`${API_ENDPOINTS.instituicoes}/${id}`, {
      timeout: 12000,
    });
  },

  async cadastrarInstituicao(data) {
    return await backendRequest(API_ENDPOINTS.instituicoes, {
      method: "POST",
      body: data,
    });
  },

  async atualizarStatus(id, status) {
    return await backendRequest(`${API_ENDPOINTS.instituicoes}/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  async deletarInstituicao(id) {
    return await backendRequest(`${API_ENDPOINTS.instituicoes}/${id}`, {
      method: "DELETE",
    });
  },

  async postDoacao(data) {
    return await backendRequest(API_ENDPOINTS.doacoes, {
      method: "POST",
      body: data,
    });
  },

  async getDoacoes() {
    try {
      return await backendRequest(API_ENDPOINTS.doacoes);
    } catch (error) {
      if (isUnsupportedRead(error)) return [];
      throw error;
    }
  },

  async getDashboard() {
    return await backendRequest(API_ENDPOINTS.dashboard, {
      timeout: 12000,
    });
  },

  async getPersonalDashboard() {
    return await backendRequest(API_ENDPOINTS.personalDashboard, {
      timeout: 12000,
    });
  },

  async getOscResumo() {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/resumo`);
  },

  async getOscEstados() {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/estados`);
  },

  async getOscAtividades(limit = 10) {
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/atividades?limit=${safeLimit}`);
  },

  async getOscNaturezas() {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/naturezas`);
  },

  async getOscClusters() {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/clusters`);
  },

  async getOscCluster(clusterId) {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/clusters/${clusterId}`);
  },

  async getOscModelo() {
    return await backendRequest(`${API_ENDPOINTS.analyticsOsc}/modelo`);
  },

  async getOscAnalytics() {
    const [resumo, estados, atividades, naturezas, clusters, modelo] = await Promise.all([
      api.getOscResumo(),
      api.getOscEstados(),
      api.getOscAtividades(10),
      api.getOscNaturezas(),
      api.getOscClusters(),
      api.getOscModelo(),
    ]);

    return { resumo, estados, atividades, naturezas, clusters, modelo };
  },

  async getPerfil() {
    try {
      return await backendRequest(API_ENDPOINTS.perfil);
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
