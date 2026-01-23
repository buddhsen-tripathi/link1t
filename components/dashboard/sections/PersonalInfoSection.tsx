"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Portfolio } from "@/types/portfolio";

interface PersonalInfoSectionProps {
  portfolio: Portfolio;
  onChange: (updates: Partial<Portfolio>) => void;
}

export function PersonalInfoSection({ portfolio, onChange }: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, create a local preview URL
    // TODO: Replace with actual R2 upload
    const previewUrl = URL.createObjectURL(file);
    onChange({ profileImageUrl: previewUrl });
  };

  const removeImage = () => {
    onChange({ profileImageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-sm text-muted-foreground">
            <p>Upload a profile photo</p>
            <p>JPG, PNG up to 5MB</p>
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
    </div>
  );
}
