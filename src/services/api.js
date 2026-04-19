const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";
const TIMEOUT_MS = 8000;

/**
 * Classe customizada para erros da API
 */
class ApiError extends Error {
  constructor(message, type = "UNKNOWN", statusCode = null) {
    super(message);
    this.name = "ApiError";
    this.type = type; // "TIMEOUT" | "NETWORK" | "HTTP" | "PARSE" | "UNKNOWN"
    this.statusCode = statusCode;
  }
}

/**
 * Classe customizada para erros de APIs externas
 */
class ExternalApiError extends Error {
  constructor(message, type = "UNKNOWN") {
    super(message);
    this.name = "ExternalApiError";
    this.type = type;
  }
}

/**
 * Cria options de fetch com timeout para APIs externas
 */
function createExternalFetchOptions() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return { controller, timeoutId };
}

/**
 * Retorna mensagem amigável baseada no tipo de erro
 */
function getErrorMessage(error) {
  if (error.name === "ExternalApiError") {
    const messages = {
      TIMEOUT: "Serviço temporariamente indisponível. Tente novamente.",
      NETWORK: "Erro de conexão. Verifique sua internet.",
      INVALID_INPUT: error.message,
      NOT_FOUND: "Dados não encontrados",
      PARSE: "Resposta inválida do serviço",
    };
    return messages[error.type] || "Erro no serviço externo";
  }

  if (error instanceof ApiError) {
    if (error.statusCode >= 500) {
      return "Servidor indisponível. Tente novamente em breve.";
    }

    if (error.statusCode >= 400 && error.statusCode < 500) {
      return `Requisição inválida (${error.statusCode}). Verifique os dados enviados.`;
    }

    const messages = {
      TIMEOUT: "A requisição demorou muito. Verifique sua conexão de internet.",
      NETWORK: "Erro de conexão. Verifique sua internet e tente novamente.",
      PARSE: "Resposta inválida do servidor. Tente novamente.",
      HTTP: error.statusCode ? `Erro do servidor (${error.statusCode})` : "Erro na requisição",
      UNKNOWN: "Erro desconhecido. Tente novamente.",
    };

    return messages[error.type] || messages.UNKNOWN;
  }

  return "Erro desconhecido";
}

/**
 * Cria headers com autenticação
 */
function getHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const headers = { "Content-Type": "application/json" };

  if (user?.id || user?.user?.id) {
    headers["user-id"] = user.id || user.user.id;
  }

  return headers;
}

/**
 * Cria options de fetch
 */
function createFetchOptions(method = "GET", body = null, signal) {
  return {
    options: {
      method,
      signal,
      headers: getHeaders(),
      ...(body && { body: JSON.stringify(body) }),
    },
  };
}

/**
 * Processa resposta do fetch
 */
async function handleResponse(res) {
  let text;

  try {
    text = await res.text();
  } catch {
    throw new ApiError("Erro ao ler resposta do servidor", "NETWORK");
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Resposta inválida do servidor:", text);
    throw new ApiError("Resposta inválida do servidor", "PARSE");
  }

  if (!res.ok) {
    throw new ApiError(
      data.error || `Erro HTTP ${res.status}`,
      "HTTP",
      res.status
    );
  }

  if (data.success === false) {
    throw new ApiError(data.error || "Erro na requisição", "HTTP", 400);
  }

  return data;
}

function normalizeData(data) {
  return data?.data !== undefined ? data.data : data;
}

async function request(path, { method = "GET", body = null } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const { options } = createFetchOptions(method, body, controller.signal);
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await handleResponse(res);
    return normalizeData(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiError("Requisição expirou", "TIMEOUT");
    }

    throw new ApiError(
      "Erro de conexão. Verifique sua internet e tente novamente.",
      "NETWORK"
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const search = params.toString();
    return await request(`/api/instituicoes${search ? `?${search}` : ""}`);
  },

  async getInstituicaoById(id) {
    return await request(`/api/instituicoes/${id}`);
  },

  async cadastrarInstituicao(data) {
    return await request("/api/instituicoes", {
      method: "POST",
      body: data,
    });
  },

  async atualizarStatus(id, status) {
    return await request(`/api/instituicoes/${id}`, {
      method: "PUT",
      body: { status },
    });
  },

  async deletarInstituicao(id) {
    return await request(`/api/instituicoes/${id}`, {
      method: "DELETE",
    });
  },

  async postDoacao(data) {
    return await request("/api/doacoes", {
      method: "POST",
      body: data,
    });
  },

  async getDoacoes() {
    return await request("/api/doacoes");
  },

  async getPerfil() {
    return await request("/api/perfil");
  },
};

export {
  ApiError,
  ExternalApiError,
  getErrorMessage,
  createFetchOptions,
  handleResponse,
  createExternalFetchOptions,
};
