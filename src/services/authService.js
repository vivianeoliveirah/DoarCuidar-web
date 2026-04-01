const BASE_URL = import.meta.env.VITE_API_URL;

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) return { error: true };

  // 🔥 salva usuário
  localStorage.setItem("user", JSON.stringify(data));

  return { data };
}