import { ExternalApiError, createExternalFetchOptions } from "./api";

const TIMEOUT_MS = 8000;

export async function buscarCEP(cep) {
  if (!cep || typeof cep !== 'string') {
    throw new ExternalApiError("CEP é obrigatório", "INVALID_INPUT");
  }

  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) {
    throw new ExternalApiError("CEP deve ter 8 dígitos", "INVALID_INPUT");
  }

  const { controller, timeoutId } = createExternalFetchOptions();

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cepLimpo}/json/`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new ExternalApiError("Erro na consulta do CEP", "NETWORK");
    }

    const data = await response.json();

    if (data.erro) {
      throw new ExternalApiError("CEP não encontrado", "NOT_FOUND");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ExternalApiError("Consulta de CEP demorou muito", "TIMEOUT");
    }

    if (error instanceof ExternalApiError) {
      throw error;
    }

    throw new ExternalApiError("Erro ao buscar CEP", "NETWORK");
  }
}