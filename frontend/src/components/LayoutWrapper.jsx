import React, { useState } from "react";
import SideBar from "./SideBar";
import HeaderSuperior from "./HeaderSuperior";
import { useTheme } from "../contexts/ThemeContext";
import { getColors } from "../constants/colors";

export default function LayoutWrapper({ children }) {
  const [showSidebar] = useState(true);
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <div className="min-h-screen flex flex-row overflow-x-hidden">
      <SideBar showSidebar={showSidebar} />
      <div className="flex-1 flex flex-col" style={{ backgroundColor: colors.page }}>
        <HeaderSuperior />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
