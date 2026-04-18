import { api } from "./api";

export async function criarInstituicao(dados) {
  return await api.cadastrarInstituicao(dados);
}

export async function listarInstituicoes(query = "", uf = "") {
  return await api.getInstituicoes(query, uf);
}