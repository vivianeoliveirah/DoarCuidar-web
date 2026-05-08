import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ChartSkeleton from "../components/dashboard/ChartSkeleton";
import FeedbackMessage from "../components/ui/FeedbackMessage";
import InputTexto from "../components/ui/InputTexto";
import Loader from "../components/ui/Loader";
import SelectUF from "../components/ui/SelectUF";

describe("acessibilidade dos componentes base", () => {
  it("associa label e input por id", () => {
    const html = renderToStaticMarkup(
      <InputTexto id="email" label="E-mail" type="email" defaultValue="" />
    );

    expect(html).toContain('<label for="email"');
    expect(html).toContain('<input id="email"');
    expect(html).toContain('type="email"');
  });

  it("associa label e select de UF por id", () => {
    const html = renderToStaticMarkup(
      <SelectUF id="uf" value="" onChange={() => {}} />
    );

    expect(html).toContain('<label for="uf"');
    expect(html).toContain('<select id="uf"');
    expect(html).toContain("<option");
  });

  it("expõe mensagens de erro como alertas acessíveis", () => {
    const html = renderToStaticMarkup(
      <FeedbackMessage
        feedback={{
          type: "error",
          title: "Dados incompletos",
          message: "Preencha seu e-mail e senha para continuar.",
        }}
      />
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Dados incompletos");
  });

  it("expõe carregamentos para tecnologias assistivas", () => {
    const loader = renderToStaticMarkup(<Loader text="Carregando página..." />);
    const skeleton = renderToStaticMarkup(<ChartSkeleton />);

    expect(loader).toContain('role="status"');
    expect(loader).toContain("Carregando página...");
    expect(skeleton).toContain('role="status"');
    expect(skeleton).toContain("Carregando dados do dashboard");
  });
});
