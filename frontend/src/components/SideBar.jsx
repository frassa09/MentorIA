import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";

const itensMenu = [
  { label: "Inicio", rota: "/inicio" },
  { label: "Minhas trilhas", rota: "/minhas-trilhas" },
  { label: "Mentor IA", rota: "/mentor-ia" },
  { label: "Config. IA", rota: "/configuracoes-ia" },
  { label: "Perfil", rota: "/perfil" },
];

export default function SideBar({ showSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <motion.div
      className="min-h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: colors.card,
        borderRight: `1px solid ${colors.border}`,
      }}
      animate={{ width: showSidebar ? 250 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ opacity: showSidebar ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 flex flex-col flex-1"
      >
        <div className="flex items-center gap-2 mb-10">
          <IoChatbubbleEllipses size={32} color={colors.blue} />
          <span className="font-poppins-bold text-xl">
            <span style={{ color: colors.blue }}>Mentor</span>{" "}
            <span style={{ color: colors.orange }}>IA+</span>
          </span>
        </div>

        <nav className="flex flex-col gap-6">
          {itensMenu.map((item) => {
            const ativo = location.pathname === item.rota;
            return (
              <button
                key={item.rota}
                className={`text-left font-poppins-bold text-lg bg-transparent border-none cursor-pointer pb-1 ${
                  ativo ? "underline underline-offset-4" : ""
                }`}
                style={{ color: colors.blue }}
                onClick={() => navigate(item.rota)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </motion.div>
    </motion.div>
  );
}
