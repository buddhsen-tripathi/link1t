"use client";

import { useState } from "react";
import { AlertCircle, Check, Copy, Globe, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  usernameChangedAt: string | null;
  isPublished: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  onTogglePublish: () => void;
  onSaveUsername: (username: string) => Promise<void>;
}

export function PublishBar({
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
}: PublishBarProps) {
  // URL dialog state
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  // Save confirmation dialog state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Error dialog for missing username
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  // Saving username state
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  const [copied, setCopied] = useState(false);

  const publicUrl = username ? `${window.location.origin}/${username}` : "";
  const displayUrl = username ? `link1t.com/${username}` : "";

  // Calculate days until username can be changed
  const getDaysUntilChange = () => {
    if (!usernameChangedAt) return null;
    const lastChanged = new Date(usernameChangedAt);
    const now = new Date();
    const daysSinceChange = Math.floor(
      (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = 30 - daysSinceChange;
    return daysRemaining > 0 ? daysRemaining : null;
  };

  const daysUntilChange = getDaysUntilChange();
  const isUsernameLocked = daysUntilChange !== null && username;

  const handleCopyLink = async () => {
    if (publicUrl) {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // URL dialog handlers
  const handleSaveUsername = async () => {
    if (!tempUsername) return;
    setIsSavingUsername(true);
    try {
      await onSaveUsername(tempUsername);
      onUsernameChange(tempUsername);
      setIsUrlDialogOpen(false);
    } catch (error) {
      console.error("Failed to save username:", error);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleUrlDialogClose = () => {
    setIsUrlDialogOpen(false);
    setTempUsername(username);
  };

  // Save confirmation handlers
  const handleSaveClick = () => {
    if (!username) {
      // No username - show error dialog
      setIsErrorDialogOpen(true);
    } else {
      // Has username - show confirmation
      setIsSaveDialogOpen(true);
    }
  };

  const handleConfirmSave = () => {
    setIsSaveDialogOpen(false);
    onSave();
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
      {/* Left side - Save buttons */}
      <div className="flex items-center gap-3">
        {/* Save button with confirmation dialog */}
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveClick}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Save</DialogTitle>
              <DialogDescription>
                Review before saving your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-muted rounded-md text-center">
                <p className="text-xs text-muted-foreground mb-1">Your portfolio will be available at</p>
                <p className="font-mono text-lg font-semibold">{displayUrl}</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  This information will be publicly visible to anyone with the link.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSave}>
                  Confirm & Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Publish/Unpublish button */}
        <Button
          variant={isPublished ? "destructive" : "default"}
          size="sm"
          onClick={onTogglePublish}
          disabled={isSaving || !username}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {isPublished ? "Unpublish" : "Save & Publish"}
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

        {/* Error dialog for missing username */}
        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Public URL Required
              </DialogTitle>
              <DialogDescription>
                You need to set a public URL before you can save and publish your portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Your portfolio will be accessible at <span className="font-mono">link1t.com/your-username</span>.
                Please set your username first.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsErrorDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsErrorDialogOpen(false);
                  setIsUrlDialogOpen(true);
                }}>
                  Set Public URL
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right side - Publish controls */}
      <div className="flex items-center gap-4">
        {/* Username / URL Dialog */}
        <Dialog open={isUrlDialogOpen} onOpenChange={(open) => {
          if (!open) handleUrlDialogClose();
          else setIsUrlDialogOpen(true);
        }}>
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
              {isUsernameLocked ? (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Username locked</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can change your username again in {daysUntilChange} day
                    {daysUntilChange === 1 ? "" : "s"}.
                  </p>
                </div>
              ) : (
                <>
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
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Username can only be changed once every 30 days
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={handleUrlDialogClose} disabled={isSavingUsername}>
                  Cancel
                </Button>
                {!isUsernameLocked && (
                  <Button onClick={handleSaveUsername} disabled={!tempUsername || isSavingUsername}>
                    {isSavingUsername ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save URL"
                    )}
                  </Button>
                )}
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

        {/* Status indicator */}
        {username && (
          <span className={`text-xs px-2 py-1 rounded ${isPublished ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
            {isPublished ? "Live" : "Draft"}
          </span>
        )}
      </div>
    </div>
  );
}
