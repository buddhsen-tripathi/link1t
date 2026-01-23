"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createEmptyPortfolio, type PortfolioData, type ThemeId } from "@/types/portfolio";

const STORAGE_KEY = "link1t_draft";

interface DraftData {
  data: PortfolioData;
  username: string;
  selectedTheme: ThemeId;
  savedAt: number;
}

function loadDraftFromStorage(): DraftData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveDraftToStorage(draft: DraftData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

function clearDraftFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

export default function DashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState<PortfolioData>(createEmptyPortfolio());
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("brutalist");

  // Save/publish state
  const [username, setUsername] = useState("");
  const [usernameChangedAt, setUsernameChangedAt] = useState<string | null>(null);
  const serverUsername = useRef<string>("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  // Track initial load to prevent marking as dirty on first load
  const isInitialLoad = useRef(true);

  // Load existing portfolio data on mount
  useEffect(() => {
    async function loadPortfolio() {
      // First, check for local draft
      const draft = loadDraftFromStorage();

      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const result = await response.json();
          const serverUpdatedAt = result.data?.portfolio?.updatedAt
            ? new Date(result.data.portfolio.updatedAt).getTime()
            : 0;

          // Always load usernameChangedAt from server if available
          if (result.usernameChangedAt) {
            setUsernameChangedAt(result.usernameChangedAt);
          }
          if (result.username) {
            setUsername(result.username);
            serverUsername.current = result.username;
          }

          // If we have a local draft that's newer than server data, use it
          if (draft && draft.savedAt > serverUpdatedAt) {
            setData(draft.data);
            setSelectedTheme(draft.selectedTheme);
            // Keep server username if draft has different one (avoid lockout issues)
            if (!result.username) {
              setUsername(draft.username);
            }
            setIsPublished(draft.data.portfolio.isPublished || false);
            setHasLocalDraft(true);
            setIsDirty(true);
          } else if (result.data) {
            // Use server data
            setData(result.data);
            setSelectedTheme(result.data.portfolio.themeId || "brutalist");
            setIsPublished(result.data.portfolio.isPublished || false);
            setLastSaved(new Date());
            // Clear any stale local draft
            clearDraftFromStorage();
          } else if (draft) {
            // No server data but have local draft
            setData(draft.data);
            setSelectedTheme(draft.selectedTheme);
            setUsername(draft.username);
            setHasLocalDraft(true);
            setIsDirty(true);
          }
        } else if (draft) {
          // API failed but have local draft
          setData(draft.data);
          setSelectedTheme(draft.selectedTheme);
          setUsername(draft.username);
          setHasLocalDraft(true);
          setIsDirty(true);
        }
      } catch (error) {
        console.error("Failed to load portfolio:", error);
        // Fall back to local draft if available
        if (draft) {
          setData(draft.data);
          setSelectedTheme(draft.selectedTheme);
          setUsername(draft.username);
          setHasLocalDraft(true);
          setIsDirty(true);
        }
      } finally {
        setIsLoading(false);
        // Mark initial load as complete after a short delay
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      }
    }

    if (user) {
      loadPortfolio();
    }
  }, [user]);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (isInitialLoad.current || isLoading) return;

    const draft: DraftData = {
      data,
      username,
      selectedTheme,
      savedAt: Date.now(),
    };
    saveDraftToStorage(draft);
  }, [data, username, selectedTheme, isLoading]);

  // Periodic auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (isInitialLoad.current || isLoading) return;

    const interval = setInterval(() => {
      const draft: DraftData = {
        data,
        username,
        selectedTheme,
        savedAt: Date.now(),
      };
      saveDraftToStorage(draft);
    }, 30000);

    return () => clearInterval(interval);
  }, [data, username, selectedTheme, isLoading]);

  // Handle data changes and mark as dirty
  const handleDataChange = useCallback((newData: PortfolioData) => {
    setData(newData);
    if (!isInitialLoad.current) {
      setIsDirty(true);
    }
  }, []);

  // Handle theme changes
  const handleThemeChange = useCallback((theme: ThemeId) => {
    setSelectedTheme(theme);
    setData((prev) => ({
      ...prev,
      portfolio: { ...prev.portfolio, themeId: theme },
    }));
    if (!isInitialLoad.current) {
      setIsDirty(true);
    }
  }, []);

  // Handle username changes
  const handleUsernameChange = useCallback((newUsername: string) => {
    setUsername(newUsername);
    if (!isInitialLoad.current) {
      setIsDirty(true);
    }
  }, []);

  // Save portfolio (keeps current publish state)
  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    const isUsernameChanging = username !== serverUsername.current;

    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          portfolio: {
            ...data.portfolio,
            themeId: selectedTheme,
            isPublished, // Keep current state
          },
          username,
        }),
      });

      if (response.ok) {
        setIsDirty(false);
        setLastSaved(new Date());
        setHasLocalDraft(false);
        clearDraftFromStorage();
        if (username && isUsernameChanging) {
          setUsernameChangedAt(new Date().toISOString());
          serverUsername.current = username;
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save portfolio");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save portfolio");
    } finally {
      setIsSaving(false);
    }
  }, [data, selectedTheme, username, isSaving, isPublished]);

  // Toggle publish state (publish if draft, unpublish if live)
  const handleTogglePublish = useCallback(async () => {
    if (isSaving) return;

    const newPublishState = !isPublished;
    setIsSaving(true);
    const isUsernameChanging = username !== serverUsername.current;

    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          portfolio: {
            ...data.portfolio,
            themeId: selectedTheme,
            isPublished: newPublishState,
          },
          username,
        }),
      });

      if (response.ok) {
        setIsDirty(false);
        setLastSaved(new Date());
        setHasLocalDraft(false);
        setIsPublished(newPublishState);
        clearDraftFromStorage();
        if (username && isUsernameChanging) {
          setUsernameChangedAt(new Date().toISOString());
          serverUsername.current = username;
        }
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${newPublishState ? "publish" : "unpublish"}`);
      }
    } catch (error) {
      console.error("Toggle publish failed:", error);
      alert(`Failed to ${newPublishState ? "publish" : "unpublish"}`);
    } finally {
      setIsSaving(false);
    }
  }, [data, selectedTheme, username, isSaving, isPublished]);

  // Save username only (for URL dialog)
  const handleSaveUsername = useCallback(async (newUsername: string) => {
    const isUsernameChanging = newUsername !== serverUsername.current;

    if (!isUsernameChanging) return;

    const response = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        portfolio: {
          ...data.portfolio,
          themeId: selectedTheme,
          isPublished: true, // Always publish when saving
        },
        username: newUsername,
      }),
    });

    if (response.ok) {
      setUsernameChangedAt(new Date().toISOString());
      serverUsername.current = newUsername;
      setLastSaved(new Date());
      setIsDirty(false);
      setHasLocalDraft(false);
      setIsPublished(true); // Mark as published
      clearDraftFromStorage();
    } else {
      const error = await response.json();
      throw new Error(error.error || "Failed to save username");
    }
  }, [data, selectedTheme, isPublished]);

  // Keyboard shortcut for save (Cmd+S / Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        // Trigger save if there are changes and username is set
        if (isDirty && username && !isSaving) {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, username, isSaving, handleSave]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardShell
      data={data}
      onDataChange={handleDataChange}
      selectedTheme={selectedTheme}
      onThemeChange={handleThemeChange}
      username={username}
      onUsernameChange={handleUsernameChange}
      usernameChangedAt={usernameChangedAt}
      isPublished={isPublished}
      isSaving={isSaving}
      isDirty={isDirty}
      lastSaved={lastSaved}
      onSave={handleSave}
      onTogglePublish={handleTogglePublish}
      onSaveUsername={handleSaveUsername}
    />
  );
}
