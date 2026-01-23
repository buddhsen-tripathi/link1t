"use client";

import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

interface BrutalistThemeProps {
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

export function BrutalistTheme({ data }: BrutalistThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {portfolio.profileImageUrl && (
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-32 h-32 object-cover border-4 border-black grayscale"
              />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold uppercase tracking-tight">
                {portfolio.fullName || "YOUR NAME"}
              </h1>
              {portfolio.title && (
                <p className="mt-2 text-xl border-l-4 border-black pl-4 uppercase">
                  {portfolio.title}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {portfolio.email && (
                  <a href={`mailto:${portfolio.email}`} className="flex items-center gap-2 border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    {portfolio.email}
                  </a>
                )}
                {portfolio.location && (
                  <span className="flex items-center gap-2 border-2 border-black px-3 py-1">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-12">
        {/* About */}
        {portfolio.bio && (
          <section className="border-4 border-black p-6">
            <h2 className="text-2xl font-bold uppercase mb-4 bg-black text-white px-4 py-2 inline-block">
              About
            </h2>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{portfolio.bio}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white px-4 py-2 inline-block">
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="border-l-4 border-black pl-6">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold uppercase">{exp.position}</h3>
                      <p className="text-lg">{exp.company}</p>
                    </div>
                    <span className="text-sm border-2 border-black px-2 py-1">
                      {formatDate(exp.startDate)} → {exp.isCurrent ? "NOW" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-3 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white px-4 py-2 inline-block">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-black pl-6">
                  <h3 className="text-xl font-bold uppercase">{edu.degree}</h3>
                  <p className="text-lg">{edu.institution}</p>
                  {edu.fieldOfStudy && <p>{edu.fieldOfStudy}</p>}
                  <span className="text-sm">
                    {formatDate(edu.startDate)} → {formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white px-4 py-2 inline-block">
              Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="border-4 border-black p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold uppercase">{project.name}</h3>
                    <div className="flex gap-2">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:bg-black hover:text-white p-1 border-2 border-black">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:bg-black hover:text-white p-1 border-2 border-black">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 text-sm">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs bg-black text-white px-2 py-1">
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
            <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white px-4 py-2 inline-block">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="border-2 border-black px-3 py-1 text-sm uppercase hover:bg-black hover:text-white transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <section className="border-t-4 border-black pt-8">
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-4 border-black p-3 hover:bg-black hover:text-white transition-colors"
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
