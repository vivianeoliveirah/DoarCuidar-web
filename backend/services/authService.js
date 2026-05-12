import { supabaseAuth } from "./supabaseRest.js";
import { HttpError } from "../lib/httpError.js";

const MIN_PASSWORD_LENGTH = 6;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isObjectPayload(payload) {
  return payload && typeof payload === "object" && !Array.isArray(payload);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLoginPayload(payload = {}) {
  if (!isObjectPayload(payload)) {
    throw new HttpError("Body JSON invalido para login.", 400, {
      expected: "object",
      required: ["email", "password"],
    });
  }

  const email = normalizeEmail(payload.email || payload.usuario || payload.login);
  const password = String(payload.password || payload.senha || "");

  if (!email || !password) {
    throw new HttpError("Informe e-mail e senha para entrar.", 400, {
      required: ["email", "password"],
      acceptedAliases: {
        email: ["email", "usuario", "login"],
        password: ["password", "senha"],
      },
    });
  }

  if (!isValidEmail(email)) {
    throw new HttpError("Informe um e-mail valido para entrar.", 400, {
      field: "email",
      acceptedAliases: ["email", "usuario", "login"],
    });
  }

  return { email, password };
}

function normalizeRegisterPayload(payload = {}) {
  if (!isObjectPayload(payload)) {
    throw new HttpError("Body JSON invalido para cadastro.", 400, {
      expected: "object",
      required: ["nome", "email", "password"],
    });
  }

  const email = normalizeEmail(payload.email || payload.usuario || payload.login);
  const password = String(payload.password || payload.senha || "");
  const nome = String(payload.nome || payload.username || payload.name || "").trim();

  if (!nome || !email || !password) {
    throw new HttpError("Informe nome, e-mail e senha para criar a conta.", 400, {
      required: ["nome", "email", "password"],
      acceptedAliases: {
        nome: ["nome", "username", "name"],
        email: ["email", "usuario", "login"],
        password: ["password", "senha"],
      },
    });
  }

  if (!isValidEmail(email)) {
    throw new HttpError("Informe um e-mail valido para cadastro.", 400, {
      field: "email",
      acceptedAliases: ["email", "usuario", "login"],
    });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(`Use uma senha com pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`, 400, {
      field: "password",
      minLength: MIN_PASSWORD_LENGTH,
      acceptedAliases: ["password", "senha"],
    });
  }

  return {
    email,
    password,
    nome,
    role: payload.role || "user",
    telefone: payload.telefone || "",
    endereco: payload.endereco || "",
    cep: payload.cep || "",
    cidade: payload.cidade || "",
    uf: payload.uf || "",
  };
}

function mapAuthError(error, context) {
  const message = String(error?.message || "").toLowerCase();

  if (context === "login" && error?.statusCode === 400) {
    if (message.includes("invalid") || message.includes("credentials") || message.includes("login")) {
      return new HttpError("E-mail ou senha incorretos.", 401, error.details);
    }
  }

  if (context === "register" && error?.statusCode === 400) {
    if (
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists") ||
      message.includes("duplicate")
    ) {
      return new HttpError("Ja existe uma conta cadastrada com este e-mail.", 409, error.details);
    }
  }

  return error;
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

export async function login(payload = {}) {
  const credentials = normalizeLoginPayload(payload);

  let data;
  try {
    data = await supabaseAuth("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    throw mapAuthError(error, "login");
  }

  return {
    user: normalizeUser(data.user),
    session: data,
    token: data.access_token,
  };
}

export async function registrar(payload) {
  const user = normalizeRegisterPayload(payload);

  let data;
  try {
    data = await supabaseAuth("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          nome: user.nome,
          username: user.nome,
          role: user.role,
          telefone: user.telefone,
          endereco: user.endereco,
          cep: user.cep,
          cidade: user.cidade,
          uf: user.uf,
        },
      }),
    });
  } catch (error) {
    throw mapAuthError(error, "register");
  }

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
