"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, GripVertical, Eye, EyeOff } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SocialLinksSection } from "./sections/SocialLinksSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import type { PortfolioData, Portfolio, Experience, Education, Project, Skill, SocialLink, SectionKey, Certification, Language } from "@/types/portfolio";

interface PortfolioFormProps {
  data: PortfolioData;
  onDataChange: (data: PortfolioData) => void;
}

const SECTION_TITLES: Record<SectionKey, string> = {
  experiences: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  socialLinks: "Social Links",
  certifications: "Certifications",
  languages: "Languages",
};

interface SortableSectionProps {
  id: SectionKey;
  title: string;
  isExpanded: boolean;
  isHidden: boolean;
  onToggle: () => void;
  onToggleVisibility: () => void;
  children: React.ReactNode;
}

function SortableSection({ id, title, isExpanded, isHidden, onToggle, onToggleVisibility, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-dashed border-border bg-background",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div
        className={cn(
          "flex items-center",
          isExpanded && "border-b border-dashed border-border"
        )}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-4 cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between p-4 pl-0 text-left hover:bg-muted/50 transition-colors"
        >
          <span className={cn("font-medium", isHidden && "text-muted-foreground line-through")}>
            {title}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onToggleVisibility}
          className="p-4 hover:bg-muted/50 transition-colors"
          aria-label={isHidden ? "Show section" : "Hide section"}
          title={isHidden ? "Section hidden from portfolio" : "Section visible in portfolio"}
        >
          {isHidden ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  );
}

export function PortfolioForm({ data, onDataChange }: PortfolioFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal"])
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (key: string) => {
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

  const updateCertifications = (certifications: Certification[]) => {
    onDataChange({ ...data, certifications });
  };

  const updateLanguages = (languages: Language[]) => {
    onDataChange({ ...data, languages });
  };

  const toggleSectionVisibility = (sectionKey: SectionKey) => {
    const hiddenSections = data.portfolio.hiddenSections || [];
    const isHidden = hiddenSections.includes(sectionKey);
    const newHidden = isHidden
      ? hiddenSections.filter((s) => s !== sectionKey)
      : [...hiddenSections, sectionKey];
    updatePortfolio({ hiddenSections: newHidden });
  };

  const isSectionHidden = (sectionKey: SectionKey) => {
    return (data.portfolio.hiddenSections || []).includes(sectionKey);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.portfolio.sectionOrder.indexOf(active.id as SectionKey);
      const newIndex = data.portfolio.sectionOrder.indexOf(over.id as SectionKey);

      const newOrder = arrayMove(data.portfolio.sectionOrder, oldIndex, newIndex);
      updatePortfolio({ sectionOrder: newOrder });
    }
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case "experiences":
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
      case "socialLinks":
        return (
          <SocialLinksSection
            socialLinks={data.socialLinks}
            onChange={updateSocialLinks}
          />
        );
      case "certifications":
        return (
          <CertificationsSection
            certifications={data.certifications || []}
            onChange={updateCertifications}
          />
        );
      case "languages":
        return (
          <LanguagesSection
            languages={data.languages || []}
            onChange={updateLanguages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-2">
      {/* Personal Info - Always first, not draggable */}
      <div className="border border-dashed border-border">
        <button
          onClick={() => toggleSection("personal")}
          className={cn(
            "w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors",
            expandedSections.has("personal") && "border-b border-dashed border-border"
          )}
        >
          <span className="font-medium">Personal Info</span>
          {expandedSections.has("personal") ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.has("personal") && (
          <div className="p-4">
            <PersonalInfoSection
              portfolio={data.portfolio}
              onChange={updatePortfolio}
            />
          </div>
        )}
      </div>

      {/* About - Always second, not draggable */}
      <div className="border border-dashed border-border">
        <button
          onClick={() => toggleSection("about")}
          className={cn(
            "w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors",
            expandedSections.has("about") && "border-b border-dashed border-border"
          )}
        >
          <span className="font-medium">About</span>
          {expandedSections.has("about") ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.has("about") && (
          <div className="p-4">
            <AboutSection
              bio={data.portfolio.bio}
              onChange={(bio) => updatePortfolio({ bio })}
            />
          </div>
        )}
      </div>

      {/* Draggable sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.portfolio.sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {data.portfolio.sectionOrder.map((sectionKey) => (
            <SortableSection
              key={sectionKey}
              id={sectionKey}
              title={SECTION_TITLES[sectionKey]}
              isExpanded={expandedSections.has(sectionKey)}
              isHidden={isSectionHidden(sectionKey)}
              onToggle={() => toggleSection(sectionKey)}
              onToggleVisibility={() => toggleSectionVisibility(sectionKey)}
            >
              {renderSectionContent(sectionKey)}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
