import { getAIHeaders } from "./aiService";

const url = import.meta.env.VITE_API_URL;

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getAIHeaders(),
  };
}

export const aulaService = {
  criar: async (id_trilha, titulo_aba, conteudo_html) => {
    try {
      const res = await fetch(`${url}aulas`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id_trilha, titulo_aba, conteudo_html }),
      });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },

  listar: async (id_trilha) => {
    try {
      const query = id_trilha ? `?id_trilha=${id_trilha}` : "";
      const res = await fetch(`${url}aulas${query}`, { headers: headers() });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },

  excluir: async (id) => {
    try {
      const res = await fetch(`${url}aulas/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },
};
