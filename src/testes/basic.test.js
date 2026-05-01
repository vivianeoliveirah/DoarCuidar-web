import { describe, it, expect } from "vitest";

describe("Testes básicos DoarCuidar", () => {
  it("deve somar corretamente", () => {
    expect(2 + 2).toBe(4);
  });

  it("string não deve ser vazia", () => {
    const nome = "DoarCuidar";
    expect(nome.length).toBeGreaterThan(0);
  });
});
