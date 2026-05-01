import { describe, expect, it } from "vitest";

import { ApiError, getErrorMessage, handleResponse } from "../services/api";

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

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
      "Servidor indisponível. Tente novamente em breve."
    );
  });
});
