import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";

export default function MentoriaIA() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
      <h2
        className="font-poppins-bold text-lg text-center"
        style={{ color: colors.blue }}
      >
        Mentoria IA
      </h2>
      <p className="font-poppins text-sm text-center" style={{ color: colors.grey }}>
        Precisa de ajuda?
      </p>
      <button
        className="w-full py-2 px-4 rounded-lg font-poppins-bold text-sm cursor-pointer"
        style={{
          border: `1px solid ${colors.blue}`,
          color: colors.blue,
          backgroundColor: "transparent",
        }}
        onClick={() => navigate("/mentor-ia")}
      >
        Falar com a mentoria IA
      </button>
    </div>
  );
}
