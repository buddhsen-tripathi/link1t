"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AboutSectionProps {
  bio: string;
  onChange: (bio: string) => void;
}

export function AboutSection({ bio, onChange }: AboutSectionProps) {
  const maxLength = 2000;
  const charCount = bio.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="bio">Bio</Label>
        <span className="text-xs text-muted-foreground">
          {charCount}/{maxLength}
        </span>
      </div>
      <Textarea
        id="bio"
        value={bio}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a brief introduction about yourself, your background, and what you're passionate about..."
        className="min-h-[150px] resize-none"
        maxLength={maxLength}
      />
      <p className="text-xs text-muted-foreground">
        Tell visitors about your background, skills, and what drives you.
      </p>
    </div>
  );
}
