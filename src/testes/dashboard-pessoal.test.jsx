/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import App from "../App";
import Dashboard from "../pages/Dashboard/Dashboard";
import { api } from "../services/api";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children, data }) => (
    <div data-testid="monthly-chart" data-chart={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

const EMPTY_DASHBOARD = {
  resumo: {
    apoios_registrados: 0,
    instituicoes_apoiadas: 0,
    estados_alcancados: 0,
  },
  ultimos_apoios: [],
  evolucao_mensal: [],
  instituicoes_apoiadas_detalhes: [],
};

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem: vi.fn((key) => store.get(key) || null),
    removeItem: vi.fn((key) => store.delete(key)),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
  };
}

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instituicoes" element={<p>Catálogo de instituições</p>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.stubGlobal("localStorage", createLocalStorageMock());
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Painel pessoal", () => {
  it("redireciona usuário não autenticado para o login", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Entrar no DoarCuidar" })
    ).toBeTruthy();
  });

  it("mantém indicadores zerados e exibe estado vazio para usuário novo", async () => {
    const personalSpy = vi
      .spyOn(api, "getPersonalDashboard")
      .mockResolvedValue(EMPTY_DASHBOARD);
    const globalSpy = vi.spyOn(api, "getDashboard");
    const institutionsSpy = vi.spyOn(api, "getInstituicoes");

    renderDashboard();

    expect(
      await screen.findByText("Nenhum apoio registrado ainda.")
    ).toBeTruthy();
    expect(
      screen.getByText("Quando você registrar um apoio, seu histórico aparecerá aqui.")
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /Encontrar instituições/i }).getAttribute("href")
    ).toBe("/instituicoes");

    const metrics = screen.getAllByRole("article");
    expect(metrics[0].textContent).toContain("Apoios registrados0");
    expect(metrics[1].textContent).toContain("Instituições apoiadas0");
    expect(metrics[2].textContent).toContain("Estados alcançados0");
    expect(personalSpy).toHaveBeenCalledOnce();
    expect(globalSpy).not.toHaveBeenCalled();
    expect(institutionsSpy).not.toHaveBeenCalled();
  });

  it("mostra resumo, histórico, evolução e instituições da resposta pessoal", async () => {
    vi.spyOn(api, "getPersonalDashboard").mockResolvedValue({
      resumo: {
        apoios_registrados: 3,
        instituicoes_apoiadas: 2,
        estados_alcancados: 2,
      },
      ultimos_apoios: [
        {
          id: "apoio-a",
          instituicao_nome: "Instituto Vida",
          uf: "RJ",
          created_at: "2026-02-12T12:00:00Z",
        },
      ],
      evolucao_mensal: [
        { mes: "2026-01", apoios_registrados: 1 },
        { mes: "2026-02", apoios_registrados: 2 },
      ],
      instituicoes_apoiadas_detalhes: [
        { nome: "Casa Esperança", uf: "SP", apoios_registrados: 2 },
        { nome: "Instituto Vida", uf: "RJ", apoios_registrados: 1 },
      ],
    });

    renderDashboard();

    expect(await screen.findAllByText("Instituto Vida")).toHaveLength(2);
    expect(screen.getByText("Casa Esperança")).toBeTruthy();
    expect(
      screen.getByTestId("monthly-chart").getAttribute("data-chart")
    ).toContain('"apoios_registrados":2');
    expect(screen.getByText("3", { selector: "strong" })).toBeTruthy();
    expect(screen.getAllByText("2", { selector: "strong" })).toHaveLength(2);
    expect(screen.queryByText("Instituição Global")).toBeNull();
  });

  it("atualiza novamente somente pelo endpoint pessoal", async () => {
    const personalSpy = vi
      .spyOn(api, "getPersonalDashboard")
      .mockResolvedValue(EMPTY_DASHBOARD);

    renderDashboard();

    await screen.findByText("Nenhum apoio registrado ainda.");
    fireEvent.click(screen.getByRole("button", { name: "Atualizar dados do painel" }));
    await waitFor(() => expect(personalSpy).toHaveBeenCalledTimes(2));
  });
});
