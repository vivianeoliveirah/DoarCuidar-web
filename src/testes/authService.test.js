import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../services/api";
import {
  AUTH_ERROR_MESSAGES,
  getAuthErrorFeedback,
  loginUser,
  registerUser,
  requestPasswordReset,
} from "../services/authService";

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem: vi.fn((key) => store.get(key) || null),
    removeItem: vi.fn((key) => store.delete(key)),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
  };
}

beforeEach(() => {
  vi.stubGlobal("localStorage", createLocalStorageMock());
  vi.stubGlobal("window", { dispatchEvent: vi.fn() });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("feedback de autenticação", () => {
  it("mostra mensagem amigável para login inválido", () => {
    const feedback = getAuthErrorFeedback(
      new ApiError("Credenciais inválidas do backend", "HTTP", 401),
      "login"
    );

    expect(feedback).toEqual({
      type: "error",
      title: "Não foi possível entrar",
      message: "Credenciais inválidas do backend",
    });
  });

  it("trata erro de servidor sem quebrar a tela", () => {
    const feedback = getAuthErrorFeedback(
      new ApiError("Erro HTTP 500", "HTTP", 500)
    );

    expect(feedback).toEqual({
      type: "error",
      title: "Sistema indisponível",
      message: AUTH_ERROR_MESSAGES.server,
    });
  });

  it("nao mostra autenticação indisponível quando a API estiver temporariamente inacessível", () => {
    const feedback = getAuthErrorFeedback(
      new ApiError("API não configurada.", "UNAVAILABLE"),
      "password-reset"
    );

    expect(feedback).toEqual({
      type: "warning",
      title: "Não conseguimos enviar as instruções",
      message: AUTH_ERROR_MESSAGES.unavailable,
    });
    expect(feedback.message).not.toContain("Autenticação indisponível");
  });

  it("chama login na rota real /api/auth/login", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        access_token: "access-token",
        refresh_token: "refresh-token",
        user: {
          id: "user-id",
          email: "teste@teste.com",
        },
      })
    );

    await expect(
      loginUser({ email: " teste@teste.com ", password: "12345678" })
    ).resolves.toMatchObject({
      access_token: "access-token",
      refresh_token: "refresh-token",
      user: { email: "teste@teste.com" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email: "teste@teste.com", password: "12345678" }),
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({
      email: "teste@teste.com",
      password: "12345678",
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("access_token", "access-token");
    expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token", "refresh-token");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ id: "user-id", email: "teste@teste.com" })
    );
  });

  it("bloqueia login sem password antes de enviar payload incompleto", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(loginUser({ email: "teste@doarcuidar.com" })).rejects.toMatchObject({
      name: "ApiError",
      type: "INVALID_INPUT",
      statusCode: 400,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("nao aceita usuario/senha no contrato novo de login", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(
      loginUser({ usuario: "teste@teste.com", senha: "12345678" })
    ).rejects.toMatchObject({
      name: "ApiError",
      type: "INVALID_INPUT",
      statusCode: 400,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("chama cadastro na rota real /api/auth/register com payload canonico", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ user: { email: "novo@doarcuidar.com", nome: "Novo Doador" } }, { status: 201 })
    );

    await expect(
      registerUser({
        nome: " Novo Doador ",
        email: " NOVO@DoarCuidar.com ",
        senha: "segredo123",
        telefone: "11999999999",
      })
    ).resolves.toMatchObject({ user: { email: "novo@doarcuidar.com" } });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          nome: "Novo Doador",
          email: "novo@doarcuidar.com",
          password: "segredo123",
          role: "user",
          telefone: "11999999999",
          endereco: "",
          cep: "",
          cidade: "",
          uf: "",
        }),
      })
    );
  });

  it("normaliza aliases no cadastro antes de chamar o backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ user: { email: "alias@doarcuidar.com", nome: "Alias Doador" } }, { status: 201 })
    );

    await expect(
      registerUser({
        username: " Alias Doador ",
        usuario: " Alias@DoarCuidar.com ",
        senha: "segredo123",
      })
    ).resolves.toMatchObject({ user: { email: "alias@doarcuidar.com" } });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          nome: "Alias Doador",
          email: "alias@doarcuidar.com",
          password: "segredo123",
          role: "user",
          telefone: "",
          endereco: "",
          cep: "",
          cidade: "",
          uf: "",
        }),
      })
    );
  });

  it("chama recuperacao de senha na rota real /api/auth/password-reset", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ ok: true })
    );

    await expect(
      requestPasswordReset({ email: " RESET@DoarCuidar.com " })
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/password-reset",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({ email: "reset@doarcuidar.com" }),
      })
    );
  });

  it("normaliza alias usuario na recuperacao de senha", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ ok: true })
    );

    await expect(
      requestPasswordReset({ usuario: " Alias@DoarCuidar.com " })
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/password-reset",
      expect.objectContaining({
        body: JSON.stringify({ email: "alias@doarcuidar.com" }),
      })
    );
  });
});
