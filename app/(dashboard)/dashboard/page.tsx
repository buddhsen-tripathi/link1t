"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createEmptyPortfolio, type PortfolioData, type ThemeId } from "@/types/portfolio";

export default function DashboardPage() {
  const [data, setData] = useState<PortfolioData>(createEmptyPortfolio());
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("brutalist");

  return (
    <DashboardShell
      data={data}
      onDataChange={setData}
      selectedTheme={selectedTheme}
      onThemeChange={setSelectedTheme}
    />
  );
}
