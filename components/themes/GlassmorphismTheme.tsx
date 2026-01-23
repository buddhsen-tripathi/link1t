"use client";

import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

interface GlassmorphismThemeProps {
  data: PortfolioData;
  isPreview?: boolean;
}

const SocialIcon = ({ platform }: { platform: SocialPlatform }) => {
  switch (platform) {
    case "github":
      return <Github className="w-5 h-5" />;
    case "linkedin":
      return <Linkedin className="w-5 h-5" />;
    case "twitter":
      return <Twitter className="w-5 h-5" />;
    default:
      return <ExternalLink className="w-5 h-5" />;
  }
};

export function GlassmorphismTheme({ data }: GlassmorphismThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`backdrop-blur-xl bg-gray-50/80 border border-gray-200 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      {/* Solid background */}
      <div className="fixed inset-0 bg-white"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-gray-900">
        {/* Header */}
        <GlassCard className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {portfolio.profileImageUrl && (
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-gray-100"
              />
            )}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {portfolio.fullName || "Your Name"}
              </h1>
              {portfolio.title && (
                <p className="mt-2 text-xl text-gray-600">{portfolio.title}</p>
              )}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                {portfolio.email && (
                  <a href={`mailto:${portfolio.email}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <Mail className="w-4 h-4" />
                    {portfolio.email}
                  </a>
                )}
                {portfolio.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {portfolio.phone}
                  </span>
                )}
                {portfolio.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* About */}
        {portfolio.bio && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-3">About Me</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{portfolio.bio}</p>
          </GlassCard>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-6">Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-900 before:rounded-full">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Education */}
        {education.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-6">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gray-900 before:rounded-full">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-sm text-gray-400">{edu.fieldOfStudy}</p>}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-6 px-2">Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <GlassCard key={project.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex gap-2 shrink-0">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 backdrop-blur-xl bg-gray-50/80 border border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
