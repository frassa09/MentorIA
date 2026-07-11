const url = import.meta.env.VITE_API_URL;

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const progressoService = {
  obter: async () => {
    try {
      const res = await fetch(`${url}progresso`, { headers: headers() });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },

  graficos: async () => {
    try {
      const res = await fetch(`${url}progresso/graficos`, { headers: headers() });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },
};
