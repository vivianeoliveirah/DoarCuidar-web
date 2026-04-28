import { clearApiCache, createFetchOptions, handleResponse } from "./api";

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";
const AUTH_CHANGE_EVENT = "doarcuidar-auth-change";

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
  const { options } = createFetchOptions("POST", { email, password });
  const res = await fetch(`${BASE_URL}/api/auth/login`, options);
  const data = await handleResponse(res);

  localStorage.setItem("user", JSON.stringify(data));
  const token = data?.token || data?.accessToken || data?.jwt || data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  clearApiCache();
  dispatchAuthChange();

  return data;
}

export async function registerUser({ email, password }) {
  const { options } = createFetchOptions("POST", { email, password });
  const res = await fetch(`${BASE_URL}/api/auth/register`, options);
  return await handleResponse(res);
}

export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  clearApiCache();
  dispatchAuthChange();
}

export { AUTH_CHANGE_EVENT };
