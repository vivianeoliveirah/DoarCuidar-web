import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../services/api";
import {
  AUTH_ERROR_MESSAGES,
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
  getAuthErrorFeedback,
  loginUser,
  registerUser,
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
      new ApiError("Credenciais inválidas", "HTTP", 401),
      "login"
    );

    expect(feedback).toEqual({
      type: "error",
      title: "Não foi possível entrar",
      message: AUTH_ERROR_MESSAGES.invalidLogin,
    });
  });

  it("trata recuperação de senha indisponível como aviso do protótipo", () => {
    const feedback = getAuthErrorFeedback(
      new ApiError(PASSWORD_RESET_UNAVAILABLE_MESSAGE, "UNAVAILABLE", 501),
      "password-reset"
    );

    expect(feedback).toEqual({
      type: "warning",
      title: PASSWORD_RESET_UNAVAILABLE_MESSAGE,
      message: AUTH_ERROR_MESSAGES.unavailable,
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
  it("chama login na rota real /api/auth/login", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ user: { email: "teste@doarcuidar.com" }, token: "token" })
    );

    await expect(
      loginUser({ email: " TESTE@DoarCuidar.com ", password: "senha" })
    ).resolves.toMatchObject({ token: "token" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "teste@doarcuidar.com", password: "senha" }),
      })
    );
  });

  it("normaliza aliases usuario/senha antes de chamar o backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ user: { email: "alias@doarcuidar.com" }, token: "token" })
    );

    await expect(
      loginUser({ usuario: " Alias@DoarCuidar.com ", senha: "segredo" })
    ).resolves.toMatchObject({ token: "token" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend-doarcuidar.onrender.com/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "alias@doarcuidar.com", password: "segredo" }),
      })
    );
  });

  it("bloqueia login sem senha antes de enviar payload incompleto", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(loginUser({ email: "teste@doarcuidar.com" })).rejects.toMatchObject({
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
});
