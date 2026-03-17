"use client";

import { useMemo } from "react";
import type { PortfolioData, SocialLink } from "@/types/portfolio";
import { formatDate, getSectionVisibility, SOCIAL_PLATFORM_URLS } from "./config";

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

  // Ensure social link URLs are absolute (not bare usernames that resolve as relative paths)
  const normalizedSocialLinks = useMemo(() =>
    socialLinks.map((link: SocialLink) => {
      const url = link.url?.trim();
      if (!url) return link;
      // Already a full URL
      if (url.startsWith("http://") || url.startsWith("https://")) return link;
      // Has a dot — treat as domain (e.g. "github.com/user")
      if (url.includes(".")) return { ...link, url: `https://${url}` };
      // Bare username or path — prepend platform base URL
      const baseUrl = SOCIAL_PLATFORM_URLS[link.platform];
      if (baseUrl) {
        // Strip platform domain prefix if already present to avoid duplication
        // e.g. "github/user" for github platform → strip "github/" → "user"
        const domain = new URL(baseUrl).hostname.replace("www.", "");
        const domainName = domain.split(".")[0]; // "github" from "github.com"
        const stripped = url.startsWith(`${domainName}/`)
          ? url.slice(domainName.length + 1)
          : url;
        return { ...link, url: `${baseUrl}${stripped}` };
      }
      return { ...link, url: `https://${url}` };
    }),
    [socialLinks]
  );

  return {
    // Raw data
    portfolio: safePortfolio,
    experiences: formattedExperiences,
    education: formattedEducation,
    projects: sortedProjects,
    skills,
    socialLinks: normalizedSocialLinks,
    certifications: formattedCertifications,
    languages,

    // Section visibility
    sections,

    // Utility functions bound to this data
    formatDate,
  };
}

export type ThemeData = ReturnType<typeof useThemeData>;
