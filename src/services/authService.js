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

    const text = await res.text();

    try {
      const data = JSON.parse(text);

      if (!res.ok) return { error: true, message: data.error };

      localStorage.setItem("user", JSON.stringify(data));

      return { data };
    } catch {
      console.error("Resposta inválida:", text);
      return { error: true };
    }

  } catch (err) {
    console.error(err);
    return { error: true };
  }
}


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