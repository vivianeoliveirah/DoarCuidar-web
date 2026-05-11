import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";

const restBaseUrl = `${env.supabaseUrl}/rest/v1`;
const authBaseUrl = `${env.supabaseUrl}/auth/v1`;

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: env.supabaseServiceRoleKey,
    Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError("Resposta invalida do Supabase.", 502);
  }
}

async function requestSupabase(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: getSupabaseHeaders(options.headers),
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new HttpError(
      data?.message || data?.msg || data?.error_description || data?.hint || "Erro ao consultar Supabase.",
      response.status,
      data || {}
    );
  }

  return data;
}

export async function supabaseRest(path, options = {}) {
  return await requestSupabase(`${restBaseUrl}${path}`, options);
}

export async function supabaseAuth(path, options = {}) {
  return await requestSupabase(`${authBaseUrl}${path}`, options);
}
