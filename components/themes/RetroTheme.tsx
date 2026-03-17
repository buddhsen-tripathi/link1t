"use client";

import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter, Download } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";
import { useThemeData } from "./useThemeData";

const EMPLOYMENT_TYPES_MAP: Record<string, string> = {
  'full-time': 'full-time',
  'part-time': 'part-time',
  'contract': 'contract',
  'freelance': 'freelance',
  'internship': 'intern',
};

const SocialIcon = ({ platform }: { platform: SocialPlatform }) => {
  switch (platform) {
    case "github":
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "twitter":
      return <Twitter className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

export function RetroTheme({ data }: { data: PortfolioData; isPreview?: boolean }) {
  const { portfolio, experiences, education, projects, skills, socialLinks, certifications, languages, sections } = useThemeData(data);

  return (
    <div
      className="min-h-screen font-mono text-lime-100 selection:bg-lime-400 selection:text-black"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      <div className="relative z-0 max-w-3xl mx-auto px-6 py-10">
        <div className="border border-lime-500/30 mb-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-lime-500/10 border-b border-lime-500/30">
            <span className="text-xs text-lime-500/60">[x]</span>
            <span className="text-xs text-lime-400 flex-1 text-center tracking-widest uppercase">
              {portfolio.fullName || "portfolio"}.exe
            </span>
            <span className="text-xs text-lime-500/60">[_]</span>
          </div>

          <div className="p-6 md:p-8 space-y-8" style={{ backgroundColor: "#12122a" }}>
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start gap-6">
              {sections.hasProfileImage && (
                <div className="relative shrink-0">
                  <img
                    src={portfolio.profileImageUrl}
                    alt={portfolio.fullName}
                    className="w-24 h-24 object-cover border border-lime-500/40 grayscale brightness-110 contrast-110"
                  />
                  <div className="absolute inset-0 bg-lime-500/5 mix-blend-overlay" />
                </div>
              )}
              <div>
                <div className="text-lime-500/50 text-xs mb-1">&gt; LOADING USER PROFILE...</div>
                <h1 className="text-3xl font-bold text-lime-300 tracking-tight">
                  {portfolio.fullName || "USER_NAME"}
                </h1>
                {sections.hasTitle && (
                  <p className="mt-1 text-lime-500/80">[ {portfolio.title} ]</p>
                )}
                {sections.hasHeadline && (
                  <p className="mt-1 text-xs text-lime-500/50 italic">// {portfolio.headline}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-lime-500/60">
                  {sections.hasEmail && (
                    <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-lime-300 transition-colors">
                      <Mail className="w-3 h-3" />
                      {portfolio.email}
                    </a>
                  )}
                  {sections.hasPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3" />
                      {portfolio.phone}
                    </span>
                  )}
                  {sections.hasLocation && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {portfolio.location}
                    </span>
                  )}
                  {sections.hasResumeUrl && (
                    <a href={portfolio.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-lime-300 transition-colors">
                      <Download className="w-3 h-3" />
                      resume.pdf
                    </a>
                  )}
                </div>
              </div>
            </header>

            <div className="text-lime-500/20 text-xs overflow-hidden whitespace-nowrap">
              ════════════════════════════════════════════════════════════════════
            </div>

            {/* Bio */}
            {sections.hasBio && (
              <section>
                <div className="text-xs text-lime-500/40 mb-2">&gt; cat ~/about.txt</div>
                <p className="text-sm text-lime-200/70 leading-relaxed whitespace-pre-wrap pl-4 border-l border-lime-500/20">
                  {portfolio.bio}
                </p>
              </section>
            )}

            {/* Experience */}
            {sections.hasExperiences && (
              <section>
                <div className="text-xs text-lime-500/40 mb-4">&gt; ls -l ~/experience/</div>
                <div className="space-y-5">
                  {experiences.map((exp, i) => (
                    <div key={exp.id} className="group">
                      <div className="flex items-start gap-3">
                        <span className="text-lime-500/30 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h3 className="text-lime-300 font-bold text-sm">{exp.position}</h3>
                              <p className="text-lime-500/60 text-xs">
                                @ {exp.companyUrl ? (
                                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-lime-300">{exp.company}</a>
                                ) : exp.company}
                                {exp.employmentType && <span className="text-lime-500/40"> ({EMPLOYMENT_TYPES_MAP[exp.employmentType]})</span>}
                              </p>
                            </div>
                            <span className="text-[10px] text-lime-500/40 border border-lime-500/20 px-2 py-0.5">
                              {exp.dateRange}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-xs text-lime-200/50 whitespace-pre-wrap">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {sections.hasEducation && (
              <section>
                <div className="text-xs text-lime-500/40 mb-4">&gt; ls -l ~/education/</div>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="border border-lime-500/15 p-4">
                      <h3 className="text-sm text-lime-300 font-bold">{edu.degree}</h3>
                      <p className="text-xs text-lime-500/60">{edu.institution}</p>
                      {edu.fieldOfStudy && <p className="text-xs text-lime-500/40 italic">major: {edu.fieldOfStudy}</p>}
                      {edu.dateRange && <p className="text-[10px] text-lime-500/30 mt-1">{edu.dateRange}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {sections.hasProjects && (
              <section>
                <div className="text-xs text-lime-500/40 mb-4">&gt; find ~/projects -type d</div>
                <div className="grid md:grid-cols-2 gap-3">
                  {projects.map((project) => (
                    <div key={project.id} className={`border p-4 hover:border-lime-500/30 transition-colors ${project.featured ? 'border-lime-500/40 bg-lime-500/5' : 'border-lime-500/15'}`}>
                      {project.imageUrl && (
                        <img src={project.imageUrl} alt={project.name} className="w-full h-24 object-cover border border-lime-500/20 mb-2 grayscale brightness-75" />
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm text-lime-300 font-bold">
                          /{project.name}
                          {project.featured && <span className="text-yellow-400 text-xs ml-1">[★]</span>}
                        </h3>
                        <div className="flex gap-2 shrink-0">
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-lime-500/30 hover:text-lime-300 transition-colors">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-lime-500/30 hover:text-lime-300 transition-colors">
                              <Github className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="mt-1.5 text-xs text-lime-200/40"># {project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="text-[10px] text-lime-400/60 bg-lime-500/5 border border-lime-500/10 px-1.5 py-0.5">
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
                <div className="text-xs text-lime-500/40 mb-3">&gt; echo $SKILLS</div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-xs text-lime-400/70 border border-lime-500/20 px-2.5 py-1 hover:bg-lime-500/10 transition-colors">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {sections.hasCertifications && (
              <section>
                <div className="text-xs text-lime-500/40 mb-3">&gt; cat ~/certs.json</div>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <span className="text-lime-300">{cert.name}</span>
                      <span className="text-lime-500/40"> — {cert.issuer}</span>
                      {cert.formattedIssueDate && <span className="text-lime-500/30"> [{cert.formattedIssueDate}]</span>}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">[verify]</a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {sections.hasLanguages && (
              <section>
                <div className="text-xs text-lime-500/40 mb-3">&gt; echo $LANG</div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-xs text-lime-400/70 border border-lime-500/20 px-2 py-0.5">
                      {lang.name}:<span className="text-lime-500/40">{lang.proficiency}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Social Links */}
            {sections.hasSocialLinks && (
              <section>
                <div className="text-lime-500/20 text-xs overflow-hidden whitespace-nowrap mb-4">
                  ════════════════════════════════════════════════════════════════════
                </div>
                <div className="flex gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-lime-500/20 text-lime-500/50 hover:text-lime-300 hover:border-lime-500/40 transition-colors"
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-between text-[10px] text-lime-500/25 pt-4">
              <span>READY</span>
              <span>MEM: OK &nbsp; CPU: IDLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const retroThemeConfig = {
  id: 'retro' as const,
  name: 'Retro',
  description: 'CRT monitor / old-school computing',
  component: RetroTheme,
};
