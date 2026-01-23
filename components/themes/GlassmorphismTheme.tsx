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
    <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)]"></div>
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-white">
        {/* Header */}
        <GlassCard className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {portfolio.profileImageUrl && (
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white/20"
              />
            )}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {portfolio.fullName || "Your Name"}
              </h1>
              {portfolio.title && (
                <p className="mt-2 text-xl text-white/80">{portfolio.title}</p>
              )}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/70">
                {portfolio.email && (
                  <a href={`mailto:${portfolio.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
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
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-3">About Me</h2>
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{portfolio.bio}</p>
          </GlassCard>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-6">Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-cyan-400 before:rounded-full">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <div>
                      <h3 className="font-semibold text-white">{exp.position}</h3>
                      <p className="text-white/70">{exp.company}</p>
                    </div>
                    <span className="text-sm text-white/50">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Education */}
        {education.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-6">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-pink-400 before:rounded-full">
                  <h3 className="font-semibold text-white">{edu.degree}</h3>
                  <p className="text-white/70">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-sm text-white/50">{edu.fieldOfStudy}</p>}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-6 px-2">Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <GlassCard key={project.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <div className="flex gap-2 shrink-0">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">
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
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 rounded-full text-sm text-white/90 border border-white/10"
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
                className="p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white/70 hover:text-white hover:bg-white/20 transition-all"
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
