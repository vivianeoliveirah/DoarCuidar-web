import { createFetchOptions, handleResponse } from "./api";

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";

/**
 * Realiza login do usuário
 */
export async function loginUser({ email, password }) {
  const { options } = createFetchOptions("POST", { email, password });

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, options);
    const data = await handleResponse(res);

    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Registra novo usuário
 */
export async function registerUser({ email, password }) {
  const { options } = createFetchOptions("POST", { email, password });

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, options);
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Efetua logout do usuário
 */
export function logoutUser() {
  localStorage.removeItem("user");
}
