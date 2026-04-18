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
  // Trata ExternalApiError (de serviços externos)
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

  // Trata ApiError (do nosso backend)
  if (error instanceof ApiError) {
    if (error.statusCode >= 500) return "Servidor indisponível. Tente novamente em breve.";
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
 * Cria options de fetch com timeout
 */
function createFetchOptions(method = "GET", body = null) {
  return {
    options: {
      method,
      headers: getHeaders(),
      ...(body && { body: JSON.stringify(body) }),
    },
  };
}

/**
 * Processa resposta do fetch com timeout manual
 */
async function handleResponse(res) {
  let text;
  try {
    // Implementa timeout manual
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT")), TIMEOUT_MS);
    });

    const responsePromise = res.text();
    text = await Promise.race([responsePromise, timeoutPromise]);
  } catch (error) {
    if (error.message === "TIMEOUT") {
      throw new ApiError("Requisição expirou", "TIMEOUT", null);
    }
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
    throw new ApiError(
      data.error || "Erro na requisição",
      "HTTP",
      400
    );
  }

  return data;
}

export const api = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const url = `${BASE_URL}/api/instituicoes${
      params.toString() ? `?${params}` : ""
    }`;

    const { options } = createFetchOptions("GET");
    const res = await fetch(url, options);
    return await handleResponse(res);
  },

  async getInstituicaoById(id) {
    const url = `${BASE_URL}/api/instituicoes/${id}`;
    const { options } = createFetchOptions("GET");
    const res = await fetch(url, options);
    return await handleResponse(res);
  },

  async cadastrarInstituicao(data) {
    const url = `${BASE_URL}/api/instituicoes`;
    const { options } = createFetchOptions("POST", data);
    try {
      const res = await fetch(url, options);
      return await handleResponse(res);
    } catch (error) {
      throw error;
    }
  },

  async atualizarStatus(id, status) {
    const url = `${BASE_URL}/api/instituicoes/${id}`;
    const { options } = createFetchOptions("PUT", {
      status,
    });
    try {
      const res = await fetch(url, options);
      return await handleResponse(res);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  async deletarInstituicao(id) {
    const url = `${BASE_URL}/api/instituicoes/${id}`;
    const { options } = createFetchOptions("DELETE");
    try {
      const res = await fetch(url, options);
      return await handleResponse(res);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  async postDoacao(data) {
    const url = `${BASE_URL}/api/doacoes`;
    const { options } = createFetchOptions("POST", data);
    try {
      const res = await fetch(url, options);
      return await handleResponse(res);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  async getPerfil() {
    const url = `${BASE_URL}/api/perfil`;
    const { options } = createFetchOptions("GET");
    try {
      const res = await fetch(url, options);
      return await handleResponse(res);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },
};

// Exporta utilitários para uso em componentes
export { ApiError, ExternalApiError, getErrorMessage, createFetchOptions, handleResponse, createExternalFetchOptions }; 
