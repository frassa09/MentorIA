import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import MentoriaIA from "../components/MentoriaIA";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { trilhaService } from "../services/trilhaService";
import { aulaService } from "../services/aulaService";

export default function MinhasTrilhas() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [trilhas, setTrilhas] = useState([]);
  const [trilhaId, setTrilhaId] = useState("");
  const [trilhaSelecionada, setTrilhaSelecionada] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [criandoAula, setCriandoAula] = useState(false);

  const carregarTrilhas = async () => {
    const res = await trilhaService.listar();
    if (res.status === "SUCESSO") {
      setTrilhas(res.trilhas);
      if (res.trilhas.length > 0 && !trilhaId) {
        setTrilhaId(String(res.trilhas[0].id));
        setTrilhaSelecionada(res.trilhas[0]);
      } else if (res.trilhas.length > 0) {
        const atualizada = res.trilhas.find((t) => String(t.id) === trilhaId);
        if (atualizada) {
          setTrilhaSelecionada(atualizada);
        } else {
          setTrilhaId(String(res.trilhas[0].id));
          setTrilhaSelecionada(res.trilhas[0]);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarTrilhas();
  }, []);

  useEffect(() => {
    const t = trilhas.find((tr) => String(tr.id) === trilhaId);
    setTrilhaSelecionada(t || null);
    setAbaAtiva(0);
  }, [trilhaId, trilhas]);

  const excluirTrilha = async () => {
    if (!trilhaSelecionada) return;
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a trilha "${trilhaSelecionada.nome}"? Esta acao nao pode ser desfeita.`
    );
    if (!confirmar) return;

    const res = await trilhaService.excluir(trilhaSelecionada.id);
    if (res.status === "SUCESSO") {
      setTrilhas((prev) => prev.filter((t) => t.id !== trilhaSelecionada.id));
      setTrilhaId("");
      setTrilhaSelecionada(null);
    }
  };

  const criarAula = async (conteudo) => {
    if (criandoAula) return;
    setCriandoAula(true);

    const res = await aulaService.criar(
      trilhaSelecionada.id,
      conteudo.titulo_aba,
      conteudo.conteudo_html
    );

    setCriandoAula(false);

    if (res.status === "SUCESSO") {
      navigate("/inicio");
    } else {
      alert(res.mensagem || "Erro ao criar aula");
    }
  };

  const conteudos = trilhaSelecionada?.ConteudoTrilhas || [];
  const abaAtual = conteudos[abaAtiva] || null;

  return (
    <LayoutWrapper>
      <div className="flex gap-6 items-start">
        <div className="rounded-2xl shadow-sm p-6 flex-1 max-w-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <h2 className="font-poppins-bold text-lg" style={{ color: colors.blue }}>
              ‹ Minha trilha
            </h2>
            <div className="flex gap-2">
              {trilhaSelecionada && (
                <button
                  className="py-1 px-3 rounded-lg font-poppins-bold text-xs cursor-pointer border-none"
                  style={{ backgroundColor: "#dc2626", color: "white" }}
                  onClick={excluirTrilha}
                >
                  Excluir
                </button>
              )}
              <button
                className="py-1 px-3 rounded-lg font-poppins-bold text-xs cursor-pointer border-none"
                style={{ backgroundColor: colors.orange, color: "white" }}
                onClick={() => navigate("/adicionar-trilha")}
              >
                Adicionar Nova
              </button>
            </div>
          </div>

          {loading ? (
            <p className="font-poppins text-sm mt-4" style={{ color: colors.grey }}>
              Carregando...
            </p>
          ) : trilhas.length === 0 ? (
            <p className="font-poppins text-sm mt-4" style={{ color: colors.grey }}>
              Nenhuma trilha disponivel. Clique em "Adicionar Nova" para criar.
            </p>
          ) : (
            <>
              <div className="py-4">
                <p className="font-poppins-bold text-sm mb-2" style={{ color: colors.blue }}>
                  Selecione sua trilha
                </p>
                <select
                  className="w-full rounded-xl px-4 py-2 font-poppins text-sm outline-none"
                  style={{ border: `1px solid ${colors["light-grey"]}`, color: colors.grey, backgroundColor: colors.card }}
                  value={trilhaId}
                  onChange={(e) => setTrilhaId(e.target.value)}
                >
                  {trilhas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} — {t.nvl}
                    </option>
                  ))}
                </select>
              </div>

              {conteudos.length > 0 && (
                <>
                  <div style={{ borderBottom: `1px solid ${colors.border}` }} />

                  <div className="py-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {conteudos.map((c, i) => (
                        <button
                          key={c.id}
                          className="py-2 px-4 rounded-lg font-poppins-bold text-xs cursor-pointer border-none whitespace-nowrap"
                          style={{
                            backgroundColor: abaAtiva === i ? colors.blue : colors["dark-white"],
                            color: abaAtiva === i ? "white" : colors.blue,
                          }}
                          onClick={() => setAbaAtiva(i)}
                        >
                          {c.titulo_aba}
                        </button>
                      ))}
                    </div>

                    <div
                      className="mt-4 p-4 rounded-xl font-poppins text-sm leading-relaxed"
                      style={{
                        backgroundColor: colors["dark-white"],
                        color: colors.grey,
                        maxHeight: 400,
                        overflow: "auto",
                      }}
                      dangerouslySetInnerHTML={{ __html: abaAtual?.conteudo_html || "" }}
                    />

                    {abaAtual && (
                      <div className="mt-3 flex justify-end">
                        <button
                          className="py-2 px-4 rounded-lg font-poppins-bold text-xs cursor-pointer border-none disabled:opacity-50"
                          style={{ backgroundColor: colors.orange, color: "white" }}
                          onClick={() => criarAula(abaAtual)}
                          disabled={criandoAula}
                        >
                          {criandoAula ? "Criando aula..." : "Criar Aula"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {conteudos.length === 0 && trilhaSelecionada && (
                <p className="font-poppins text-sm mt-4" style={{ color: colors.grey }}>
                  Esta trilha ainda nao possui conteudo. Responda ao questionario para gerar o plano de aprendizado.
                </p>
              )}

              <div style={{ borderBottom: `1px solid ${colors.border}` }} />

              <div className="flex justify-end gap-4 pt-6">
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
              </div>
            </>
          )}
        </div>

        <div className="w-72">
          <MentoriaIA />
        </div>
      </div>
    </LayoutWrapper>
  );
}
