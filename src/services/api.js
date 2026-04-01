const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-doarcuidar.onrender.com";

function getHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return {
    "Content-Type": "application/json",
    "user-id": user?.id || "",
  };
}

export const api = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const res = await fetch(`${BASE_URL}/api/instituicoes?${params}`);
    return res.json();
  },

  async getInstituicaoById(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`);
    return res.json();
  },

  async cadastrarInstituicao(data) {
    const res = await fetch(`${BASE_URL}/api/instituicoes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async atualizarStatus(id, status) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    return res.json();
  },

  async deletarInstituicao(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return res.json();
  },

  async postDoacao(data) {
    const res = await fetch(`${BASE_URL}/api/doacoes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async getPerfil() {
    const res = await fetch(`${BASE_URL}/api/perfil`, {
      headers: getHeaders(),
    });

    return res.json();
  },
};