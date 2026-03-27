const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(email, senha) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) throw new Error("Erro no login");

  return res.json();
}