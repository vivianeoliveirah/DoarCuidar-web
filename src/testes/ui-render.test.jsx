import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import BuscarInstituicoes from "../pages/Instituicoes/BuscarInstituicoes";

function renderRoute(ui, initialEntry = "/") {
  return renderToString(
    <MemoryRouter initialEntries={[initialEntry]}>
      {ui}
    </MemoryRouter>
  );
}

describe("renderizacao acessivel das telas principais", () => {
  it("Home renderiza um titulo principal e conteudo principal", () => {
    const html = renderRoute(<Home />);

    expect(html).toContain("id=\"conteudo-principal\"");
    expect(html).toContain("<h1");
    expect(html).toContain("DoarCuidar");
  });

  it("Login renderiza campos rotulados e acao principal", () => {
    const html = renderRoute(<Login />, "/login");

    expect(html).toContain("Entrar no DoarCuidar");
    expect(html).toContain("Seu e-mail");
    expect(html).toContain("Sua senha");
    expect(html).toContain("type=\"email\"");
    expect(html).toContain("type=\"password\"");
  });

  it("Dashboard renderiza fallback demonstrativo sem depender da API", () => {
    const html = renderRoute(<Dashboard />, "/dashboard");

    expect(html).toContain("Dashboard DoarCuidar");
    expect(html).toContain("Instituicoes disponiveis");
    expect(html).toContain("Apoios registrados");
  });

  it("Instituicoes renderiza busca e estado inicial de resultados", () => {
    const html = renderRoute(<BuscarInstituicoes />, "/instituicoes");

    expect(html).toContain("Buscar institui");
    expect(html).toContain("name=\"q\"");
  });
});
