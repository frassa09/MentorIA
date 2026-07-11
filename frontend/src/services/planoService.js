const url = import.meta.env.VITE_API_URL;

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const planoService = {
  visualizar: async () => {
    try {
      const res = await fetch(`${url}plano`, { headers: headers() });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },

  gerar: async (id_trilha) => {
    try {
      const res = await fetch(`${url}plano/gerar`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id_trilha }),
      });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },
};
