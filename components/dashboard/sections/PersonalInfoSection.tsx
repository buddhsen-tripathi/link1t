"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Portfolio } from "@/types/portfolio";

interface PersonalInfoSectionProps {
  portfolio: Portfolio;
  onChange: (updates: Partial<Portfolio>) => void;
}

export function PersonalInfoSection({ portfolio, onChange }: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      onChange({ profileImageUrl: result.url });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    onChange({ profileImageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    setResumeUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      onChange({ resumeUrl: result.url });
    } catch (error) {
      console.error("Resume upload error:", error);
      setResumeUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  };

  const removeResume = () => {
    onChange({ resumeUrl: "" });
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Image */}
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          {portfolio.profileImageUrl ? (
            <div className="relative">
              <img
                src={portfolio.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 object-cover border border-border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isUploading}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`w-20 h-20 border border-dashed border-border flex items-center justify-center transition-colors ${
                isUploading ? "cursor-not-allowed bg-muted/30" : "cursor-pointer hover:bg-muted/50"
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <div className="text-sm text-muted-foreground">
            <p>{isUploading ? "Uploading..." : "Upload a profile photo"}</p>
            <p>JPG, PNG up to 5MB</p>
            {uploadError && (
              <p className="text-destructive mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={portfolio.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Professional Title</Label>
        <Input
          id="title"
          value={portfolio.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Senior Software Engineer"
        />
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={portfolio.headline || ""}
          onChange={(e) => onChange({ headline: e.target.value.slice(0, 120) })}
          placeholder="Building the future of web development"
          maxLength={120}
        />
        <p className="text-xs text-muted-foreground">
          Short tagline — {(portfolio.headline || "").length}/120 characters
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={portfolio.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={portfolio.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={portfolio.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>

      {/* Resume Upload */}
      <div className="space-y-2">
        <Label>Resume / CV</Label>
        <div className="flex items-center gap-4">
          {portfolio.resumeUrl ? (
            <div className="flex items-center gap-3 px-3 py-2 border border-border bg-muted/30">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <a
                href={portfolio.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline truncate max-w-[200px]"
              >
                Resume uploaded
              </a>
              <button
                onClick={removeResume}
                className="p-1 hover:bg-destructive/10 text-destructive"
                disabled={isUploadingResume}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isUploadingResume && resumeInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 border border-dashed border-border transition-colors ${
                isUploadingResume ? "cursor-not-allowed bg-muted/30" : "cursor-pointer hover:bg-muted/50"
              }`}
            >
              {isUploadingResume ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {isUploadingResume ? "Uploading..." : "Upload resume"}
              </span>
            </div>
          )}
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
            disabled={isUploadingResume}
          />
        </div>
        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
        {resumeUploadError && (
          <p className="text-xs text-destructive">{resumeUploadError}</p>
        )}
      </div>
    </div>
  );
}
