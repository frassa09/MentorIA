import { sequelizeErrors } from "../constants/errorsSequelize";

const url = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const userService = {
  cadastrarUsuario: async (user) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${url}usuario/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        signal: controller.signal,
      });

      return await response.json();
    } catch (e) {
      console.log(e);
      return e;
    } finally {
      clearTimeout(timer);
    }
  },

  logarUsuario: async (user) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${url}usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        signal: controller.signal,
        credentials: "include",
      });

      return await response.json();
    } catch (e) {
      console.log(e);
    } finally {
      clearTimeout(timer);
    }
  },

  validarSessao: async () => {
    const token = localStorage.getItem("token");
    if (!token) return { status: "NAO_AUTORIZADO" };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${url}usuario/auth/perfil`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        signal: controller.signal,
      });

      return await response.json();
    } catch (e) {
      console.log(e);
      return e;
    } finally {
      clearTimeout(timer);
    }
  },
};
