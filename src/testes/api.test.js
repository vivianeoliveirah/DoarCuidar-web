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
      "https://backend-doarcuidar.onrender.com/api/instituicoes?nome=amigos&uf=SP",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
  });
});
