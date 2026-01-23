"use client";

import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

interface MinimalThemeProps {
  data: PortfolioData;
  isPreview?: boolean;
}

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

export function MinimalTheme({ data }: MinimalThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-8 pt-16 pb-12">
        <div className="flex items-start gap-6">
          {portfolio.profileImageUrl && (
            <img
              src={portfolio.profileImageUrl}
              alt={portfolio.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-light tracking-tight text-gray-900">
              {portfolio.fullName || "Your Name"}
            </h1>
            {portfolio.title && (
              <p className="mt-2 text-lg text-gray-600">{portfolio.title}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              {portfolio.email && (
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1 hover:text-gray-900">
                  <Mail className="w-4 h-4" />
                  {portfolio.email}
                </a>
              )}
              {portfolio.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {portfolio.phone}
                </span>
              )}
              {portfolio.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {portfolio.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 pb-16 space-y-12">
        {/* About */}
        {portfolio.bio && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{portfolio.bio}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.position}</h3>
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
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Education</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Projects</h2>
            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <div className="flex gap-2">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Connect</h2>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
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
