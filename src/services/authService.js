const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-doarcuidar.onrender.com";

// 🔥 LOGIN
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return { error: true };

    localStorage.setItem("user", JSON.stringify(data));

    return { data };
  } catch (err) {
    console.error("Erro no login:", err);
    return { error: true };
  }
}

// 🔥 REGISTER (FALTAVA — ESSE É O PROBLEMA)
export async function registerUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) return { error: true };

  return { data };
}