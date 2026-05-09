import { backendApi } from "./backendApi";
import { supabaseRestApi } from "./supabaseRestApi";

const API_MODE = (import.meta.env.VITE_API_MODE || "supabase").toLowerCase();

function selectApiClient() {
  if (API_MODE === "backend") return backendApi;
  if (API_MODE === "supabase") return supabaseRestApi;

  if (import.meta.env.DEV) {
    console.warn(
      `[DoarCuidar API] VITE_API_MODE="${API_MODE}" inválido. Usando modo supabase.`
    );
  }

  return supabaseRestApi;
}

export const api = selectApiClient();
export const apiMode = API_MODE;

export {
  ApiError,
  ExternalApiError,
  clearApiCache,
  createExternalFetchOptions,
  createFetchOptions,
  getErrorMessage,
  handleResponse,
} from "./apiCore";
