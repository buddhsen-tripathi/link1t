"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateId, type Project } from "@/types/portfolio";

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      portfolioId: "",
      name: "",
      description: "",
      url: "",
      githubUrl: "",
      imageUrl: "",
      technologies: [],
      displayOrder: projects.length,
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(
      projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      )
    );
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((proj) => proj.id !== id));
  };

  const addTechnology = (projectId: string) => {
    const tech = techInput[projectId]?.trim();
    if (!tech) return;

    const project = projects.find((p) => p.id === projectId);
    if (project && !project.technologies.includes(tech)) {
      updateProject(projectId, {
        technologies: [...project.technologies, tech],
      });
    }
    setTechInput((prev) => ({ ...prev, [projectId]: "" }));
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        technologies: project.technologies.filter((t) => t !== tech),
      });
    }
  };

  const handleTechKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    projectId: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology(projectId);
    }
  };

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <Button onClick={addProject} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      ) : (
        <>
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="border border-border p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <span className="text-sm font-medium">
                    Project {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(proj.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, { name: e.target.value })
                  }
                  placeholder="My Awesome Project"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(proj.id, { description: e.target.value })
                  }
                  placeholder="Brief description of the project..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    type="url"
                    value={proj.url}
                    onChange={(e) =>
                      updateProject(proj.id, { url: e.target.value })
                    }
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    type="url"
                    value={proj.githubUrl}
                    onChange={(e) =>
                      updateProject(proj.id, { githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput[proj.id] || ""}
                    onChange={(e) =>
                      setTechInput((prev) => ({
                        ...prev,
                        [proj.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => handleTechKeyDown(e, proj.id)}
                    placeholder="Add technology and press Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addTechnology(proj.id)}
                  >
                    Add
                  </Button>
                </div>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted border border-border"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(proj.id, tech)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button onClick={addProject} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
    </div>
  );
}
