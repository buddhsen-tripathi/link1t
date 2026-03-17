"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeWrapper } from "@/components/themes/ThemeWrapper";
import { themes, THEME_OPTIONS } from "@/components/themes";
import type { PortfolioData, ThemeId } from "@/types/portfolio";

interface PreviewPanelProps {
  data: PortfolioData;
  selectedTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function PreviewPanel({
  data,
  selectedTheme,
  onThemeChange,
}: PreviewPanelProps) {
  // Fallback to brutalist if theme doesn't exist (e.g., removed theme)
  const ThemeComponent = themes[selectedTheme] || themes.brutalist;

  const openFullPreview = () => {
    // Store data in sessionStorage for the preview page
    sessionStorage.setItem("previewData", JSON.stringify(data));
    sessionStorage.setItem("previewTheme", selectedTheme);
    // Open in new tab
    window.open("/preview", "_blank");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-dashed border-border flex items-center justify-between shrink-0">
        <Select value={selectedTheme} onValueChange={(v) => onThemeChange(v as ThemeId)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                <div className="flex flex-col items-start">
                  <span>{theme.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {theme.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={openFullPreview}
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">Full Preview</span>
        </Button>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative w-full">
          <ThemeWrapper scale={0.5}>
            <ThemeComponent data={data} isPreview />
          </ThemeWrapper>
        </div>
      </div>
    </div>
  );
}
