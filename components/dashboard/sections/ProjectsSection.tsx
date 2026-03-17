"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, GripVertical, X, Upload, Loader2, Star } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { generateId, type Project } from "@/types/portfolio";

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

interface SortableProjectProps {
  proj: Project;
  index: number;
  techInput: string;
  onTechInputChange: (value: string) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onRemove: (id: string) => void;
  onAddTechnology: () => void;
  onRemoveTechnology: (tech: string) => void;
  onImageUpload: (id: string, file: File) => void;
  isUploadingImage: boolean;
}

function SortableProject({
  proj,
  index,
  techInput,
  onTechInputChange,
  onUpdate,
  onRemove,
  onAddTechnology,
  onRemoveTechnology,
  onImageUpload,
  isUploadingImage,
}: SortableProjectProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: proj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTechnology();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-border p-4 space-y-4 bg-background",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium">
            Project {index + 1}
          </span>
          {proj.featured && (
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(proj.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Project Name *</Label>
        <Input
          value={proj.name}
          onChange={(e) => onUpdate(proj.id, { name: e.target.value })}
          placeholder="My Awesome Project"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={proj.description}
          onChange={(e) => onUpdate(proj.id, { description: e.target.value })}
          placeholder="Brief description of the project..."
          className="min-h-[80px]"
        />
      </div>

      {/* Project Image */}
      <div className="space-y-2">
        <Label>Project Screenshot</Label>
        <div className="flex items-center gap-4">
          {proj.imageUrl ? (
            <div className="relative">
              <img
                src={proj.imageUrl}
                alt={proj.name}
                className="w-32 h-20 object-cover border border-border"
              />
              <button
                onClick={() => onUpdate(proj.id, { imageUrl: "" })}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isUploadingImage && imageInputRef.current?.click()}
              className={`w-32 h-20 border border-dashed border-border flex items-center justify-center transition-colors ${
                isUploadingImage ? "cursor-not-allowed bg-muted/30" : "cursor-pointer hover:bg-muted/50"
              }`}
            >
              {isUploadingImage ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(proj.id, file);
              if (imageInputRef.current) imageInputRef.current.value = "";
            }}
            className="hidden"
            disabled={isUploadingImage}
          />
          <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Live URL</Label>
          <Input
            type="url"
            value={proj.url}
            onChange={(e) => onUpdate(proj.id, { url: e.target.value })}
            placeholder="https://myproject.com"
          />
        </div>
        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input
            type="url"
            value={proj.githubUrl}
            onChange={(e) => onUpdate(proj.id, { githubUrl: e.target.value })}
            placeholder="https://github.com/user/repo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => onTechInputChange(e.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="Add technology and press Enter"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddTechnology}
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
                  onClick={() => onRemoveTechnology(tech)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`featured-${proj.id}`}
          checked={proj.featured || false}
          onCheckedChange={(checked) => onUpdate(proj.id, { featured: checked === true })}
        />
        <Label htmlFor={`featured-${proj.id}`} className="text-sm font-normal cursor-pointer">
          Featured project (shown prominently)
        </Label>
      </div>
    </div>
  );
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const [techInput, setTechInput] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      featured: false,
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

  const handleImageUpload = async (projectId: string, file: File) => {
    setUploadingImage(projectId);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        updateProject(projectId, { imageUrl: result.url });
      }
    } catch (error) {
      console.error("Project image upload error:", error);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((proj) => proj.id === active.id);
      const newIndex = projects.findIndex((proj) => proj.id === over.id);

      const newOrder = arrayMove(projects, oldIndex, newIndex).map((proj, idx) => ({
        ...proj,
        displayOrder: idx,
      }));
      onChange(newOrder);
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((proj) => proj.id)}
              strategy={verticalListSortingStrategy}
            >
              {projects.map((proj, index) => (
                <SortableProject
                  key={proj.id}
                  proj={proj}
                  index={index}
                  techInput={techInput[proj.id] || ""}
                  onTechInputChange={(value) =>
                    setTechInput((prev) => ({ ...prev, [proj.id]: value }))
                  }
                  onUpdate={updateProject}
                  onRemove={removeProject}
                  onAddTechnology={() => addTechnology(proj.id)}
                  onRemoveTechnology={(tech) => removeTechnology(proj.id, tech)}
                  onImageUpload={handleImageUpload}
                  isUploadingImage={uploadingImage === proj.id}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addProject} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
    </div>
  );
}
