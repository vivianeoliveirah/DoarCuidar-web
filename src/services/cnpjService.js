import { ExternalApiError, createExternalFetchOptions } from "./api";

const BRASIL_API_URL = "https://brasilapi.com.br/api/cnpj/v1";
const CNPJ_WS_API_URL = "https://publica.cnpj.ws/cnpj";
const CNPJ_UNAVAILABLE_MESSAGE = "Não foi possível consultar o CNPJ no momento.";

function limparCNPJ(cnpj) {
  return String(cnpj || "").replace(/\D/g, "");
}

function temDigitosRepetidos(cnpj) {
  return /^(\d)\1+$/.test(cnpj);
}

function calcularDigito(cnpj, pesos) {
  const soma = pesos.reduce((total, peso, index) => {
    return total + Number(cnpj[index]) * peso;
  }, 0);
  const resto = soma % 11;

  return resto < 2 ? 0 : 11 - resto;
}

function validarCNPJ(cnpj) {
  if (cnpj.length !== 14 || temDigitosRepetidos(cnpj)) {
    return false;
  }

  const primeiroDigito = calcularDigito(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundoDigito = calcularDigito(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return primeiroDigito === Number(cnpj[12]) && segundoDigito === Number(cnpj[13]);
}

async function buscarCNPJJson(url, signal) {
  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    if (response.status === 404) {
      throw new ExternalApiError("CNPJ não encontrado", "NOT_FOUND");
    }

    if (response.status === 405) {
      throw new ExternalApiError(CNPJ_UNAVAILABLE_MESSAGE, "METHOD_NOT_ALLOWED");
    }

    throw new ExternalApiError(CNPJ_UNAVAILABLE_MESSAGE, "UNAVAILABLE");
  }

  if (!isJson) {
    throw new ExternalApiError(CNPJ_UNAVAILABLE_MESSAGE, "UNAVAILABLE");
  }

  return await response.json();
}

function normalizarBrasilApi(data) {
  return {
    cnpj: data.cnpj,
    nome_fantasia: data.nome_fantasia,
    razao_social: data.razao_social,
    uf: data.uf,
    municipio: data.municipio,
    cnae_fiscal_descricao: data.cnae_fiscal_descricao,
    descricao_porte: data.descricao_porte,
  };
}

function normalizarCnpjWs(data) {
  const estabelecimento = data.estabelecimento || {};
  const cnpj =
    estabelecimento.cnpj ||
    data.cnpj ||
    `${data.cnpj_raiz || ""}${estabelecimento.cnpj_ordem || ""}${estabelecimento.cnpj_digito_verificador || ""}`;

  return {
    cnpj,
    nome_fantasia: estabelecimento.nome_fantasia,
    razao_social: data.razao_social,
    uf: estabelecimento.estado?.sigla || estabelecimento.uf,
    municipio: estabelecimento.cidade?.nome || estabelecimento.municipio,
    cnae_fiscal_descricao:
      estabelecimento.atividade_principal?.descricao ||
      estabelecimento.cnae_principal?.descricao,
    descricao_porte: data.porte?.descricao,
  };
}

export async function consultarCNPJ(cnpj) {
  if (!cnpj || typeof cnpj !== "string") {
    throw new ExternalApiError("CNPJ é obrigatório", "INVALID_INPUT");
  }

  const cnpjLimpo = limparCNPJ(cnpj);

  if (!validarCNPJ(cnpjLimpo)) {
    throw new ExternalApiError("Informe um CNPJ válido com 14 dígitos", "INVALID_INPUT");
  }

  const { controller, timeoutId } = createExternalFetchOptions();

  try {
    const data = await buscarCNPJJson(`${BRASIL_API_URL}/${cnpjLimpo}`, controller.signal);
    return normalizarBrasilApi(data);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ExternalApiError("Consulta de CNPJ demorou muito", "TIMEOUT");
    }

    try {
      const fallbackData = await buscarCNPJJson(`${CNPJ_WS_API_URL}/${cnpjLimpo}`, controller.signal);
      return normalizarCnpjWs(fallbackData);
    } catch (fallbackError) {
      if (fallbackError instanceof ExternalApiError) {
        throw fallbackError;
      }

      throw new ExternalApiError(CNPJ_UNAVAILABLE_MESSAGE, "UNAVAILABLE");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
