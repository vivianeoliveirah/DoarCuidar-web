import { supabaseAuth } from "./supabaseRest.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    nome: user.user_metadata?.nome || user.user_metadata?.name || user.email,
    role: user.user_metadata?.role || user.app_metadata?.role || "user",
    telefone: user.user_metadata?.telefone,
    endereco: user.user_metadata?.endereco,
    cep: user.user_metadata?.cep,
    cidade: user.user_metadata?.cidade,
    uf: user.user_metadata?.uf,
    desde: user.created_at,
  };
}

export async function login({ email, password }) {
  const data = await supabaseAuth("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({
      email: normalizeEmail(email),
      password,
    }),
  });

  return {
    user: normalizeUser(data.user),
    session: data,
    token: data.access_token,
  };
}

export async function registrar(payload) {
  const data = await supabaseAuth("/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email: normalizeEmail(payload.email),
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        nome: payload.nome || payload.name || "",
        role: payload.role || "user",
        telefone: payload.telefone || "",
        endereco: payload.endereco || "",
        cep: payload.cep || "",
        cidade: payload.cidade || "",
        uf: payload.uf || "",
      },
    }),
  });

  return {
    user: normalizeUser(data),
  };
}

export async function solicitarResetSenha(email) {
  await supabaseAuth("/recover", {
    method: "POST",
    body: JSON.stringify({
      email: normalizeEmail(email),
    }),
  });

  return { ok: true };
}
