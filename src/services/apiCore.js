const DEFAULT_TIMEOUT_MS = 15000;
const EXTERNAL_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 1000 * 60 * 3;
const requestCache = new Map();
const pendingRequests = new Map();

class ApiError extends Error {
  constructor(message, type = "UNKNOWN", statusCode = null, details = {}) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ExternalApiError extends Error {
  constructor(message, type = "UNKNOWN") {
    super(message);
    this.name = "ExternalApiError";
    this.type = type;
  }
}

function createExternalFetchOptions() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EXTERNAL_TIMEOUT_MS);
  return { controller, timeoutId };
}

function getErrorMessage(error) {
  if (!error) {
    return "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.";
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
    if (error.type === "UNAVAILABLE") return error.message;

    if (error.statusCode >= 500) {
      return "Não conseguimos acessar o sistema no momento. Tente novamente em instantes.";
    }

    if (error.statusCode === 401 || error.statusCode === 403) {
      return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
    }

    if (error.statusCode === 404) {
      return "Serviço não encontrado no momento. Tente novamente mais tarde.";
    }

    if (error.statusCode === 405) {
      return "Esta ação não está disponível no momento. Verifique se o endpoint e o método HTTP estão corretos.";
    }

    if (error.statusCode === 400) {
      return "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.";
    }

    if (error.statusCode >= 400 && error.statusCode < 500) {
      return `Requisição inválida (${error.statusCode}). Verifique os dados enviados.`;
    }

    const messages = {
      TIMEOUT: "Carregando dados. O servidor pode levar alguns segundos para iniciar.",
      NETWORK: "Não foi possível conectar ao sistema. Verifique sua internet e tente novamente.",
      PARSE: "Não conseguimos ler a resposta do sistema. Tente novamente em instantes.",
      HTTP: "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.",
      UNKNOWN: "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.",
    };

    return messages[error.type] || messages.UNKNOWN;
  }

  return "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.";
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
    user?.access_token ||
    user?.jwt ||
    user?.session?.access_token ||
    user?.data?.token ||
    user?.data?.access_token ||
    null
  );
}

function getDefaultHeaders() {
  const user = getStoredAuthUser();
  const token = getStoredAuthToken(user);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (user?.id || user?.user?.id) headers["user-id"] = user.id || user.user.id;

  return headers;
}

function createFetchOptions(method = "GET", body = null, signal, headers = getDefaultHeaders()) {
  return {
    options: {
      method,
      signal,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    },
  };
}

async function handleResponse(res, context = {}) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let text;

  try {
    text = await res.text();
  } catch {
    throw new ApiError("Erro ao ler resposta do servidor", "NETWORK", null, context);
  }

  if (!text) {
    if (res.ok) return null;
    throw new ApiError(`Erro HTTP ${res.status}`, "HTTP", res.status, context);
  }

  if (!isJson) {
    if (!res.ok) throw new ApiError(`Erro HTTP ${res.status}`, "HTTP", res.status, context);
    throw new ApiError("Resposta inválida do servidor", "PARSE", res.status, context);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError("Resposta inválida do servidor", "PARSE", res.status, context);
  }

  if (!res.ok) {
    const detailMessage = Array.isArray(data.detail)
      ? data.detail.map((item) => item?.msg || item?.message || item).join("; ")
      : data.detail;
    const errorDetails = {
      ...context,
      ...(data.details && typeof data.details === "object" ? data.details : {}),
      details: data.details,
      error_code: data.error_code || data.code || data.details?.error_code,
      response: data,
    };

    throw new ApiError(
      data.error || data.message || detailMessage || `Erro HTTP ${res.status}`,
      "HTTP",
      res.status,
      errorDetails
    );
  }

  if (data.success === false) {
    throw new ApiError(data.error || data.message || "Erro na requisição", "HTTP", 400, {
      ...context,
      details: data.details,
      error_code: data.error_code || data.code || data.details?.error_code,
      response: data,
    });
  }

  return data;
}

function normalizeData(data) {
  return data?.data !== undefined ? data.data : data;
}

function getUserCacheKey() {
  const user = getStoredAuthUser();
  return user?.id || user?.user?.id || "public";
}

function createCacheKey(baseUrl, path) {
  return `${getUserCacheKey()}:${baseUrl}:${path}`;
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
    if (!pattern || key.includes(pattern)) requestCache.delete(key);
  }
}

function logApiIssue(error, context = {}) {
  if (!import.meta.env.DEV) return;

  const method = context.method || error?.details?.method || "GET";
  const path = context.path || error?.details?.path || "";
  const status = error?.statusCode ? `HTTP ${error.statusCode}` : error?.type;

  console.warn("[DoarCuidar API]", status, method, path, error?.message);
}

async function requestJson(baseUrl, path, {
  method = "GET",
  body = null,
  cache = true,
  timeout = DEFAULT_TIMEOUT_MS,
  headers,
  normalize = true,
} = {}) {
  if (!baseUrl) {
    throw new ApiError("API não configurada.", "UNAVAILABLE", null, { method, path });
  }

  const isGet = method.toUpperCase() === "GET";
  const cacheKey = createCacheKey(baseUrl, path);

  if (isGet && cache) {
    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    const pending = pendingRequests.get(cacheKey);
    if (pending) return pending;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const promise = (async () => {
    const { options } = createFetchOptions(method, body, controller.signal, headers);
    const res = await fetch(`${baseUrl}${path}`, options);
    const data = await handleResponse(res, { method, path });
    const normalizedData = normalize ? normalizeData(data) : data;

    if (isGet && cache) {
      requestCache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now(),
      });
    } else if (!isGet) {
      clearApiCache();
    }

    return normalizedData;
  })();

  if (isGet && cache) pendingRequests.set(cacheKey, promise);

  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError) {
      logApiIssue(error, { method, path });
      throw error;
    }

    if (error.name === "AbortError") {
      const timeoutError = new ApiError("Requisição expirou", "TIMEOUT", null, { method, path });
      logApiIssue(timeoutError, { method, path });
      throw timeoutError;
    }

    const networkError = new ApiError(
      "Erro de conexão. Verifique sua internet e tente novamente.",
      "NETWORK",
      null,
      { method, path }
    );
    logApiIssue(networkError, { method, path });
    throw networkError;
  } finally {
    clearTimeout(timeoutId);
    pendingRequests.delete(cacheKey);
  }
}

export {
  ApiError,
  DEFAULT_TIMEOUT_MS,
  ExternalApiError,
  clearApiCache,
  createExternalFetchOptions,
  createFetchOptions,
  getDefaultHeaders,
  getErrorMessage,
  handleResponse,
  requestJson,
};
