"use client";

import { useEffect, useState } from "react";
import { themes } from "@/components/themes";
import { createEmptyPortfolio, type PortfolioData, type ThemeId } from "@/types/portfolio";

export default function PreviewPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [themeId, setThemeId] = useState<ThemeId>("brutalist");

  useEffect(() => {
    // Get preview data from sessionStorage
    const storedData = sessionStorage.getItem("previewData");
    const storedTheme = sessionStorage.getItem("previewTheme");

    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch {
        setData(createEmptyPortfolio());
      }
    } else {
      setData(createEmptyPortfolio());
    }

    if (storedTheme) {
      setThemeId(storedTheme as ThemeId);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading preview...</div>
      </div>
    );
  }

  const ThemeComponent = themes[themeId] || themes.brutalist;

  return <ThemeComponent data={data} />;
}
