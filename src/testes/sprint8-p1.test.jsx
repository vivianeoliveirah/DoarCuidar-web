// @vitest-environment jsdom
import React, { useRef, useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import Header from "../components/layout/Header";
import CadastroUsuario from "../pages/Cadastro/CadastroUsuario";
import { ProfileDialog } from "../pages/AnaliseOscs/AnaliseOscs";
import RecuperarSenha from "../pages/Login/RecuperarSenha";
import { RedefinirSenhaForm } from "../pages/Login/RedefinirSenha";
import { registerUser, requestPasswordReset } from "../services/authService";

vi.mock("../services/authService", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    registerUser: vi.fn(),
    requestPasswordReset: vi.fn(),
  };
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  vi.clearAllMocks();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

function renderReset({
  callback = "#access_token=recovery-token&type=recovery&refresh_token=refresh-secret",
  resetPasswordFn = vi.fn().mockResolvedValue({ ok: true }),
  redirectDelay = 0,
} = {}) {
  window.history.replaceState({}, "", "/redefinir-senha" + callback);

  return {
    resetPasswordFn,
    ...render(
      <MemoryRouter initialEntries={["/redefinir-senha"]}>
        <Routes>
          <Route
            path="/redefinir-senha"
            element={
              <RedefinirSenhaForm
                resetPasswordFn={resetPasswordFn}
                redirectDelay={redirectDelay}
              />
            }
          />
          <Route path="/login" element={<p>Login de destino</p>} />
        </Routes>
      </MemoryRouter>
    ),
  };
}

describe("recuperação de senha", () => {
  it("solicita o e-mail normalizado e apresenta loading e sucesso", async () => {
    const user = userEvent.setup();
    let finishRequest;
    vi.mocked(requestPasswordReset).mockReturnValue(
      new Promise((resolve) => {
        finishRequest = resolve;
      })
    );
    render(
      <MemoryRouter>
        <RecuperarSenha />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("E-mail cadastrado"), " PESSOA@EXEMPLO.COM ");
    await user.click(screen.getByRole("button", { name: "Enviar instruções" }));
    expect(screen.getByRole("button", { name: "Enviando..." }).disabled).toBe(true);
    expect(requestPasswordReset).toHaveBeenCalledWith({ email: "pessoa@exemplo.com" });

    await act(async () => finishRequest({}));
    expect(await screen.findByText("Solicitação registrada")).toBeTruthy();
  });

  it("captura o access_token do hash, limpa a URL e não persiste o token", async () => {
    const localStorageSpy = vi.spyOn(Storage.prototype, "setItem");
    const sessionStorageSpy = vi.spyOn(window.sessionStorage, "setItem");
    const { resetPasswordFn } = renderReset({
      callback:
        "?origem=email#access_token=recovery-token&type=recovery&expires_in=3600&refresh_token=refresh-secret",
    });

    expect(await screen.findByLabelText("Nova senha")).toBeTruthy();
    expect(window.location.pathname + window.location.search).toBe(
      "/redefinir-senha?origem=email"
    );
    expect(window.location.hash).toBe("");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nova senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "segredo1");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(resetPasswordFn).toHaveBeenCalledWith({
      password: "segredo1",
      accessToken: "recovery-token",
    });
    expect(localStorageSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("recovery-token")
    );
    expect(sessionStorageSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("recovery-token")
    );
  });

  it("preserva o token em memória durante a verificação dupla do StrictMode", async () => {
    window.history.replaceState(
      {},
      "",
      "/redefinir-senha#access_token=strict-recovery-token&type=recovery"
    );
    const resetPasswordFn = vi.fn().mockResolvedValue({ ok: true });

    render(
      <React.StrictMode>
        <MemoryRouter initialEntries={["/redefinir-senha"]}>
          <RedefinirSenhaForm
            resetPasswordFn={resetPasswordFn}
            redirectDelay={0}
          />
        </MemoryRouter>
      </React.StrictMode>
    );

    expect(await screen.findByLabelText("Nova senha")).toBeTruthy();
    expect(window.location.hash).toBe("");
  });
  it("recusa callback sem token e oferece um novo link", async () => {
    renderReset({ callback: "" });

    expect(await screen.findByText("Link inválido ou expirado")).toBeTruthy();
    expect(screen.queryByLabelText("Nova senha")).toBeNull();
    expect(
      screen.getByRole("link", { name: "Solicitar novo link" }).getAttribute("href")
    ).toBe("/recuperar-senha");
  });

  it("valida a confirmação antes de chamar o backend", async () => {
    const user = userEvent.setup();
    const { resetPasswordFn } = renderReset();

    await user.type(await screen.findByLabelText("Nova senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "segredo2");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(screen.getByText("Senhas diferentes")).toBeTruthy();
    expect(resetPasswordFn).not.toHaveBeenCalled();
  });

  it("trata token inválido ou expirado e permite solicitar outro link", async () => {
    const user = userEvent.setup();
    const resetPasswordFn = vi.fn().mockRejectedValue({ statusCode: 401 });
    renderReset({ resetPasswordFn });

    await user.type(await screen.findByLabelText("Nova senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "segredo1");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(await screen.findByText("Link inválido ou expirado")).toBeTruthy();
    expect(screen.queryByLabelText("Nova senha")).toBeNull();
    expect(screen.getByRole("link", { name: "Solicitar novo link" })).toBeTruthy();
  });

  it("mostra erro do backend e mantém o formulário para nova tentativa", async () => {
    const user = userEvent.setup();
    const resetPasswordFn = vi.fn().mockRejectedValue({ statusCode: 500 });
    renderReset({ resetPasswordFn });

    await user.type(await screen.findByLabelText("Nova senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "segredo1");
    await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

    expect(await screen.findByText("Não foi possível redefinir a senha")).toBeTruthy();
    expect(screen.getByLabelText("Nova senha")).toBeTruthy();
    expect(screen.queryByText("Login de destino")).toBeNull();
  });

  it("envia uma única vez, informa sucesso e redireciona ao login", async () => {
    let finishRequest;
    const resetPasswordFn = vi.fn(
      () =>
        new Promise((resolve) => {
          finishRequest = resolve;
        })
    );
    const { container } = renderReset({ resetPasswordFn, redirectDelay: 0 });
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("Nova senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar nova senha"), "segredo1");
    const form = container.querySelector("form");
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(resetPasswordFn).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Salvando..." }).disabled).toBe(true);

    await act(async () => finishRequest({ ok: true }));
    expect(await screen.findByText("Senha redefinida")).toBeTruthy();
    expect(await screen.findByText("Login de destino")).toBeTruthy();
  });
});

describe("menu móvel", () => {
  function renderHeader() {
    return render(
      <MemoryRouter initialEntries={["/instituicoes"]}>
        <Header />
      </MemoryRouter>
    );
  }

  it("oferece acesso à conta no CTA inferior para visitantes", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Entrar na minha conta" })).toBeTruthy();
    expect(
      screen.getByText("Entre para registrar seus apoios e consultar seu histórico.")
    ).toBeTruthy();
  });
  it("abre com foco no X, fecha pelo X e também fecha com Escape", async () => {
    const user = userEvent.setup();
    renderHeader();
    const opener = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(opener);
    const close = screen.getByRole("button", { name: "Fechar menu" });
    await waitFor(() => expect(document.activeElement).toBe(close));
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(close);
    expect(screen.queryByRole("button", { name: "Fechar menu" })).toBeNull();
    expect(document.activeElement).toBe(opener);

    await user.click(opener);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("button", { name: "Fechar menu" })).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(opener);
  });

  it("fecha pelo backdrop e por um link", async () => {
    const user = userEvent.setup();
    const { container } = renderHeader();
    const opener = screen.getByRole("button", { name: "Abrir menu" });

    await user.click(opener);
    fireEvent.mouseDown(container.querySelector("[role='presentation']"));
    expect(screen.queryByRole("dialog", { name: "Menu mobile" })).toBeNull();

    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Menu mobile" });
    await user.click(dialog.querySelector('a[href="/transparencia"]'));
    expect(screen.queryByRole("dialog", { name: "Menu mobile" })).toBeNull();
  });
});

describe("modal de composição analítica", () => {
  function DialogHarness() {
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(true);
    return (
      <>
        <button ref={triggerRef} type="button">Abrir composição</button>
        <ProfileDialog
          state={{ open, loading: false, error: "Falha de teste", data: null }}
          onClose={() => setOpen(false)}
          onRetry={() => {}}
          returnFocusRef={triggerRef}
        />
      </>
    );
  }

  it("prende o foco, fecha com Escape e devolve foco ao acionador", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    const close = screen.getByRole("button", { name: "Fechar detalhes do perfil" });
    const retry = screen.getByRole("button", { name: "Tentar novamente" });

    expect(document.activeElement).toBe(close);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(retry);
    await user.tab();
    expect(document.activeElement).toBe(close);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir composição" }));
  });
});

describe("cadastro alinhado ao backend", () => {
  it("exibe e envia somente nome, e-mail e senha", async () => {
    const user = userEvent.setup();
    vi.mocked(registerUser).mockResolvedValue({});
    render(
      <MemoryRouter initialEntries={["/cadastro"]}>
        <Routes>
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/login" element={<p>Login de destino</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByLabelText("Telefone")).toBeNull();
    expect(screen.queryByLabelText("CEP")).toBeNull();
    await user.type(screen.getByLabelText("Nome completo"), "Maria Silva");
    await user.type(screen.getByLabelText("E-mail"), "MARIA@EXEMPLO.COM");
    await user.type(screen.getByLabelText("Senha"), "segredo1");
    await user.type(screen.getByLabelText("Confirmar senha"), "segredo1");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        nome: "Maria Silva",
        email: "MARIA@EXEMPLO.COM",
        password: "segredo1",
      });
    });
    expect(await screen.findByText("Login de destino")).toBeTruthy();
  });
});
