import React, { useEffect, useState, useRef } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { chatService } from "../services/chatService";
import { trilhaService } from "../services/trilhaService";

const acoesRapidas = [
  { texto: "O que estudar hoje", acao: "O que estudar hoje?" },
  { texto: "Revisar meu progresso", acao: "Revisar meu progresso" },
  { texto: "Perguntar mais", acao: "Perguntar mais" },
];

export default function ChatMentor() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [trilhas, setTrilhas] = useState([]);
  const [trilhaId, setTrilhaId] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const carregar = async () => {
      const [resChat, resTrilhas] = await Promise.all([
        chatService.historico(),
        trilhaService.listar(),
      ]);

      if (resTrilhas.status === "SUCESSO") {
        setTrilhas(resTrilhas.trilhas);
      }

      if (resChat.status === "SUCESSO") {
        const msgs = (resChat.interacoes || []).flatMap((i) => [
          { id: `p-${i.id}`, tipo: "user", texto: i.pergunta },
          { id: `r-${i.id}`, tipo: "assistant", texto: i.resposta },
        ]);
        setChat(msgs);
      }

      setCarregandoHistorico(false);
    };
    carregar();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const enviarMensagem = async (texto) => {
    if (!texto.trim() || loading) return;

    const novaMsg = { id: Date.now(), tipo: "user", texto };
    setChat((prev) => [...prev, novaMsg]);
    setMensagem("");
    setLoading(true);

    const res = await chatService.perguntar(texto, trilhaId ? Number(trilhaId) : null);

    setChat((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        tipo: "assistant",
        texto: res.resposta || res.mensagem || "Desculpe, nao consegui responder agora.",
      },
    ]);
    setLoading(false);
  };

  const dados = JSON.parse(localStorage.getItem("dadosDeSessao") || "{}");
  const inicial = dados.nome ? dados.nome.charAt(0).toUpperCase() : "U";

  const limparChat = async () => {
    const confirmar = window.confirm("Tem certeza que deseja apagar todo o historico de conversas?");
    if (!confirmar) return;

    const res = await chatService.limparHistorico();
    if (res.status === "SUCESSO") {
      setChat([]);
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <h2
              className="font-poppins-bold text-lg"
              style={{ color: colors.blue }}
            >
              ‹ MentorIA
            </h2>
            {chat.length > 0 && (
              <button
                className="py-1 px-3 rounded-lg font-poppins-bold text-xs cursor-pointer border-none"
                style={{ backgroundColor: "#dc2626", color: "white" }}
                onClick={limparChat}
              >
                Limpar Chat
              </button>
            )}
          </div>

          <div className="py-3">
            <select
              className="w-full rounded-xl px-4 py-2 font-poppins text-sm outline-none"
              style={{ border: `1px solid ${colors["light-grey"]}`, color: colors.grey, backgroundColor: colors.card }}
              value={trilhaId}
              onChange={(e) => setTrilhaId(e.target.value)}
            >
              <option value="">Conversa geral (sem trilha)</option>
              {trilhas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome} — {t.nvl}
                </option>
              ))}
            </select>
          </div>

          <div className="py-4 space-y-4 max-h-96 overflow-y-auto" style={{ borderTop: `1px solid ${colors.border}` }}>
            {carregandoHistorico ? (
              <p className="font-poppins text-sm text-center" style={{ color: colors.grey }}>
                Carregando...
              </p>
            ) : chat.length === 0 ? (
              <p className="font-poppins text-sm text-center" style={{ color: colors.grey }}>
                Selecione uma trilha e faca uma pergunta para comecar!
              </p>
            ) : (
              chat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.tipo === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.tipo === "assistant" && (
                    <div className="flex-shrink-0">
                      <IoChatbubbleEllipses size={32} color={colors.blue} />
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 ${
                      msg.tipo === "user"
                        ? "rounded-br-none"
                        : "rounded-bl-none"
                    }`}
                    style={{
                      backgroundColor: msg.tipo === "user" ? colors.blue : colors["dark-white"],
                      color: msg.tipo === "user" ? "white" : colors.blue,
                      border: msg.tipo === "user" ? "none" : `1px solid ${colors["light-grey"]}`,
                    }}
                  >
                    <p className="font-poppins text-sm leading-relaxed">{msg.texto}</p>
                  </div>
                  {msg.tipo === "user" && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-poppins-bold text-sm"
                      style={{
                        backgroundColor: colors["light-grey"],
                        color: colors.grey,
                      }}
                    >
                      {inicial}
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <p className="font-poppins text-sm text-center" style={{ color: colors.grey }}>
                Mentor IA esta pensando...
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
            <input
              className="flex-1 rounded-xl px-4 py-2 font-poppins text-sm outline-none"
              style={{ border: `1px solid ${colors["light-grey"]}`, backgroundColor: colors.card, color: colors.grey }}
              placeholder="Digite aqui..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensagem(mensagem)}
              disabled={loading}
            />
            <button
              className="py-2 px-6 rounded-xl font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
              style={{ backgroundColor: colors.orange, color: "white" }}
              onClick={() => enviarMensagem(mensagem)}
              disabled={loading || !mensagem.trim()}
            >
              Enviar
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          {acoesRapidas.map((acao, i) => (
            <button
              key={i}
              className="flex-1 py-3 px-4 rounded-xl font-poppins-bold text-sm cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: colors.blue, color: "white" }}
              onClick={() => enviarMensagem(acao.acao)}
              disabled={loading}
            >
              {acao.texto} ›
            </button>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}
