import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { trilhaService } from "../services/trilhaService";

export default function ResponderQuestionario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      const res = await trilhaService.gerarQuestionario(id);
      if (res.status === "SUCESSO" && res.questoes.length > 0) {
        setQuestoes(res.questoes);
      } else {
        setErro("Erro ao gerar questionario");
      }
      setLoading(false);
    };
    carregar();
  }, [id]);

  const selecionarResposta = (indexQuestao, indice) => {
    setRespostas((prev) => ({ ...prev, [indexQuestao]: indice }));
  };

  const responder = async () => {
    const respondidas = Object.keys(respostas).length;
    if (respondidas < questoes.length) {
      setErro("Responda todas as questoes antes de enviar");
      return;
    }

    setEnviando(true);
    setErro("");

    const respostasArray = questoes.map((q, i) => ({
      enunciado: q.enunciado,
      resposta: q.opcoes[respostas[i]] || "",
      correta: respostas[i] === q.resposta_correta,
    }));

    const res = await trilhaService.responderQuestionario(id, respostasArray);

    if (res.status === "SUCESSO") {
      navigate("/minhas-trilhas");
    } else {
      setErro("Erro ao processar respostas");
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-poppins" style={{ color: colors.grey }}>Gerando questionario com IA...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2
            className="font-poppins-bold text-lg pb-4"
            style={{ color: colors.blue, borderBottom: `1px solid ${colors.border}` }}
          >
            ‹ Questionario de Nivelamento
          </h2>

          {erro && (
            <p className="font-poppins text-sm text-red-500 mt-4">{erro}</p>
          )}

          <div className="space-y-6 mt-6">
            {questoes.map((q, i) => (
              <div key={i} className="rounded-xl p-4" style={{ border: `1px solid ${colors.border}` }}>
                <p className="font-poppins-bold text-sm mb-3" style={{ color: colors.blue }}>
                  {i + 1}. {q.enunciado}
                </p>
                <div className="space-y-2">
                  {q.opcoes.map((opcao, j) => {
                    const selecionado = respostas[i] === j;
                    return (
                      <button
                        key={j}
                        className="w-full text-left py-2 px-4 rounded-lg font-poppins text-sm cursor-pointer"
                        style={{
                          backgroundColor: selecionado ? colors.blue : "transparent",
                          border: selecionado ? "none" : `1px solid ${colors["light-grey"]}`,
                          color: selecionado ? "white" : colors.grey,
                        }}
                        onClick={() => selecionarResposta(i, j)}
                      >
                        {opcao}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer"
              style={{
                border: `1px solid ${colors.blue}`,
                color: colors.blue,
                backgroundColor: "transparent",
              }}
              onClick={() => navigate("/minhas-trilhas")}
            >
              Cancelar
            </button>
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
              style={{ backgroundColor: colors.orange, color: "white" }}
              onClick={responder}
              disabled={enviando}
            >
              {enviando ? "Processando..." : "Enviar Respostas"}
            </button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
