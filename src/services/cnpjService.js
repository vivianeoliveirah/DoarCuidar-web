export async function consultarCNPJ(cnpj) {

  const cnpjLimpo = cnpj.replace(/\D/g, "");

  if (cnpjLimpo.length !== 14) {
    throw new Error("CNPJ inválido");
  }

  const response = await fetch(
    `https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`
  );

  if (!response.ok) {
    throw new Error("CNPJ não encontrado");
  }

  const data = await response.json();

  return data;
}