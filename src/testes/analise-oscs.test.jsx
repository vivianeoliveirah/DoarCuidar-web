import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AnaliseOscsContent } from "../pages/AnaliseOscs/AnaliseOscs";
import { api, clearApiCache } from "../services/api";

const summary = {
  total_analisado: 618136,
  quantidade_ufs: 27,
  quantidade_municipios: 5292,
  quantidade_atividades_economicas: 388,
  quantidade_naturezas_juridicas: 4,
  numero_clusters: 6,
};

const model = {
  algoritmo: "MiniBatchKMeans",
  numero_clusters: 6,
  seed: 42,
  numero_registros: 618136,
  numero_dimensoes: 69,
  silhouette_score: 0.216405,
  estabilidade_ari: 0.805672,
  limitacoes: ["Perfis estruturais, sem avaliação institucional."],
};

function buildCluster(id) {
  return {
    cluster_id: id,
    quantidade: 100000 + id,
    percentual_total: 16.5,
    descricao: `Perfil estrutural ${id + 1}`,
    atividades_predominantes: [
      { categoria: "Atividade associativa", quantidade: 10, percentual_cluster: 25 },
    ],
    naturezas_juridicas_predominantes: [
      { categoria: "Associação Privada", quantidade: 10, percentual_cluster: 80 },
    ],
    estados_predominantes: [
      { categoria: "SÃO PAULO", quantidade: 10, percentual_cluster: 20 },
    ],
    matriz_filial: [
      { categoria: "Matriz", quantidade: 10, percentual_cluster: 90 },
    ],
  };
}

const clusters = Array.from({ length: 6 }, (_, id) => buildCluster(id));
const analyticsData = {
  resumo: summary,
  estados: [],
  atividades: [],
  naturezas: [],
  clusters,
  modelo: model,
};

function renderContent(props = {}) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/analise-oscs"]}>
      <AnaliseOscsContent {...props} />
    </MemoryRouter>
  );
}

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    removeItem: vi.fn((key) => store.delete(key)),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
  };
}

function jsonResponse(data) {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubGlobal("localStorage", createLocalStorageMock());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  clearApiCache();
});

describe("integração da API analítica", () => {
  it("consome o resumo e todos os agregados pelos endpoints aprovados", async () => {
    const responses = {
      "/resumo": summary,
      "/estados": [],
      "/atividades?limit=10": [],
      "/naturezas": [],
      "/clusters": clusters,
      "/modelo": model,
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      const suffix = Object.keys(responses).find((key) => String(url).endsWith(key));
      return Promise.resolve(jsonResponse(responses[suffix]));
    });

    await expect(api.getOscAnalytics()).resolves.toMatchObject({
      resumo: summary,
      clusters,
      modelo: model,
    });

    expect(fetchMock).toHaveBeenCalledTimes(6);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/api/analytics/osc/resumo"),
        expect.stringContaining("/api/analytics/osc/estados"),
        expect.stringContaining("/api/analytics/osc/atividades?limit=10"),
        expect.stringContaining("/api/analytics/osc/naturezas"),
        expect.stringContaining("/api/analytics/osc/clusters"),
        expect.stringContaining("/api/analytics/osc/modelo"),
      ])
    );
  });

  it("consulta o detalhe de um perfil pelo identificador", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(clusters[2])
    );

    await expect(api.getOscCluster(2)).resolves.toMatchObject({ cluster_id: 2 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/analytics/osc/clusters/2"),
      expect.objectContaining({ method: "GET" })
    );
  });
});

describe("página Análise das OSCs", () => {
  it("renderiza o resumo formatado e os seis perfis retornados", () => {
    const html = renderContent({ data: analyticsData });

    expect(html).toContain("Análise das OSCs");
    expect(html).toContain("618.136");
    expect(html).toContain("5.292");
    expect((html.match(/Ver composição/g) || [])).toHaveLength(6);
  });

  it("renderiza o estado de carregamento", () => {
    const html = renderContent({ loading: true });

    expect(html).toContain("Carregando análise das OSCs");
    expect(html).toContain("aria-busy=\"true\"");
  });

  it("renderiza erro com ação de nova tentativa", () => {
    const html = renderContent({ error: "Falha ao carregar resultados" });

    expect(html).toContain("role=\"alert\"");
    expect(html).toContain("Falha ao carregar resultados");
    expect(html).toContain("Tentar novamente");
  });

  it("renderiza o detalhe completo do perfil selecionado", () => {
    const html = renderContent({
      data: analyticsData,
      profileDetail: {
        open: true,
        loading: false,
        error: "",
        data: clusters[0],
      },
    });

    expect(html).toContain("role=\"dialog\"");
    expect(html).toContain("Principais atividades");
    expect(html).toContain("Principais naturezas jurídicas");
    expect(html).toContain("Matriz e filial");
  });

  it("apresenta o aviso metodológico obrigatório", () => {
    const html = renderContent({ data: analyticsData });

    expect(html).toContain("Aviso metodológico");
    expect(html).toContain("não constituem avaliação de qualidade");
    expect(html).toContain("impacto social ou legitimidade");
  });
});
