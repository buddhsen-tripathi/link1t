"use client";

import { useMemo } from "react";
import type { PortfolioData } from "@/types/portfolio";
import { formatDate, getSectionVisibility } from "./config";

// Convert R2 key to download proxy URL — never expose raw R2 links
function toResumeDownloadUrl(resumeUrl: string): string {
  if (!resumeUrl) return "";
  // Already a proxy URL
  if (resumeUrl.startsWith("/api/download")) return resumeUrl;
  // R2 key (e.g. "documents/userId/file.pdf")
  if (resumeUrl.startsWith("documents/")) {
    return `/api/download?key=${encodeURIComponent(resumeUrl)}`;
  }
  // Legacy full R2 URL — extract the key after the domain
  try {
    const url = new URL(resumeUrl);
    const key = url.pathname.replace(/^\//, "");
    if (key.startsWith("documents/")) {
      return `/api/download?key=${encodeURIComponent(key)}`;
    }
  } catch {
    // Not a valid URL, return empty
  }
  return "";
}

export function useThemeData(data: PortfolioData) {
  const { portfolio, experiences, education, projects, skills, socialLinks, certifications = [], languages = [] } = data;

  // Memoize section visibility checks
  const sections = useMemo(() => getSectionVisibility(data), [data]);

  // Memoize formatted experiences with dates
  const formattedExperiences = useMemo(() =>
    experiences.map((exp) => ({
      ...exp,
      formattedStartDate: formatDate.longFormat(exp.startDate),
      formattedEndDate: exp.isCurrent ? "Present" : formatDate.longFormat(exp.endDate),
      dateRange: `${formatDate.longFormat(exp.startDate)} - ${exp.isCurrent ? "Present" : formatDate.longFormat(exp.endDate)}`,
      dashDateRange: `${formatDate.dashFormat(exp.startDate)} → ${exp.isCurrent ? "present" : formatDate.dashFormat(exp.endDate)}`,
    })),
    [experiences]
  );

  // Memoize formatted education with dates
  const formattedEducation = useMemo(() =>
    education.map((edu) => ({
      ...edu,
      formattedStartDate: formatDate.longFormat(edu.startDate),
      formattedEndDate: formatDate.longFormat(edu.endDate),
      dateRange: edu.startDate && edu.endDate
        ? `${formatDate.longFormat(edu.startDate)} - ${formatDate.longFormat(edu.endDate)}`
        : "",
    })),
    [education]
  );

  // Memoize formatted certifications with dates
  const formattedCertifications = useMemo(() =>
    certifications.map((cert) => ({
      ...cert,
      formattedIssueDate: formatDate.longFormat(cert.issueDate),
      formattedExpiryDate: cert.expiryDate ? formatDate.longFormat(cert.expiryDate) : "",
    })),
    [certifications]
  );

  // Featured projects first, then the rest
  const sortedProjects = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    return [...featured, ...rest];
  }, [projects]);

  // Portfolio with safe resume URL (never expose R2 link)
  const safePortfolio = useMemo(() => ({
    ...portfolio,
    resumeUrl: toResumeDownloadUrl(portfolio.resumeUrl),
  }), [portfolio]);

  return {
    // Raw data
    portfolio: safePortfolio,
    experiences: formattedExperiences,
    education: formattedEducation,
    projects: sortedProjects,
    skills,
    socialLinks,
    certifications: formattedCertifications,
    languages,

    // Section visibility
    sections,

    // Utility functions bound to this data
    formatDate,
  };
}

export type ThemeData = ReturnType<typeof useThemeData>;
