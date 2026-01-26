"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, Loader2, Check, X, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useResumeParser } from "@/hooks/useResumeParser";
import { generateId, DEFAULT_SECTION_ORDER, type PortfolioData, type Experience, type Education, type Skill, type SocialLink, type SocialPlatform } from "@/types/portfolio";

interface ResumeUploaderProps {
  onApply: (data: Partial<PortfolioData>) => void;
}

export function ResumeUploader({ onApply }: ResumeUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseResume, isParsing, error, parsedData, reset, rateLimit, isRateLimited, fetchRateLimit } = useResumeParser();

  // Fetch rate limit when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchRateLimit();
    }
  }, [isOpen, fetchRateLimit]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      parseResume(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      parseResume(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleApply = () => {
    if (!parsedData) return;

    // Convert parsed data to PortfolioData format
    const convertedData: Partial<PortfolioData> = {
      portfolio: {
        id: "",
        userId: "",
        fullName: parsedData.fullName || "",
        title: parsedData.title || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: parsedData.location || "",
        profileImageUrl: "",
        bio: parsedData.bio || "",
        themeId: "brutalist",
        sectionOrder: DEFAULT_SECTION_ORDER,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    if (parsedData.experiences) {
      convertedData.experiences = parsedData.experiences.map((exp, index): Experience => ({
        id: generateId(),
        portfolioId: "",
        company: exp.company,
        position: exp.position,
        location: exp.location || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        isCurrent: exp.isCurrent || false,
        description: exp.description || "",
        displayOrder: index,
      }));
    }

    if (parsedData.education) {
      convertedData.education = parsedData.education.map((edu, index): Education => ({
        id: generateId(),
        portfolioId: "",
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        description: "",
        displayOrder: index,
      }));
    }

    if (parsedData.skills) {
      convertedData.skills = parsedData.skills.map((skill, index): Skill => ({
        id: generateId(),
        portfolioId: "",
        name: skill.name,
        category: skill.category || "Other",
        proficiencyLevel: 3,
        displayOrder: index,
      }));
    }

    if (parsedData.socialLinks) {
      convertedData.socialLinks = parsedData.socialLinks
        .filter((link) => ["github", "linkedin", "twitter", "website"].includes(link.platform))
        .map((link, index): SocialLink => ({
          id: generateId(),
          portfolioId: "",
          platform: link.platform as SocialPlatform,
          url: link.url,
          displayOrder: index,
        }));
    }

    onApply(convertedData);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Import Resume
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import from Resume</DialogTitle>
            <DialogDescription>
              Upload your resume PDF and we'll extract your information automatically using AI.
            </DialogDescription>
          </DialogHeader>

          {/* Rate Limit Indicator */}
          {rateLimit && (
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
              rateLimit.remaining === 0
                ? "bg-destructive/10 text-destructive"
                : rateLimit.remaining === 1
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-muted text-muted-foreground"
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {rateLimit.remaining}/{rateLimit.total} AI uses remaining
                </span>
              </div>
              {rateLimit.resetInMinutes !== null && rateLimit.remaining < rateLimit.total && (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Resets in {rateLimit.resetInMinutes}m</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {/* Rate Limited State */}
            {isRateLimited && !selectedFile && (
              <div className="border border-destructive/50 bg-destructive/5 rounded-lg p-6 text-center">
                <Clock className="w-10 h-10 mx-auto text-destructive mb-3" />
                <p className="font-medium text-destructive">Rate Limit Reached</p>
                <p className="text-sm text-muted-foreground mt-2">
                  You've used all 3 AI parses for this 30-minute window.
                </p>
                {rateLimit?.resetInMinutes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Try again in <span className="font-medium">{rateLimit.resetInMinutes} minutes</span>.
                  </p>
                )}
              </div>
            )}

            {/* Upload area */}
            {!selectedFile && !isRateLimited && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your PDF resume here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Only PDF files are supported
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Processing state */}
            {selectedFile && isParsing && (
              <div className="border border-border rounded-lg p-8 text-center">
                <Loader2 className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
                <p className="text-sm font-medium">Analyzing your resume...</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This may take a few seconds
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="border border-destructive rounded-lg p-4 text-center">
                <X className="w-8 h-8 mx-auto text-destructive mb-2" />
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    reset();
                  }}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Success state with preview */}
            {parsedData && !isParsing && !error && (
              <div className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Resume parsed successfully!</span>
                </div>

                <div className="space-y-2 text-sm">
                  {parsedData.fullName && (
                    <p>
                      <span className="text-muted-foreground">Name:</span> {parsedData.fullName}
                    </p>
                  )}
                  {parsedData.title && (
                    <p>
                      <span className="text-muted-foreground">Title:</span> {parsedData.title}
                    </p>
                  )}
                  {parsedData.experiences && parsedData.experiences.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Experience:</span>{" "}
                      {parsedData.experiences.length} position(s)
                    </p>
                  )}
                  {parsedData.education && parsedData.education.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Education:</span>{" "}
                      {parsedData.education.length} entry(ies)
                    </p>
                  )}
                  {parsedData.skills && parsedData.skills.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Skills:</span>{" "}
                      {parsedData.skills.length} skill(s)
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleApply} className="flex-1">
                    Apply to Portfolio
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedFile(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
