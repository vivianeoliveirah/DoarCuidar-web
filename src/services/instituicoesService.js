import { supabase } from "./supabase";

export async function criarInstituicao(dados) {
  const { data, error } = await supabase
    .from("instituicoes")
    .insert([dados])
    .select();

  if (error) {
    console.error("Erro ao criar instituição:", error);
    throw error;
  }

  return data;
}

export async function listarInstituicoes() {
  const { data, error } = await supabase
    .from("instituicoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar instituições:", error);
    return [];
  }

  return data;
}