import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { aiService, saveAIConfig, getAIConfig, getDefaultModel } from "../services/aiService";

export default function ConfiguracoesIA() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [modelos, setModelos] = useState({ groq: [], gemini: [] });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [testando, setTestando] = useState(false);

  useEffect(() => {
    const config = getAIConfig();
    if (config.provider) setProvider(config.provider);
    if (config.apiKey) setApiKey(config.apiKey);
    if (config.model) setModel(config.model);

    const carregarModelos = async () => {
      const res = await aiService.listarModelos();
      if (res.status === "SUCESSO") {
        setModelos({ groq: res.groq || [], gemini: res.gemini || [] });
      }
    };
    carregarModelos();
  }, []);

  useEffect(() => {
    const config = getAIConfig();
    const defaultModel = getDefaultModel(provider);
    setModel(config.model || defaultModel);
  }, [provider]);

  const modelosDisponiveis = provider === "gemini" ? modelos.gemini : modelos.groq;

  const salvar = () => {
    if (!apiKey.trim()) {
      setErro("Insira uma API key valida");
      return;
    }

    saveAIConfig({ provider, apiKey: apiKey.trim(), model });
    setSucesso("Configuracoes salvas com sucesso!");
    setErro("");
    setTimeout(() => setSucesso(""), 3000);
  };

  const testar = async () => {
    if (!apiKey.trim()) {
      setErro("Insira uma API key para testar");
      return;
    }

    setTestando(true);
    setErro("");
    setSucesso("");

    saveAIConfig({ provider, apiKey: apiKey.trim(), model });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}chat/perguntar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-ai-provider": provider,
          "x-ai-api-key": apiKey.trim(),
          "x-ai-model": model,
        },
        body: JSON.stringify({ pergunta: "O que e JavaScript?" }),
      });
      const data = await res.json();

      if (data.status === "SUCESSO") {
        setSucesso("Teste realizado com sucesso! A IA esta funcionando.");
      } else {
        setErro(data.mensagem || "Erro no teste. Verifique sua API key e modelo.");
      }
    } catch (e) {
      setErro("Erro de conexao ao testar.");
    }

    setTestando(false);
  };

  return (
    <LayoutWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2
            className="font-poppins-bold text-lg pb-4"
            style={{ color: colors.blue, borderBottom: `1px solid ${colors.border}` }}
          >
            Configuracoes da IA
          </h2>

          <p className="font-poppins text-sm mt-4 mb-6" style={{ color: colors.grey }}>
            Escolha o provedor de IA, insira sua API key e selecione o modelo para gerar conteudo.
          </p>

          {sucesso && (
            <p className="font-poppins text-sm text-green-600 mb-4">{sucesso}</p>
          )}
          {erro && (
            <p className="font-poppins text-sm text-red-500 mb-4">{erro}</p>
          )}

          <div className="space-y-6">
            <div>
              <p className="font-poppins-bold text-sm mb-2" style={{ color: colors.blue }}>
                Provedor de IA
              </p>
              <div className="flex gap-3">
                {["groq", "gemini"].map((p) => (
                  <button
                    key={p}
                    className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer capitalize"
                    style={{
                      backgroundColor: provider === p ? colors.blue : "transparent",
                      border: provider === p ? "none" : `1px solid ${colors.blue}`,
                      color: provider === p ? "white" : colors.blue,
                    }}
                    onClick={() => setProvider(p)}
                  >
                    {p === "groq" ? "Groq" : "Google Gemini"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-poppins-bold text-sm mb-2" style={{ color: colors.blue }}>
                API Key
              </p>
              <input
                className="w-full rounded-xl px-4 py-2 font-poppins text-sm outline-none"
                style={{
                  border: `1px solid ${colors["light-grey"]}`,
                  backgroundColor: colors.card,
                  color: colors.grey,
                }}
                type="password"
                placeholder={provider === "groq" ? "gsk_..." : "AIza..."}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="font-poppins text-xs mt-1" style={{ color: colors.grey }}>
                {provider === "groq"
                  ? "Obtenha em console.groq.com"
                  : "Obtenha em aistudio.google.com/apikey"}
              </p>
            </div>

            <div>
              <p className="font-poppins-bold text-sm mb-2" style={{ color: colors.blue }}>
                Modelo
              </p>
              <select
                className="w-full rounded-xl px-4 py-2 font-poppins text-sm outline-none"
                style={{
                  border: `1px solid ${colors["light-grey"]}`,
                  backgroundColor: colors.card,
                  color: colors.grey,
                }}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {modelosDisponiveis.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer"
              style={{
                border: `1px solid ${colors.blue}`,
                color: colors.blue,
                backgroundColor: "transparent",
              }}
              onClick={() => navigate("/inicio")}
            >
              Voltar
            </button>
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
              style={{ backgroundColor: "#6366f1", color: "white" }}
              onClick={testar}
              disabled={testando || !apiKey.trim()}
            >
              {testando ? "Testando..." : "Testar Conexao"}
            </button>
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
              style={{ backgroundColor: colors.orange, color: "white" }}
              onClick={salvar}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
