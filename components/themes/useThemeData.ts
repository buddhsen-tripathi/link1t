"use client";

import { useMemo } from "react";
import type { PortfolioData } from "@/types/portfolio";
import { formatDate, getSectionVisibility } from "./config";

export function useThemeData(data: PortfolioData) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

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

  return {
    // Raw data
    portfolio,
    experiences: formattedExperiences,
    education: formattedEducation,
    projects,
    skills,
    socialLinks,

    // Section visibility
    sections,

    // Utility functions bound to this data
    formatDate,
  };
}

export type ThemeData = ReturnType<typeof useThemeData>;
