"use client";

import { useState } from "react";

interface ParsedResume {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experiences?: Array<{
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: Array<{
    name: string;
    category?: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export function useResumeParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  const parseResume = async (file: File): Promise<ParsedResume | null> => {
    setIsParsing(true);
    setError(null);
    setParsedData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to parse resume");
      }

      const result: ParsedResume = await response.json();
      setParsedData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse resume";
      setError(message);
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setIsParsing(false);
    setError(null);
    setParsedData(null);
  };

  return {
    parseResume,
    isParsing,
    error,
    parsedData,
    reset,
  };
}
