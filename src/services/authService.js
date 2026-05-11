import { ApiError, clearApiCache, requestJson } from "./apiCore";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api";
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
    "Autenticação indisponível. Verifique a configuração do backend.",
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
    nome: String(data.nome || data.name || "").trim(),
    email: normalizeEmail(data.email),
    password: String(data.password || data.senha || ""),
    role: data.role || "user",
    telefone: data.telefone || "",
    endereco: data.endereco || "",
    cep: data.cep || "",
    cidade: data.cidade || "",
    uf: data.uf || "",
  };
}

function extractToken(data) {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.jwt ||
    data?.session?.access_token ||
    null
  );
}

function persistBackendSession(data) {
  const token = extractToken(data);

  localStorage.setItem("user", JSON.stringify(data));

  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }

  clearApiCache();
  dispatchAuthChange();

  return data;
}

function authRequest(path, body) {
  return requestJson(BACKEND_URL, `${API_PREFIX}${path}`, {
    method: "POST",
    body,
    cache: false,
    timeout: 12000,
  });
}

export function getStoredToken() {
  const storedUser = getStoredUser();
  return (
    localStorage.getItem("token") ||
    storedUser?.token ||
    storedUser?.accessToken ||
    storedUser?.access_token ||
    storedUser?.jwt ||
    storedUser?.session?.access_token ||
    null
  );
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
  const storedUser = getStoredUser();
  return storedUser?.user || storedUser;
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

export async function loginUser({ email, password }) {
  const data = await authRequest("/auth/login", {
    email: normalizeEmail(email),
    password,
  });

  return persistBackendSession(data);
}

export async function registerUser(data) {
  return await authRequest("/auth/register", normalizeRegisterPayload(data));
}

export async function requestPasswordReset(email) {
  const value = typeof email === "object" ? email?.email : email;
  const normalizedEmail = normalizeEmail(value);

  if (!normalizedEmail) {
    throw new ApiError(AUTH_ERROR_MESSAGES.emptyLogin, "INVALID_INPUT", 400);
  }

  throw new ApiError(
    "Recuperação de senha indisponível no backend atual.",
    "UNAVAILABLE",
    501
  );
}

export function getAuthErrorFeedback(error, context = "default") {
  if (context === "login" && (error?.statusCode === 400 || error?.statusCode === 401 || error?.statusCode === 403)) {
    return {
      type: "error",
      title: "Não foi possível entrar",
      message: AUTH_ERROR_MESSAGES.invalidLogin,
    };
  }

  if (error?.type === "UNAVAILABLE" || error?.statusCode === 501) {
    return {
      type: "warning",
      title: context === "password-reset" ? PASSWORD_RESET_UNAVAILABLE_MESSAGE : "Autenticação não configurada",
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
  localStorage.removeItem("token");
  clearApiCache();
  dispatchAuthChange();
}

export {
  AUTH_CHANGE_EVENT,
  AUTH_ERROR_MESSAGES,
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
};
