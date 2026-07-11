const url = import.meta.env.VITE_API_URL;

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const authService = {
  alterarSenha: async (senhaAntiga, senhaNova) => {
    try {
      const res = await fetch(`${url}usuario/alterar-senha`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ senhaAntiga, senhaNova }),
      });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },

  apagarDados: async () => {
    try {
      const res = await fetch(`${url}usuario/dados`, {
        method: "DELETE",
        headers: headers(),
      });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },
};
