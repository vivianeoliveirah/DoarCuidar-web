// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Reutilizando sua lógica de busca
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const response = await fetch(`${BASE_URL}/api/instituicoes?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao buscar instituições");
    return response.json();
  },

  async getInstituicaoById(id) {
    const response = await fetch(`${BASE_URL}/api/instituicoes/${id}`);
    if (!response.ok) throw new Error("Instituição não encontrada");
    return response.json();
  },

  // NOVO: Cadastro de Instituição (Refatorado do seu form antigo)
  async cadastrarInstituicao(dados) {
    const response = await fetch(`${BASE_URL}/api/instituicoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao cadastrar instituição");
    return response.json();
  },

  // NOVO: Cadastro de Usuário
  async criarUsuario(dados) {
    const response = await fetch(`${BASE_URL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar usuário");
    return response.json();
  },

  // Criar uma nova doação
  async postDoacao(dadosDoacao) {
    const response = await fetch(`${BASE_URL}/api/doacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosDoacao),
    });
    if (!response.ok) throw new Error("Erro ao processar doação");
    return response.json();
  }
};