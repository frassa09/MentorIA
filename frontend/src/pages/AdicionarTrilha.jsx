import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import DefaultInput from "../components/DefaultInput";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { trilhaService } from "../services/trilhaService";

export default function AdicionarTrilha() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nvl, setNvl] = useState("iniciante");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const gerarQuestionario = async () => {
    if (!nome || !descricao) {
      setErro("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setErro("");

    const res = await trilhaService.criar({ nome, area: descricao, nvl, descricao });

    if (res.status === "SUCESSO") {
      navigate(`/responder-questionario/${res.trilha.id}`);
    } else {
      setErro("Erro ao criar trilha");
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2
            className="font-poppins-bold text-lg pb-4"
            style={{ color: colors.blue, borderBottom: `1px solid ${colors.border}` }}
          >
            ‹ Adicionar Nova Trilha
          </h2>

          {erro && (
            <p className="font-poppins text-sm text-red-500 mt-4">{erro}</p>
          )}

          <div className="space-y-6 mt-6">
            <DefaultInput
              label="Nome da trilha"
              placeholder="Ex: Desenvolvimento Web"
              value={nome}
              onChangeText={setNome}
            />

            <div>
              <p className="font-poppins px-5 mb-1" style={{ color: colors.grey }}>Descricao</p>
              <textarea
                className="w-full rounded-[18px] px-5 py-3 font-poppins outline-none transition-shadow duration-200 resize-none"
                style={{
                  minHeight: 100,
                  border: `1px solid ${colors["light-grey"]}`,
                  backgroundColor: colors.card,
                  color: colors.grey,
                }}
                placeholder="Ex: Aprenda HTML, CSS, JavaScript e React"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div>
              <p className="font-poppins px-5 mb-1" style={{ color: colors.grey }}>Nivel de aprofundamento</p>
              <div className="flex gap-3">
                {["iniciante", "intermediario", "avancado"].map((n) => (
                  <button
                    key={n}
                    className="py-2 px-4 rounded-full font-poppins-bold text-xs cursor-pointer capitalize"
                    style={{
                      backgroundColor: nvl === n ? colors.blue : "transparent",
                      border: nvl === n ? "none" : `1px solid ${colors.blue}`,
                      color: nvl === n ? "white" : colors.blue,
                    }}
                    onClick={() => setNvl(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
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
              onClick={() => navigate("/minhas-trilhas")}
            >
              Cancelar
            </button>
            <button
              className="py-2 px-6 rounded-lg font-poppins-bold text-sm cursor-pointer border-none disabled:opacity-50"
              style={{ backgroundColor: colors.orange, color: "white" }}
              onClick={gerarQuestionario}
              disabled={loading}
            >
              {loading ? "Criando..." : "Gerar Questionario"}
            </button>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
