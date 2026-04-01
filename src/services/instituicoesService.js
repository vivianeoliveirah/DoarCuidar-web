// src/services/instituicoesService.js

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/instituicoes`;

export async function criarInstituicao(dados) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar instituição:", error);
    throw error;
  }
}

export async function listarInstituicoes() {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar instituições:", error);
    return [];
  }
}