// src/services/instituicoesService.js
const API_URL = "http://localhost:10000/api/instituicoes"; // porta do Flask backend

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
