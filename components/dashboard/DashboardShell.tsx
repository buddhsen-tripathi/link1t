"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioForm } from "./PortfolioForm";
import { PreviewPanel } from "./PreviewPanel";
import { ResumeUploader } from "./ResumeUploader";
import { PublishBar } from "./PublishBar";
import type { PortfolioData, ThemeId } from "@/types/portfolio";

interface DashboardShellProps {
  data: PortfolioData;
  onDataChange: (data: PortfolioData) => void;
  selectedTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  // Save/Publish props
  username: string;
  onUsernameChange: (username: string) => void;
  usernameChangedAt: string | null;
  isPublished: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  onTogglePublish: () => void;
  onSaveUsername: (username: string) => Promise<void>;
}

export function DashboardShell({
  data,
  onDataChange,
  selectedTheme,
  onThemeChange,
  username,
  onUsernameChange,
  usernameChangedAt,
  isPublished,
  isSaving,
  isDirty,
  lastSaved,
  onSave,
  onTogglePublish,
  onSaveUsername,
}: DashboardShellProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-14 border-b border-dashed border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-serif text-lg font-semibold">Edit Portfolio</span>
        </div>
        <div className="flex items-center gap-3">
          <ResumeUploader
            onApply={(parsedData) => {
              onDataChange({
                ...data,
                portfolio: { ...data.portfolio, ...parsedData.portfolio },
                experiences: parsedData.experiences || data.experiences,
                education: parsedData.education || data.education,
                skills: parsedData.skills || data.skills,
                socialLinks: parsedData.socialLinks || data.socialLinks,
                certifications: parsedData.certifications || data.certifications,
                languages: parsedData.languages || data.languages,
              });
            }}
          />
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </header>

      {/* Mobile: Tabs layout */}
      <div className="flex-1 overflow-hidden lg:hidden">
        <Tabs defaultValue="edit" className="flex flex-col h-full">
          <TabsList className="w-full justify-start rounded-none border-b border-dashed border-border bg-transparent px-4 h-12">
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-foreground"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-foreground"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex-1 overflow-y-auto m-0 p-0">
            <PortfolioForm data={data} onDataChange={onDataChange} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-hidden m-0 p-0">
            <PreviewPanel
              data={data}
              selectedTheme={selectedTheme}
              onThemeChange={onThemeChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Split view */}
      <div className="hidden lg:grid lg:grid-cols-[1.5fr_1fr] flex-1 overflow-hidden">
        <div className="overflow-y-auto border-r border-dashed border-border">
          <PortfolioForm data={data} onDataChange={onDataChange} />
        </div>
        <div className="overflow-hidden bg-muted/30">
          <PreviewPanel
            data={data}
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>

      {/* Footer - Publish bar */}
      <PublishBar
        username={username}
        onUsernameChange={onUsernameChange}
        usernameChangedAt={usernameChangedAt}
        isPublished={isPublished}
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        onSave={onSave}
        onTogglePublish={onTogglePublish}
        onSaveUsername={onSaveUsername}
      />
    </div>
  );
}
