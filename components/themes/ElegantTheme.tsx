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
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "twitter":
      return <Twitter className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

export function ElegantTheme({ data }: { data: PortfolioData; isPreview?: boolean }) {
  const { portfolio, experiences, education, projects, skills, socialLinks, certifications, languages, sections } = useThemeData(data);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      {/* Hero */}
      <header className="border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {sections.hasProfileImage && (
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-32 h-32 rounded-full object-cover ring-1 ring-amber-500/30"
              />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-light tracking-tight text-white">
                {portfolio.fullName || "Your Name"}
              </h1>
              {sections.hasTitle && (
                <p className="mt-3 text-lg text-amber-400/80 font-light">{portfolio.title}</p>
              )}
              {sections.hasHeadline && (
                <p className="mt-2 text-sm text-neutral-500 italic">{portfolio.headline}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-neutral-500">
                {sections.hasEmail && (
                  <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    {portfolio.email}
                  </a>
                )}
                {sections.hasPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {portfolio.phone}
                  </span>
                )}
                {sections.hasLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
                {sections.hasResumeUrl && (
                  <a href={portfolio.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                    <Download className="w-4 h-4" />
                    Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16 space-y-20">
        {/* Bio */}
        {sections.hasBio && (
          <section>
            <p className="text-xl font-light leading-relaxed text-neutral-300 whitespace-pre-wrap max-w-2xl">
              {portfolio.bio}
            </p>
          </section>
        )}

        {/* Experience */}
        {sections.hasExperiences && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Experience</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="space-y-10">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid md:grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm text-neutral-600">
                    {exp.dateRange}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{exp.position}</h3>
                    <p className="text-amber-400/60">
                      {exp.companyUrl ? (
                        <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">{exp.company}</a>
                      ) : exp.company}
                      {exp.employmentType && <span className="text-neutral-600 text-sm ml-2">· {EMPLOYMENT_TYPES_MAP[exp.employmentType]}</span>}
                    </p>
                    {exp.description && (
                      <p className="mt-3 text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {sections.hasEducation && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Education</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="grid md:grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm text-neutral-600">{edu.dateRange}</div>
                  <div>
                    <h3 className="font-medium text-white">{edu.degree}</h3>
                    <p className="text-amber-400/60">{edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-sm text-neutral-500">{edu.fieldOfStudy}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {sections.hasProjects && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Projects</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className={`border rounded-lg p-6 hover:border-amber-500/20 transition-colors ${project.featured ? 'border-amber-500/30 bg-amber-500/5' : 'border-neutral-800'}`}>
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-white">
                      {project.name}
                      {project.featured && <span className="text-amber-400 text-xs ml-1">★</span>}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-amber-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-amber-400 transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 text-sm text-neutral-500">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
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
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Skills</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm text-neutral-400 border border-neutral-800 px-4 py-1.5 rounded-full hover:border-amber-500/30 hover:text-amber-300/80 transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {sections.hasCertifications && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Certifications</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="space-y-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="grid md:grid-cols-[200px_1fr] gap-4">
                  <div className="text-sm text-neutral-600">{cert.formattedIssueDate}</div>
                  <div>
                    <h3 className="font-medium text-white">
                      {cert.credentialUrl ? (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">{cert.name}</a>
                      ) : cert.name}
                    </h3>
                    <p className="text-amber-400/60">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-xs text-neutral-600">ID: {cert.credentialId}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {sections.hasLanguages && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500">Languages</h2>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span key={lang.id} className="text-sm text-neutral-400 border border-neutral-800 px-4 py-1.5 rounded-full">
                  {lang.name} <span className="text-neutral-600">· {lang.proficiency}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {sections.hasSocialLinks && (
          <section className="border-t border-neutral-800 pt-10">
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:text-amber-400 transition-colors"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export const elegantThemeConfig = {
  id: 'elegant' as const,
  name: 'Elegant',
  description: 'Refined dark with gold accents',
  component: ElegantTheme,
};
