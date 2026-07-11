import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";

export default function HeaderSuperior() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const colors = getColors(isDark);

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dadosDeSessao");
    navigate("/");
  };

  return (
    <div
      className="h-12 flex items-center justify-end px-6 gap-4"
      style={{ backgroundColor: colors.blue }}
    >
      <button
        className="bg-transparent border-none text-white font-poppins text-sm cursor-pointer hover:opacity-80 flex items-center gap-1"
        onClick={toggleTheme}
        title={isDark ? "Modo claro" : "Modo escuro"}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
      <button
        className="bg-transparent border-none text-white font-poppins text-sm cursor-pointer hover:opacity-80"
        onClick={sair}
      >
        Sair
      </button>
    </div>
  );
}
