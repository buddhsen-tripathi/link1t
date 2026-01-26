"use client";

import type { PortfolioData } from "@/types/portfolio";
import { useThemeData } from "./useThemeData";

interface TerminalThemeProps {
  data: PortfolioData;
  isPreview?: boolean;
}

export function TerminalTheme({ data }: TerminalThemeProps) {
  const { portfolio, experiences, education, projects, skills, socialLinks, sections } = useThemeData(data);

  const Prompt = () => (
    <span className="text-green-400">$ </span>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-green-400 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Terminal window chrome */}
        <div className="bg-[#161b22] rounded-t-lg border border-[#30363d]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400">portfolio.sh</span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="bg-[#0d1117] border border-t-0 border-[#30363d] rounded-b-lg p-6 space-y-6 text-sm">
          {/* Header */}
          <div className="space-y-2">
            <div>
              <Prompt />
              <span className="text-white">whoami</span>
            </div>
            <div className="pl-4">
              <p className="text-2xl font-bold text-white">{portfolio.fullName || "user"}</p>
              {portfolio.title && <p className="text-cyan-400">{portfolio.title}</p>}
            </div>
          </div>

          {/* Contact */}
          {sections.hasContact && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">cat contact.txt</span>
              </div>
              <div className="pl-4 text-gray-300">
                {portfolio.email && <p>email: {portfolio.email}</p>}
                {portfolio.phone && <p>phone: {portfolio.phone}</p>}
                {portfolio.location && <p>location: {portfolio.location}</p>}
              </div>
            </div>
          )}

          {/* Bio */}
          {sections.hasBio && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">cat about.md</span>
              </div>
              <div className="pl-4 text-gray-300 whitespace-pre-wrap">{portfolio.bio}</div>
            </div>
          )}

          {/* Experience */}
          {sections.hasExperiences && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">ls -la ./experience/</span>
              </div>
              <div className="pl-4 space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l border-[#30363d] pl-4">
                    <p className="text-yellow-400">{exp.position}</p>
                    <p className="text-gray-400">
                      @ <span className="text-cyan-400">{exp.company}</span>
                    </p>
                    <p className="text-gray-500 text-xs">
                      [{exp.dashDateRange}]
                    </p>
                    {exp.description && (
                      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {sections.hasEducation && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">ls -la ./education/</span>
              </div>
              <div className="pl-4 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-yellow-400">{edu.degree}</p>
                    <p className="text-gray-400">@ {edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-gray-500">major: {edu.fieldOfStudy}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {sections.hasProjects && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">find ./projects -type f</span>
              </div>
              <div className="pl-4 space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-[#30363d] p-3 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">./</span>
                      <span className="text-white">{project.name}</span>
                    </div>
                    {project.description && (
                      <p className="text-gray-400 mt-1 text-xs"># {project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="text-xs text-cyan-400 bg-[#161b22] px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex gap-4 text-xs">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          [demo]
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          [source]
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {sections.hasSkills && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">echo $SKILLS</span>
              </div>
              <div className="pl-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-xs border border-green-400/30 text-green-400 px-2 py-1 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {sections.hasSocialLinks && (
            <div className="space-y-2">
              <div>
                <Prompt />
                <span className="text-white">cat links.txt</span>
              </div>
              <div className="pl-4 space-y-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:underline"
                  >
                    {link.platform}: {link.url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
