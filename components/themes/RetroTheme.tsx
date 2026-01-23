"use client";

import { Mail, MapPin, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { PortfolioData, SocialPlatform } from "@/types/portfolio";

interface RetroThemeProps {
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

export function RetroTheme({ data }: RetroThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks } = data;

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        background: "repeating-linear-gradient(0deg, #1a1a2e 0px, #1a1a2e 2px, #16213e 2px, #16213e 4px)",
      }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Retro Header Banner */}
        <div className="text-center mb-8 relative">
          <div className="inline-block">
            <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 p-1">
              <div className="bg-[#1a1a2e] px-8 py-4">
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{
                    background: "linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(255,107,107,0.5)",
                  }}
                >
                  {portfolio.fullName || "YOUR NAME"}
                </h1>
                {portfolio.title && (
                  <p className="text-cyan-400 mt-2 text-sm tracking-widest uppercase">
                    {'>'} {portfolio.title} {'<'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Visitor Counter (fake retro element) */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-green-400">
            <span className="animate-pulse">●</span>
            <span>VISITORS: 000{Math.floor(Math.random() * 9999)}</span>
          </div>
        </div>

        {/* Profile Image */}
        {portfolio.profileImageUrl && (
          <div className="flex justify-center mb-8">
            <div className="border-4 border-yellow-400 p-1 bg-pink-500">
              <img
                src={portfolio.profileImageUrl}
                alt={portfolio.fullName}
                className="w-32 h-32 object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        )}

        {/* Contact Info */}
        {(portfolio.email || portfolio.location) && (
          <div className="text-center mb-8 space-y-2">
            <div className="inline-block bg-blue-600 px-4 py-2 text-white text-sm overflow-hidden max-w-full">
              <div className="animate-marquee whitespace-nowrap">
                {portfolio.email && `📧 ${portfolio.email} `}
                {portfolio.location && `📍 ${portfolio.location} `}
                {portfolio.phone && `📞 ${portfolio.phone}`}
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {portfolio.bio && (
          <div className="mb-8 border-4 border-double border-cyan-400 bg-[#0f0f23] p-4">
            <h2 className="text-yellow-400 text-center mb-4 text-lg">
              ★★★ ABOUT ME ★★★
            </h2>
            <p className="text-green-300 text-sm leading-relaxed whitespace-pre-wrap text-center">
              {portfolio.bio}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-center text-pink-400 text-xl mb-4 animate-pulse">
              {'<'} WORK EXPERIENCE {'>'}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-[#0f0f23] border-2 border-pink-500 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-2">
                    <div>
                      <h3 className="text-yellow-300 font-bold">{exp.position}</h3>
                      <p className="text-cyan-300">@ {exp.company}</p>
                    </div>
                    <span className="text-green-400 text-sm">
                      [{formatDate(exp.startDate)} - {exp.isCurrent ? "NOW!" : formatDate(exp.endDate)}]
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-center text-cyan-400 text-xl mb-4">
              📚 EDUCATION 📚
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-500 p-3 text-center">
                  <h3 className="text-yellow-300">{edu.degree}</h3>
                  <p className="text-white">{edu.institution}</p>
                  {edu.fieldOfStudy && <p className="text-cyan-300 text-sm">{edu.fieldOfStudy}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-center text-green-400 text-xl mb-4">
              🚀 MY COOL PROJECTS 🚀
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="border-4 p-4"
                  style={{
                    borderColor: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"][index % 4],
                    backgroundColor: "#0f0f23",
                  }}
                >
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span className="text-yellow-400">►</span>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-300 text-xs mt-2">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-[10px] bg-gray-800 text-cyan-300 px-2 py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1"
                      >
                        [VIEW]
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1"
                      >
                        [CODE]
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8 text-center">
            <h2 className="text-yellow-400 text-xl mb-4">
              ⚡ SKILLZ ⚡
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill, index) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-sm font-bold"
                  style={{
                    backgroundColor: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1", "#5f27cd"][index % 6],
                    color: index % 6 === 1 ? "#000" : "#fff",
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="text-center mb-8">
            <h2 className="text-pink-400 mb-4">FIND ME ON THE WEB!</h2>
            <div className="flex justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Retro Footer */}
        <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
          <p className="text-cyan-400">Best viewed in Netscape Navigator 4.0</p>
          <p className="mt-2">
            <span className="text-yellow-400">★</span>
            <span className="text-pink-400">★</span>
            <span className="text-cyan-400">★</span>
            {" "}Made with Link1t{" "}
            <span className="text-cyan-400">★</span>
            <span className="text-pink-400">★</span>
            <span className="text-yellow-400">★</span>
          </p>
          <p className="text-green-400 animate-pulse mt-2">[ UNDER CONSTRUCTION ]</p>
        </div>
      </div>
    </div>
  );
}
