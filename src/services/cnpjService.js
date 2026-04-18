import { ExternalApiError, createExternalFetchOptions } from "./api";

const TIMEOUT_MS = 8000;

export async function consultarCNPJ(cnpj) {
  if (!cnpj || typeof cnpj !== 'string') {
    throw new ExternalApiError("CNPJ é obrigatório", "INVALID_INPUT");
  }

  const cnpjLimpo = cnpj.replace(/\D/g, "");
  if (cnpjLimpo.length !== 14) {
    throw new ExternalApiError("CNPJ deve ter 14 dígitos", "INVALID_INPUT");
  }

  const { controller, timeoutId } = createExternalFetchOptions();

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new ExternalApiError("CNPJ não encontrado", "NOT_FOUND");
      }
      throw new ExternalApiError("Erro na consulta do CNPJ", "NETWORK");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ExternalApiError("Consulta de CNPJ demorou muito", "TIMEOUT");
    }

    if (error instanceof ExternalApiError) {
      throw error;
    }

    throw new ExternalApiError("Erro ao consultar CNPJ", "NETWORK");
  }
}