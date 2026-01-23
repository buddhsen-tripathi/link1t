"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SocialLinksSection } from "./sections/SocialLinksSection";
import type { PortfolioData, Portfolio, Experience, Education, Project, Skill, SocialLink } from "@/types/portfolio";

interface PortfolioFormProps {
  data: PortfolioData;
  onDataChange: (data: PortfolioData) => void;
}

type SectionKey = "personal" | "about" | "experience" | "education" | "projects" | "skills" | "social";

const sections: { key: SectionKey; title: string }[] = [
  { key: "personal", title: "Personal Info" },
  { key: "about", title: "About" },
  { key: "experience", title: "Experience" },
  { key: "education", title: "Education" },
  { key: "projects", title: "Projects" },
  { key: "skills", title: "Skills" },
  { key: "social", title: "Social Links" },
];

export function PortfolioForm({ data, onDataChange }: PortfolioFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(["personal"])
  );

  const toggleSection = (key: SectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const updatePortfolio = (updates: Partial<Portfolio>) => {
    onDataChange({
      ...data,
      portfolio: { ...data.portfolio, ...updates },
    });
  };

  const updateExperiences = (experiences: Experience[]) => {
    onDataChange({ ...data, experiences });
  };

  const updateEducation = (education: Education[]) => {
    onDataChange({ ...data, education });
  };

  const updateProjects = (projects: Project[]) => {
    onDataChange({ ...data, projects });
  };

  const updateSkills = (skills: Skill[]) => {
    onDataChange({ ...data, skills });
  };

  const updateSocialLinks = (socialLinks: SocialLink[]) => {
    onDataChange({ ...data, socialLinks });
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case "personal":
        return (
          <PersonalInfoSection
            portfolio={data.portfolio}
            onChange={updatePortfolio}
          />
        );
      case "about":
        return (
          <AboutSection
            bio={data.portfolio.bio}
            onChange={(bio) => updatePortfolio({ bio })}
          />
        );
      case "experience":
        return (
          <ExperienceSection
            experiences={data.experiences}
            onChange={updateExperiences}
          />
        );
      case "education":
        return (
          <EducationSection
            education={data.education}
            onChange={updateEducation}
          />
        );
      case "projects":
        return (
          <ProjectsSection
            projects={data.projects}
            onChange={updateProjects}
          />
        );
      case "skills":
        return (
          <SkillsSection skills={data.skills} onChange={updateSkills} />
        );
      case "social":
        return (
          <SocialLinksSection
            socialLinks={data.socialLinks}
            onChange={updateSocialLinks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-2">
      {sections.map(({ key, title }) => {
        const isExpanded = expandedSections.has(key);
        return (
          <div key={key} className="border border-dashed border-border">
            <button
              onClick={() => toggleSection(key)}
              className={cn(
                "w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors",
                isExpanded && "border-b border-dashed border-border"
              )}
            >
              <span className="font-medium">{title}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {isExpanded && (
              <div className="p-4">{renderSectionContent(key)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
