"use client";

import { useState } from "react";
import { Check, Copy, Globe, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PublishBarProps {
  username: string;
  onUsernameChange: (username: string) => void;
  isPublished: boolean;
  onPublishChange: (published: boolean) => void;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  onSave: () => void;
}

export function PublishBar({
  username,
  onUsernameChange,
  isPublished,
  onPublishChange,
  isSaving,
  isDirty,
  lastSaved,
  onSave,
}: PublishBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [copied, setCopied] = useState(false);

  const publicUrl = username ? `${window.location.origin}/${username}` : "";

  const handleCopyLink = async () => {
    if (publicUrl) {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveUsername = () => {
    onUsernameChange(tempUsername);
    setIsDialogOpen(false);
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="h-14 border-t border-dashed border-border px-4 flex items-center justify-between bg-background shrink-0">
      {/* Left side - Save status */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <span className="text-xs text-muted-foreground">
          {isSaving
            ? "Saving changes..."
            : isDirty
            ? "Unsaved changes"
            : lastSaved
            ? `Saved ${formatLastSaved(lastSaved)}`
            : "No changes"}
        </span>
      </div>

      {/* Right side - Publish controls */}
      <div className="flex items-center gap-4">
        {/* Username / URL */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              {username ? (
                <span className="font-mono text-xs">{username}</span>
              ) : (
                <span className="text-xs">Set URL</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Public URL</DialogTitle>
              <DialogDescription>
                Choose a unique username for your portfolio URL
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">link1t.com/</span>
                  <Input
                    value={tempUsername}
                    onChange={(e) =>
                      setTempUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    placeholder="your-name"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUsername} disabled={!tempUsername}>
                  Save URL
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Copy link button */}
        {username && isPublished && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Copy Link</span>
              </>
            )}
          </Button>
        )}

        {/* Publish toggle */}
        <div className="flex items-center gap-2">
          <Label htmlFor="publish-toggle" className="text-sm">
            {isPublished ? "Published" : "Draft"}
          </Label>
          <Switch
            id="publish-toggle"
            checked={isPublished}
            onCheckedChange={onPublishChange}
            disabled={!username}
          />
        </div>
      </div>
    </div>
  );
}
