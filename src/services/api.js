const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";
const BACKEND_TIMEOUT_MS = 45000;
const EXTERNAL_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 1000 * 60 * 3;
const requestCache = new Map();
const pendingRequests = new Map();

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
  const timeoutId = setTimeout(() => controller.abort(), EXTERNAL_TIMEOUT_MS);
  return { controller, timeoutId };
}

/**
 * Retorna mensagem amigável baseada no tipo de erro
 */
function getErrorMessage(error) {
  if (!error) {
    return "Erro desconhecido. Tente novamente.";
  }

  if (error.name === "ExternalApiError") {
    const messages = {
      TIMEOUT: "Serviço temporariamente indisponível. Tente novamente.",
      NETWORK: "Erro de conexão. Verifique sua internet.",
      INVALID_INPUT: error.message,
      METHOD_NOT_ALLOWED: "Não foi possível consultar o CNPJ no momento.",
      UNAVAILABLE: "Não foi possível consultar o CNPJ no momento.",
      NOT_FOUND: "Dados não encontrados",
      PARSE: "Resposta inválida do serviço",
    };
    return messages[error.type] || "Erro no serviço externo";
  }

  if (error instanceof ApiError) {
    if (error.type === "UNAVAILABLE") {
      return error.message;
    }

    if (error.statusCode >= 500) {
      return "Servidor indisponível. Tente novamente em breve.";
    }

    if (error.statusCode === 401 || error.statusCode === 403) {
      return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
    }

    if (error.statusCode === 404) {
      return "Serviço não encontrado no momento. Tente novamente mais tarde.";
    }

    if (error.statusCode === 405) {
      return "Esta ação não está disponível no momento.";
    }

    if (error.statusCode === 400) {
      return "Não foi possível processar os dados enviados. Confira as informações e tente novamente.";
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
  const user = getStoredAuthUser();
  const token = getStoredAuthToken(user);
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (user?.id || user?.user?.id) {
    headers["user-id"] = user.id || user.user.id;
  }

  return headers;
}

function getStoredAuthUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

function getStoredAuthToken(user = getStoredAuthUser()) {
  return (
    localStorage.getItem("token") ||
    user?.token ||
    user?.accessToken ||
    user?.jwt ||
    user?.data?.token ||
    null
  );
}

function getUserCacheKey() {
  const user = getStoredAuthUser();
  return user?.id || user?.user?.id || "public";
}

function createCacheKey(path) {
  return `${getUserCacheKey()}:${path}`;
}

function getCachedValue(cacheKey) {
  const cached = requestCache.get(cacheKey);

  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    requestCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function clearApiCache(pattern = "") {
  for (const key of requestCache.keys()) {
    if (!pattern || key.includes(pattern)) {
      requestCache.delete(key);
    }
  }
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
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let text;

  try {
    text = await res.text();
  } catch {
    throw new ApiError("Erro ao ler resposta do servidor", "NETWORK");
  }

  if (!text) {
    if (res.ok) return null;
    throw new ApiError(`Erro HTTP ${res.status}`, "HTTP", res.status);
  }

  if (!isJson) {
    if (!res.ok) {
      throw new ApiError(`Erro HTTP ${res.status}`, "HTTP", res.status);
    }

    throw new ApiError("Resposta inválida do servidor", "PARSE");
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError("Resposta inválida do servidor", "PARSE");
  }

  if (!res.ok) {
    throw new ApiError(
      data.error || data.message || `Erro HTTP ${res.status}`,
      "HTTP",
      res.status
    );
  }

  if (data.success === false) {
    throw new ApiError(data.error || data.message || "Erro na requisição", "HTTP", 400);
  }

  return data;
}

function normalizeData(data) {
  return data?.data !== undefined ? data.data : data;
}

async function request(path, { method = "GET", body = null, cache = true } = {}) {
  const isGet = method.toUpperCase() === "GET";
  const cacheKey = createCacheKey(path);

  if (isGet && cache) {
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    const pending = pendingRequests.get(cacheKey);
    if (pending) return pending;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);
  const promise = (async () => {
    const { options } = createFetchOptions(method, body, controller.signal);
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = normalizeData(await handleResponse(res));

    if (isGet && cache) {
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    } else if (!isGet) {
      clearApiCache();
    }

    return data;
  })();

  if (isGet && cache) {
    pendingRequests.set(cacheKey, promise);
  }

  try {
    return await promise;
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
    pendingRequests.delete(cacheKey);
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
  clearApiCache,
  getErrorMessage,
  createFetchOptions,
  handleResponse,
  createExternalFetchOptions,
};
