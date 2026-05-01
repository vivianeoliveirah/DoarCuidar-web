import {
  ApiError,
  clearApiCache,
  createFetchOptions,
  handleResponse,
} from "./api";

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";
const AUTH_CHANGE_EVENT = "doarcuidar-auth-change";
const PASSWORD_RESET_UNAVAILABLE_MESSAGE =
  "Recuperação de senha indisponível no protótipo.";

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

async function authRequest(path, body) {
  try {
    const { options } = createFetchOptions("POST", body);
    const res = await fetch(`${BASE_URL}${path}`, options);
    return await handleResponse(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "TypeError") {
      throw new ApiError(
        "Não foi possível conectar ao servidor. Tente novamente em instantes.",
        "NETWORK"
      );
    }

    throw new ApiError("Erro inesperado na autenticação.", "UNKNOWN");
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRegisterPayload(data) {
  return {
    nome: String(data.nome || data.name || "").trim(),
    email: normalizeEmail(data.email),
    password: String(data.password || ""),
    telefone: String(data.telefone || "").trim(),
    endereco: String(data.endereco || "").trim(),
    cep: String(data.cep || "").trim(),
    cidade: String(data.cidade || "").trim(),
    uf: String(data.uf || "").trim().toUpperCase(),
  };
}

export function getStoredToken() {
  const storedUser = getStoredUser();
  return (
    localStorage.getItem("token") ||
    storedUser?.token ||
    storedUser?.accessToken ||
    storedUser?.jwt ||
    storedUser?.data?.token ||
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
  const data = await authRequest("/api/auth/login", {
    email: normalizeEmail(email),
    password,
  });

  localStorage.setItem("user", JSON.stringify(data));
  const token = data?.token || data?.accessToken || data?.jwt || data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  clearApiCache();
  dispatchAuthChange();

  return data;
}

export async function registerUser(data) {
  return await authRequest("/api/auth/register", normalizeRegisterPayload(data));
}

export async function requestPasswordReset() {
  throw new ApiError(PASSWORD_RESET_UNAVAILABLE_MESSAGE, "UNAVAILABLE", 501);
}

export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  clearApiCache();
  dispatchAuthChange();
}

export { AUTH_CHANGE_EVENT, PASSWORD_RESET_UNAVAILABLE_MESSAGE };
