"use client";

import { useState, useEffect, useCallback } from "react";
import { createEmptyPortfolio, type PortfolioData, type ThemeId } from "@/types/portfolio";

interface UsePortfolioFormOptions {
  initialData?: PortfolioData | null;
  onAutoSave?: (data: PortfolioData) => Promise<void>;
  autoSaveDelay?: number;
}

export function usePortfolioForm({
  initialData,
  onAutoSave,
  autoSaveDelay = 2000,
}: UsePortfolioFormOptions = {}) {
  const [data, setData] = useState<PortfolioData>(
    initialData ?? createEmptyPortfolio()
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-save effect
  useEffect(() => {
    if (!isDirty || !onAutoSave) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      setError(null);
      try {
        await onAutoSave(data);
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [data, isDirty, onAutoSave, autoSaveDelay]);

  const updateData = useCallback((newData: PortfolioData) => {
    setData(newData);
    setIsDirty(true);
  }, []);

  const updateTheme = useCallback((themeId: ThemeId) => {
    setData((prev) => ({
      ...prev,
      portfolio: { ...prev.portfolio, themeId },
    }));
    setIsDirty(true);
  }, []);

  const resetForm = useCallback(() => {
    setData(initialData ?? createEmptyPortfolio());
    setIsDirty(false);
    setError(null);
  }, [initialData]);

  const manualSave = useCallback(async () => {
    if (!onAutoSave) return;

    setIsSaving(true);
    setError(null);
    try {
      await onAutoSave(data);
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [data, onAutoSave]);

  return {
    data,
    setData: updateData,
    selectedTheme: data.portfolio.themeId,
    setSelectedTheme: updateTheme,
    isDirty,
    isSaving,
    lastSaved,
    error,
    resetForm,
    manualSave,
  };
}
