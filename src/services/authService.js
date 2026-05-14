import { ApiError, clearApiCache, requestJson } from "./apiCore";
import { API_BASE_URL } from "./config";

const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  passwordReset: "/api/auth/forgot-password",
};
const AUTH_CHANGE_EVENT = "doarcuidar-auth-change";
const PASSWORD_RESET_UNAVAILABLE_MESSAGE =
  "Enviaremos as instruções de recuperação para o e-mail informado.";

const AUTH_ERROR_MESSAGES = {
  emptyLogin: "Preencha seu e-mail e senha para continuar.",
  invalidLogin: "E-mail ou senha incorretos. Verifique os dados e tente novamente.",
  validation:
    "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.",
  server:
    "Não conseguimos acessar o sistema no momento. Tente novamente em instantes.",
  network:
    "Não foi possível conectar ao sistema. Verifique sua internet e tente novamente.",
  unavailable:
    "Não foi possível conectar ao servidor de autenticação. Tente novamente em instantes.",
  fallback:
    "Algo deu errado ao processar sua solicitação. Tente novamente ou verifique suas informações.",
};

function dispatchAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string" || token.split(".").length < 2) {
    return null;
  }

  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRegisterPayload(data) {
  return {
    nome: String(data.nome || data.username || data.name || "").trim(),
    email: normalizeEmail(data.email || data.usuario || data.login),
    password: String(data.password || data.senha || ""),
  };
}

function normalizeLoginPayload(data = {}) {
  const email = normalizeEmail(data.email);
  const password = String(data.password || "");

  if (!email || !password) {
    throw new ApiError(AUTH_ERROR_MESSAGES.emptyLogin, "INVALID_INPUT", 400);
  }

  return { email, password };
}

function extractToken(data) {
  return data?.access_token || data?.data?.access_token || null;
}

function extractRefreshToken(data) {
  return data?.refresh_token || data?.data?.refresh_token || null;
}

function persistBackendSession(data) {
  const token = extractToken(data);
  const refreshToken = extractRefreshToken(data);
  const user = data?.user || data?.data?.user || null;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }

  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  } else {
    localStorage.removeItem("refresh_token");
  }

  clearApiCache();
  dispatchAuthChange();

  return data;
}

function authRequest(path, body) {
  return requestJson(API_BASE_URL, path, {
    method: "POST",
    body,
    cache: false,
    normalize: false,
    timeout: 12000,
  });
}

export function getStoredToken() {
  return localStorage.getItem("access_token") || null;
}

export function getStoredUser() {
  const stored = localStorage.getItem("user");

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function getSessionUser() {
  return getStoredUser();
}

export function isAdminUser(user = getSessionUser()) {
  if (!user) {
    return false;
  }

  const tokenPayload = decodeJwtPayload(getStoredToken());
  const role =
    user.role ||
    user.tipo ||
    user.perfil ||
    tokenPayload?.role ||
    tokenPayload?.tipo ||
    tokenPayload?.perfil;

  return role === "admin" || user.is_admin === true || tokenPayload?.is_admin === true;
}

export async function loginUser(credentials) {
  const data = await authRequest(AUTH_ENDPOINTS.login, normalizeLoginPayload(credentials));

  return persistBackendSession(data);
}

export function logAuthError(error, context = "auth") {
  console.error("[DoarCuidar Auth]", {
    context,
    status: error?.statusCode ?? null,
    message: error?.message ?? null,
    error_code: error?.details?.error_code ?? error?.details?.code ?? null,
    details: error?.details ?? null,
  });
}

export async function registerUser(data) {
  return await authRequest(AUTH_ENDPOINTS.register, normalizeRegisterPayload(data));
}

export async function requestPasswordReset(email) {
  const value =
    typeof email === "object"
      ? email?.email || email?.usuario || email?.login
      : email;
  const normalizedEmail = normalizeEmail(value);

  if (!normalizedEmail) {
    throw new ApiError(AUTH_ERROR_MESSAGES.emptyLogin, "INVALID_INPUT", 400);
  }

  return await authRequest(AUTH_ENDPOINTS.passwordReset, { email: normalizedEmail });
}

export function getAuthErrorFeedback(error, context = "default") {
  if (context === "login" && (error?.statusCode === 400 || error?.statusCode === 401 || error?.statusCode === 403)) {
    return {
      type: "error",
      title: "Não foi possível entrar",
      message: error?.message || AUTH_ERROR_MESSAGES.invalidLogin,
    };
  }

  if (error?.type === "UNAVAILABLE" || error?.statusCode === 501) {
    return {
      type: "warning",
      title:
        context === "password-reset"
          ? "Não conseguimos enviar as instruções"
          : "Não conseguimos conectar ao servidor",
      message: AUTH_ERROR_MESSAGES.unavailable,
    };
  }

  if (error?.statusCode >= 500) {
    return {
      type: "error",
      title: "Sistema indisponível",
      message: AUTH_ERROR_MESSAGES.server,
    };
  }

  if (error?.type === "NETWORK" || error?.type === "TIMEOUT" || error?.type === "PARSE") {
    return {
      type: "warning",
      title: "Não conseguimos concluir a solicitação",
      message: AUTH_ERROR_MESSAGES.network,
    };
  }

  if (error?.statusCode === 400) {
    return {
      type: "warning",
      title: "Revise as informações",
      message: AUTH_ERROR_MESSAGES.validation,
    };
  }

  return {
    type: "error",
    title: "Algo deu errado",
    message: AUTH_ERROR_MESSAGES.fallback,
  };
}

export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  clearApiCache();
  dispatchAuthChange();
}

export {
  AUTH_CHANGE_EVENT,
  AUTH_ERROR_MESSAGES,
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
};
