import { describe, expect, it } from "vitest";

import { ApiError } from "../services/api";
import {
  AUTH_ERROR_MESSAGES,
  PASSWORD_RESET_UNAVAILABLE_MESSAGE,
  getAuthErrorFeedback,
} from "../services/authService";

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
});
