import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Home from "../pages/Home/Home";
import BuscarInstituicoes from "../pages/Instituicoes/BuscarInstituicoes";
import Login from "../pages/Login/Login";
import Transparencia from "../pages/Transparencia/Transparencia";

function renderPage(ui, route) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

describe("renderização básica das páginas principais", () => {
  it("renderiza a Home com título principal e conteúdo semântico", () => {
    const html = renderPage(<Home />, "/");

    expect(html).toContain("<main");
    expect(html).toContain("<h1");
    expect(html).toContain("Encontre uma");
    expect(html).toContain("conteudo-principal");
  });

  it("apresenta os dados e seus limites sem linguagem de certificação", () => {
    const html = renderPage(<Transparencia />, "/transparencia");

    expect(html).toContain("Transparência e informação");
    expect(html).toContain("Como as informações são apresentadas");
    expect(html).toContain("O que os dados informam — e quais são seus limites");
    expect(html).toContain("não garante sozinho a idoneidade");
    expect(html).not.toContain("Modelo do protótipo");
  });
  it("renderiza o Login com formulário e campos essenciais", () => {
    const html = renderPage(<Login />, "/login");

    expect(html).toContain("<form");
    expect(html).toContain("Entrar no DoarCuidar");
    expect(html).toContain("Seu e-mail");
    expect(html).toContain("Sua senha");
  });

  it("renderiza a busca de instituições com filtros e estado inicial", () => {
    const html = renderPage(<BuscarInstituicoes />, "/instituicoes");

    expect(html).toContain("Buscar instituições");
    expect(html).toContain("Nome ou CNPJ");
    expect(html).toContain("Estado (UF)");
    expect(html).toContain("Atualizar lista");
  });
});
