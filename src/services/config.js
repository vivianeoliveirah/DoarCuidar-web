const DEFAULT_API_URL = "https://backend-doarcuidar.onrender.com";

function normalizeApiUrl(value) {
  return String(value || "").trim().replace(/\/$/, "");
}

function getEnvApiUrl() {
  return normalizeApiUrl(import.meta.env?.VITE_API_URL);
}

function resolveApiBaseUrl(value = getEnvApiUrl()) {
  return normalizeApiUrl(value) || DEFAULT_API_URL;
}

const API_BASE_URL = resolveApiBaseUrl();

export { API_BASE_URL, DEFAULT_API_URL, getEnvApiUrl, normalizeApiUrl, resolveApiBaseUrl };
