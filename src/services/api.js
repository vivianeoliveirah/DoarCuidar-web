const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-doarcuidar.onrender.com";

export const api = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const res = await fetch(`${BASE_URL}/api/instituicoes?${params.toString()}`);

    if (!res.ok) throw new Error("Erro ao buscar instituições");

    return res.json();
  },

  async getInstituicaoById(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`);

    if (!res.ok) throw new Error("Instituição não encontrada");

    return res.json();
  },

  async cadastrarInstituicao(data) {
    const res = await fetch(`${BASE_URL}/api/instituicoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao cadastrar");

    return res.json();
  },

  async atualizarStatus(id, status) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Erro ao atualizar");

    return res.json();
  },

  async deletarInstituicao(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar");

    return res.json();
  },

  async criarUsuario(data) {
    const res = await fetch(`${BASE_URL}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao criar usuário");

    return res.json();
  },

  async postDoacao(data) {
    const res = await fetch(`${BASE_URL}/api/doacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao doar");

    return res.json();
  },
};