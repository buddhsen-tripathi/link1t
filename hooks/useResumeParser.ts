"use client";

import { useState, useCallback, useEffect } from "react";

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

interface RateLimitStatus {
  remaining: number;
  total: number;
  resetInMinutes: number | null;
  windowMinutes: number;
}

export function useResumeParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitStatus | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchRateLimit = useCallback(async () => {
    try {
      const response = await fetch("/api/parse-resume");
      if (response.ok) {
        const data = await response.json();
        setRateLimit(data);
        setIsRateLimited(data.remaining === 0);
      }
    } catch {
      // Silently fail - rate limit display is optional
    }
  }, []);

  const parseResume = async (file: File): Promise<ParsedResume | null> => {
    setIsParsing(true);
    setError(null);
    setParsedData(null);
    setIsRateLimited(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setIsRateLimited(true);
          setRateLimit({
            remaining: 0,
            total: 3,
            resetInMinutes: data.resetInMinutes,
            windowMinutes: 30
          });
        }
        throw new Error(data.error || "Failed to parse resume");
      }

      // Update rate limit from response
      if (data._rateLimit) {
        setRateLimit({
          remaining: data._rateLimit.remaining,
          total: 3,
          resetInMinutes: data._rateLimit.resetInMinutes,
          windowMinutes: 30
        });
        delete data._rateLimit;
      }

      setParsedData(data);
      return data;
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
    setIsRateLimited(false);
  };

  return {
    parseResume,
    isParsing,
    error,
    parsedData,
    reset,
    rateLimit,
    isRateLimited,
    fetchRateLimit,
  };
}
