const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-doarcuidar.onrender.com";

function getHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const headers = {
    "Content-Type": "application/json",
  };

  if (user?.id || user?.user?.id) {
  headers["user-id"] = user.id || user.user.id;
}

  return headers;
}

async function handleResponse(res) {
  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Resposta inválida:", text);
    throw new Error("Erro inesperado do servidor");
  }

  // erro HTTP ou erro da API
  if (!res.ok || data.success === false) {
    throw new Error(data.error || "Erro na requisição");
  }

  //  retorna só o data (mais limpo)
  return data;
}

export const api = {
  async getInstituicoes(query = "", uf = "") {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (uf) params.append("estado", uf);

    const url = `${BASE_URL}/api/instituicoes${
      params.toString() ? `?${params}` : ""
    }`;

    const res = await fetch(url);
    return handleResponse(res);
  },

  async getInstituicaoById(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`);
    return handleResponse(res);
  },

  async cadastrarInstituicao(data) {
    const res = await fetch(`${BASE_URL}/api/instituicoes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async atualizarStatus(id, status) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    return handleResponse(res);
  },

  async deletarInstituicao(id) {
    const res = await fetch(`${BASE_URL}/api/instituicoes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  async postDoacao(data) {
    const res = await fetch(`${BASE_URL}/api/doacoes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async getPerfil() {
    const res = await fetch(`${BASE_URL}/api/perfil`, {
      headers: getHeaders(),
    });

    return handleResponse(res);
  },
}; 