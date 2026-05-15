import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, api, clearApiCache, getErrorMessage, handleResponse } from "../services/api";
import {
  API_BASE_URL,
  DEFAULT_API_URL,
  normalizeApiUrl,
  resolveApiBaseUrl,
} from "../services/config";

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
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  clearApiCache();
});

describe("tratamento de respostas da API", () => {
  it("retorna JSON quando a resposta é válida", async () => {
    await expect(handleResponse(jsonResponse({ data: { ok: true } }))).resolves.toEqual({
      data: { ok: true },
    });
  });

  it("consome respostas JSON com response.json sem usar response.text", async () => {
    const response = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn((header) =>
          header === "content-type" ? "application/json" : null
        ),
      },
      json: vi.fn().mockResolvedValue({
        access_token: "access-token",
        refresh_token: "refresh-token",
        user: { email: "teste@teste.com" },
      }),
      text: vi.fn(),
    };

    await expect(handleResponse(response)).resolves.toEqual({
      access_token: "access-token",
      refresh_token: "refresh-token",
      user: { email: "teste@teste.com" },
    });
    expect(response.json).toHaveBeenCalledOnce();
    expect(response.text).not.toHaveBeenCalled();
  });

  it("usa a mensagem do backend em erro HTTP", async () => {
    await expect(
      handleResponse(jsonResponse({ message: "Dados inválidos" }, { status: 400 }))
    ).rejects.toMatchObject({
      name: "ApiError",
      message: "Dados inválidos",
      statusCode: 400,
    });
  });

  it("não tenta converter HTML em JSON", async () => {
    const response = new Response("<html>Erro</html>", {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });

    await expect(handleResponse(response)).rejects.toMatchObject({
      name: "ApiError",
      type: "HTTP",
      statusCode: 404,
    });
  });

  it("traduz erros conhecidos para mensagens amigáveis", () => {
    const error = new ApiError("Erro HTTP 500", "HTTP", 500);

    expect(getErrorMessage(error)).toBe(
      "Não conseguimos acessar o sistema no momento. Tente novamente em instantes."
    );
  });
  it("usa fallback seguro quando VITE_API_URL nao estiver configurada", () => {
    expect(resolveApiBaseUrl()).toBe(API_BASE_URL);
    expect(resolveApiBaseUrl("")).toBe(DEFAULT_API_URL);
    expect(resolveApiBaseUrl(undefined)).toBe(DEFAULT_API_URL);
    expect(normalizeApiUrl("https://exemplo.com/")).toBe("https://exemplo.com");
    expect(normalizeApiUrl("https://exemplo.com/api")).toBe("https://exemplo.com");
  });

  it("chama instituicoes na rota real /api/instituicoes", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ data: [] })
    );

    await expect(api.getInstituicoes("amigos", "sp")).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://doarcuidar-1.onrender.com/api/instituicoes?nome=amigos&uf=SP",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("envia Authorization Bearer e nao envia user-id legado no POST de apoio", async () => {
    localStorage.setItem("access_token", "access-token");
    localStorage.setItem("user", JSON.stringify({ id: "user-id", email: "teste@teste.com" }));
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          id: "apoio-id",
          user_id: "user-id",
          instituicao_nome: "Casa Teste",
          valor: "50.00",
          created_at: "2026-05-14T12:00:00Z",
        },
      }, { status: 201 })
    );

    await expect(
      api.postDoacao({ instituicao_nome: "Casa Teste", valor: 50 })
    ).resolves.toMatchObject({
      id: "apoio-id",
      user_id: "user-id",
      instituicao_nome: "Casa Teste",
    });

    const [, options] = fetchMock.mock.calls[0];
    expect(fetchMock).toHaveBeenCalledWith(
      "https://doarcuidar-1.onrender.com/api/doacoes",
      expect.objectContaining({ method: "POST" })
    );
    expect(options.headers.Authorization).toBe("Bearer access-token");
    expect(options.headers["user-id"]).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({
      instituicao_nome: "Casa Teste",
      valor: 50,
    });
  });

  it("consulta dashboard publico sem depender de /api/doacoes autenticado", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          doacoes_registradas: 2,
          ultimas_doacoes: [{ id: "1", instituicao_nome: "Casa Teste" }],
        },
      })
    );

    await expect(api.getDashboard()).resolves.toMatchObject({
      doacoes_registradas: 2,
      ultimas_doacoes: [{ id: "1", instituicao_nome: "Casa Teste" }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://doarcuidar-1.onrender.com/api/dashboard",
      expect.objectContaining({ method: "GET" })
    );
  });
});
