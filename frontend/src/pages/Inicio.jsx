import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/LayoutWrapper";
import MentoriaIA from "../components/MentoriaIA";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";
import { aulaService } from "../services/aulaService";

export default function Inicio() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aulaAberta, setAulaAberta] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const res = await aulaService.listar();
      if (res.status === "SUCESSO") {
        setAulas(res.aulas || []);
      }
      setLoading(false);
    };
    carregar();
  }, []);

  const toggleAula = (aula) => {
    if (aulaAberta?.id === aula.id) {
      setAulaAberta(null);
    } else {
      setAulaAberta(aula);
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex gap-6 items-start">
        <div className="rounded-2xl shadow-sm p-6 flex-1 max-w-2xl" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
          <h2
            className="font-poppins-bold text-lg pb-4"
            style={{ color: colors.blue, borderBottom: `1px solid ${colors.border}` }}
          >
            O que estudar hoje
          </h2>

          {loading ? (
            <p className="font-poppins text-sm mt-4" style={{ color: colors.grey }}>
              Carregando...
            </p>
          ) : aulas.length === 0 ? (
            <div className="py-6 text-center">
              <p className="font-poppins text-sm" style={{ color: colors.grey }}>
                Nenhuma aula encontrada. Va em{" "}
                <button
                  className="font-poppins-bold underline bg-transparent border-none cursor-pointer"
                  style={{ color: colors.blue }}
                  onClick={() => navigate("/minhas-trilhas")}
                >
                  Minhas trilhas
                </button>{" "}
                para criar aulas a partir dos topicos das suas trilhas.
              </p>
            </div>
          ) : (
            aulas.map((aula, i) => (
              <div key={aula.id}>
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <p
                      className="font-poppins-bold text-base"
                      style={{ color: colors.blue }}
                    >
                      Aula: {aula.titulo}
                    </p>
                    <p className="font-poppins text-sm mt-1" style={{ color: colors.grey }}>
                      {aula.Trilha?.nome && `${aula.Trilha.nome} — `}
                      Duracao: {aula.duracao_estimada || "15 min"}
                    </p>
                  </div>
                  <button
                    className="py-2 px-4 rounded-lg font-poppins-bold text-sm cursor-pointer border-none"
                    style={{
                      backgroundColor: aulaAberta?.id === aula.id ? colors.grey : colors.orange,
                      color: "white",
                    }}
                    onClick={() => toggleAula(aula)}
                  >
                    {aulaAberta?.id === aula.id ? "Fechar" : "Assistir Aula"}
                  </button>
                </div>

                {aulaAberta?.id === aula.id && (
                  <div
                    className="mb-4 p-4 rounded-xl font-poppins text-sm leading-relaxed"
                    style={{
                      backgroundColor: colors["dark-white"],
                      color: colors.grey,
                      maxHeight: 500,
                      overflow: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: aula.conteudo_html }}
                  />
                )}

                {i < aulas.length - 1 && <div style={{ borderBottom: `1px solid ${colors.border}` }} />}
              </div>
            ))
          )}
        </div>

        <div className="w-72">
          <MentoriaIA />
        </div>
      </div>
    </LayoutWrapper>
  );
}
