"use client";

import { Mail, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

interface BentoThemeProps {
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

export function BentoTheme({ data }: BentoThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 auto-rows-[120px]">
          {/* Profile Card - Large */}
          <div className="col-span-4 md:col-span-3 row-span-2 bg-black border border-dashed border-white/20 p-6 flex flex-col justify-between text-white">
            <div className="flex items-start gap-4">
              {portfolio.profileImageUrl && (
                <img
                  src={portfolio.profileImageUrl}
                  alt={portfolio.fullName}
                  className="w-20 h-20 object-cover border border-dashed border-white/20"
                />
              )}
              <div>
                <h1 className="text-2xl font-semibold">
                  {portfolio.fullName || "Your Name"}
                </h1>
                {portfolio.title && (
                  <p className="text-white/60">{portfolio.title}</p>
                )}
              </div>
            </div>
            {portfolio.bio && (
              <p className="text-sm text-white/60 line-clamp-3">{portfolio.bio}</p>
            )}
          </div>

          {/* Contact Card */}
          <div className="col-span-2 md:col-span-3 row-span-1 bg-black border border-dashed border-white/20 p-4 text-white">
            <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Contact</h2>
            <div className="space-y-1 text-sm">
              {portfolio.email && (
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-2 hover:text-white/80 text-white/60">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{portfolio.email}</span>
                </a>
              )}
              {portfolio.location && (
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Card */}
          {socialLinks.length > 0 && (
            <div className="col-span-2 md:col-span-3 row-span-1 bg-black border border-dashed border-white/20 p-4 text-white">
              <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Social</h2>
              <div className="flex gap-2">
                {socialLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Experience Card */}
          {experiences.length > 0 && (
            <div className="col-span-4 md:col-span-4 row-span-2 bg-black border border-dashed border-white/20 p-6 overflow-hidden text-white">
              <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-4">Experience</h2>
              <div className="space-y-4">
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 bg-white shrink-0"></div>
                    <div>
                      <h3 className="font-medium">{exp.position}</h3>
                      <p className="text-sm text-white/60">{exp.company}</p>
                      <p className="text-xs text-white/40">
                        {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Card */}
          {skills.length > 0 && (
            <div className="col-span-4 md:col-span-2 row-span-2 bg-black border border-dashed border-white/20 p-6 text-white">
              <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs border border-dashed border-white/20 px-3 py-1.5"
                  >
                    {skill.name}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="text-xs text-white/40">+{skills.length - 8} more</span>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.slice(0, 2).map((project) => (
            <div
              key={project.id}
              className="col-span-4 md:col-span-3 row-span-2 bg-black border border-dashed border-white/20 p-6 flex flex-col justify-between text-white"
            >
              <div>
                <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
                  Project
                </h2>
                <h3 className="text-xl font-semibold">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm mt-2 line-clamp-2 text-white/60">
                    {project.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-dashed border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Education Card */}
          {education.length > 0 && (
            <div className="col-span-4 md:col-span-6 row-span-1 bg-black border border-dashed border-white/20 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide">Education</h2>
                  <h3 className="text-xl font-semibold mt-1">
                    {education[0].degree} in {education[0].fieldOfStudy}
                  </h3>
                  <p className="text-white/60">{education[0].institution}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
