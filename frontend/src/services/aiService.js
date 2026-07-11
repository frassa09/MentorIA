const url = import.meta.env.VITE_API_URL;

function headers() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getAIHeaders() {
  const config = getAIConfig();
  const h = {};
  if (config.provider) h["x-ai-provider"] = config.provider;
  if (config.apiKey) h["x-ai-api-key"] = config.apiKey;
  if (config.model) h["x-ai-model"] = config.model;
  return h;
}

export function getAIConfig() {
  try {
    return JSON.parse(localStorage.getItem("aiConfig") || "{}");
  } catch {
    return {};
  }
}

export function saveAIConfig(config) {
  localStorage.setItem("aiConfig", JSON.stringify(config));
}

export function getDefaultModel(provider) {
  return provider === "gemini" ? "gemini-2.0-flash" : "llama-3.3-70b-versatile";
}

export const aiService = {
  listarModelos: async () => {
    try {
      const res = await fetch(`${url}ia/modelos`, { headers: headers() });
      return await res.json();
    } catch (e) {
      return { status: "ERRO" };
    }
  },
};
