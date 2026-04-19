import { createFetchOptions, handleResponse } from "./api";

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";
const AUTH_CHANGE_EVENT = "doarcuidar-auth-change";

function dispatchAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
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

  return user.role === "admin" || user.is_admin === true;
}

export async function loginUser({ email, password }) {
  const { options } = createFetchOptions("POST", { email, password });
  const res = await fetch(`${BASE_URL}/api/auth/login`, options);
  const data = await handleResponse(res);

  localStorage.setItem("user", JSON.stringify(data));
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
  dispatchAuthChange();
}

export { AUTH_CHANGE_EVENT };
