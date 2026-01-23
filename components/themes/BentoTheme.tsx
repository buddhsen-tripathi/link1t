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
    <div className="min-h-screen bg-[#f5f5f7] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[120px]">
          {/* Profile Card - Large */}
          <div className="col-span-4 md:col-span-3 row-span-2 bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-start gap-4">
              {portfolio.profileImageUrl && (
                <img
                  src={portfolio.profileImageUrl}
                  alt={portfolio.fullName}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {portfolio.fullName || "Your Name"}
                </h1>
                {portfolio.title && (
                  <p className="text-gray-500">{portfolio.title}</p>
                )}
              </div>
            </div>
            {portfolio.bio && (
              <p className="text-sm text-gray-600 line-clamp-3">{portfolio.bio}</p>
            )}
          </div>

          {/* Contact Card */}
          <div className="col-span-2 md:col-span-3 row-span-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-4 text-white shadow-sm">
            <h2 className="text-sm font-medium opacity-80 mb-2">Contact</h2>
            <div className="space-y-1 text-sm">
              {portfolio.email && (
                <a href={`mailto:${portfolio.email}`} className="flex items-center gap-2 hover:opacity-80">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{portfolio.email}</span>
                </a>
              )}
              {portfolio.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Card */}
          {socialLinks.length > 0 && (
            <div className="col-span-2 md:col-span-3 row-span-1 bg-gray-900 rounded-3xl p-4 text-white shadow-sm">
              <h2 className="text-sm font-medium opacity-60 mb-2">Social</h2>
              <div className="flex gap-3">
                {socialLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Experience Card */}
          {experiences.length > 0 && (
            <div className="col-span-4 md:col-span-4 row-span-2 bg-white rounded-3xl p-6 shadow-sm overflow-hidden">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Experience</h2>
              <div className="space-y-4">
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-gray-500">{exp.company}</p>
                      <p className="text-xs text-gray-400">
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
            <div className="col-span-4 md:col-span-2 row-span-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-sm">
              <h2 className="text-sm font-medium opacity-80 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs bg-white/20 px-3 py-1.5 rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="text-xs opacity-60">+{skills.length - 8} more</span>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.slice(0, 2).map((project, index) => (
            <div
              key={project.id}
              className={`col-span-4 md:col-span-3 row-span-2 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between ${
                index === 1 ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" : ""
              }`}
            >
              <div>
                <h2 className={`text-sm font-medium mb-2 ${index === 1 ? "opacity-80" : "text-gray-400"}`}>
                  Project
                </h2>
                <h3 className={`text-xl font-semibold ${index === 1 ? "" : "text-gray-900"}`}>
                  {project.name}
                </h3>
                {project.description && (
                  <p className={`text-sm mt-2 line-clamp-2 ${index === 1 ? "opacity-90" : "text-gray-500"}`}>
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
                    className={`p-2 rounded-xl transition-colors ${
                      index === 1 ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-xl transition-colors ${
                      index === 1 ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Education Card */}
          {education.length > 0 && (
            <div className="col-span-4 md:col-span-6 row-span-1 bg-gradient-to-r from-green-400 to-cyan-500 rounded-3xl p-6 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium opacity-80">Education</h2>
                  <h3 className="text-xl font-semibold mt-1">
                    {education[0].degree} in {education[0].fieldOfStudy}
                  </h3>
                  <p className="opacity-80">{education[0].institution}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
