"use client";

import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter, Download, Award } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";
import { useThemeData } from "./useThemeData";

const EMPLOYMENT_TYPES_MAP: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'freelance': 'Freelance',
  'internship': 'Internship',
};

const SocialIcon = ({ platform }: { platform: SocialPlatform }) => {
  switch (platform) {
    case "github":
      return <Github className="w-3.5 h-3.5" />;
    case "linkedin":
      return <Linkedin className="w-3.5 h-3.5" />;
    case "twitter":
      return <Twitter className="w-3.5 h-3.5" />;
    default:
      return <ExternalLink className="w-3.5 h-3.5" />;
  }
};

export function PaperTheme({ data }: { data: PortfolioData; isPreview?: boolean }) {
  const { portfolio, experiences, education, projects, skills, socialLinks, certifications, languages, sections } = useThemeData(data);

  return (
    <div
      className="min-h-screen font-serif"
      style={{ backgroundColor: "#d4c5a9" }}
    >
      <div
        className="max-w-[780px] mx-auto shadow-2xl relative"
        style={{
          backgroundColor: "#f5f0e1",
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(180,160,120,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(160,140,100,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(170,150,110,0.05) 0%, transparent 50%)
          `,
        }}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: "#c4b48a" }} />

        <div className="px-10 md:px-16 py-12 md:py-16">
          {/* Header */}
          <header className="text-center mb-10">
            {sections.hasProfileImage && (
              <div className="mb-5 flex justify-center">
                <img
                  src={portfolio.profileImageUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 rounded-full object-cover sepia-[.25] border-2"
                  style={{ borderColor: "#b8a88a" }}
                />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide uppercase" style={{ color: "#3d3425" }}>
              {portfolio.fullName || "Your Name"}
            </h1>
            {sections.hasTitle && (
              <p className="mt-2 text-base italic" style={{ color: "#7a6b52" }}>{portfolio.title}</p>
            )}
            {sections.hasHeadline && (
              <p className="mt-1 text-sm" style={{ color: "#a09380" }}>{portfolio.headline}</p>
            )}

            <div className="mt-5 flex items-center justify-center gap-3" style={{ color: "#c4b48a" }}>
              <div className="h-px w-16" style={{ backgroundColor: "#c4b48a" }} />
              <span className="text-sm">&#10044;</span>
              <div className="h-px w-16" style={{ backgroundColor: "#c4b48a" }} />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "#8c7d65" }}>
              {sections.hasEmail && (
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1 hover:underline underline-offset-2">
                  <Mail className="w-3 h-3" />
                  {portfolio.email}
                </a>
              )}
              {sections.hasPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {portfolio.phone}
                </span>
              )}
              {sections.hasLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {portfolio.location}
                </span>
              )}
              {sections.hasResumeUrl && (
                <a href={portfolio.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline underline-offset-2">
                  <Download className="w-3 h-3" />
                  Resume
                </a>
              )}
            </div>
          </header>

          <main className="space-y-9">
            {/* Bio */}
            {sections.hasBio && (
              <section>
                <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-center max-w-xl mx-auto" style={{ color: "#5c4f3c" }}>
                  &ldquo;{portfolio.bio}&rdquo;
                </p>
              </section>
            )}

            {/* Experience */}
            {sections.hasExperiences && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Experience</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-5" style={{ borderLeft: "1px solid #d4c5a9" }}>
                      <div className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full -translate-x-[4px]" style={{ backgroundColor: "#b8a88a" }} />
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-sm" style={{ color: "#3d3425" }}>{exp.position}</h3>
                          <p className="text-xs italic" style={{ color: "#7a6b52" }}>
                            {exp.companyUrl ? (
                              <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{exp.company}</a>
                            ) : exp.company}
                            {exp.employmentType && ` · ${EMPLOYMENT_TYPES_MAP[exp.employmentType]}`}
                            {exp.location ? `, ${exp.location}` : ""}
                          </p>
                        </div>
                        <span className="text-[10px] tracking-wide" style={{ color: "#a09380" }}>{exp.dateRange}</span>
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "#6b5e4a" }}>{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {sections.hasEducation && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Education</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline flex-wrap gap-2">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: "#3d3425" }}>
                          {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                        </h3>
                        <p className="text-xs italic" style={{ color: "#7a6b52" }}>{edu.institution}</p>
                      </div>
                      {edu.dateRange && (
                        <span className="text-[10px] tracking-wide" style={{ color: "#a09380" }}>{edu.dateRange}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {sections.hasProjects && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Projects</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <div className="space-y-5">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-bold text-sm" style={{ color: "#3d3425" }}>
                          {project.name}
                          {project.featured && <span className="text-xs ml-1" style={{ color: "#b8a88a" }}>★</span>}
                        </h3>
                        <div className="flex gap-1.5">
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70" style={{ color: "#a09380" }}>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70" style={{ color: "#a09380" }}>
                              <Github className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-xs mt-1" style={{ color: "#6b5e4a" }}>{project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 border" style={{ color: "#7a6b52", borderColor: "#d4c5a9", backgroundColor: "rgba(196,180,138,0.1)" }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {sections.hasSkills && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Skills</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <p className="text-xs text-center leading-relaxed" style={{ color: "#6b5e4a" }}>
                  {skills.map((s) => s.name).join("  \u2022  ")}
                </p>
              </section>
            )}

            {/* Certifications */}
            {sections.hasCertifications && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Certifications</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline flex-wrap gap-2">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: "#3d3425" }}>
                          {cert.credentialUrl ? (
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{cert.name}</a>
                          ) : cert.name}
                        </h3>
                        <p className="text-xs italic" style={{ color: "#7a6b52" }}>{cert.issuer}</p>
                      </div>
                      {cert.formattedIssueDate && (
                        <span className="text-[10px] tracking-wide" style={{ color: "#a09380" }}>
                          {cert.formattedIssueDate}{cert.formattedExpiryDate && ` — ${cert.formattedExpiryDate}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {sections.hasLanguages && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#7a6b52" }}>Languages</h2>
                  <div className="flex-1 h-px" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <p className="text-xs text-center leading-relaxed" style={{ color: "#6b5e4a" }}>
                  {languages.map((l) => `${l.name} (${l.proficiency})`).join("  \u2022  ")}
                </p>
              </section>
            )}

            {/* Social Links */}
            {sections.hasSocialLinks && (
              <section className="pt-4">
                <div className="flex items-center justify-center gap-3 mb-4" style={{ color: "#c4b48a" }}>
                  <div className="h-px w-12" style={{ backgroundColor: "#c4b48a" }} />
                  <span className="text-sm">&#10044;</span>
                  <div className="h-px w-12" style={{ backgroundColor: "#c4b48a" }} />
                </div>
                <div className="flex justify-center gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border hover:opacity-70 transition-opacity"
                      style={{ color: "#7a6b52", borderColor: "#c4b48a" }}
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>

        <div className="h-1.5 w-full" style={{ backgroundColor: "#c4b48a" }} />
      </div>
    </div>
  );
}

export const paperThemeConfig = {
  id: 'paper' as const,
  name: 'Paper',
  description: 'Aged parchment & vintage ink',
  component: PaperTheme,
};
