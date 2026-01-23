"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateId, type Skill } from "@/types/portfolio";

interface SkillsSectionProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Design",
  "Tools",
  "Languages",
  "Frameworks",
  "Other",
];

export function SkillsSection({ skills, onChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Other");

  const addSkill = () => {
    const skillName = newSkill.trim();
    if (!skillName) return;

    // Check if skill already exists
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }

    const skill: Skill = {
      id: generateId(),
      portfolioId: "",
      name: skillName,
      category: newCategory,
      proficiencyLevel: 3,
      displayOrder: skills.length,
    };
    onChange([...skills, skill]);
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const updateSkillCategory = (id: string, category: string) => {
    onChange(
      skills.map((s) =>
        s.id === id ? { ...s, category } : s
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">
      {/* Add new skill */}
      <div className="space-y-2">
        <Label>Add Skill</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., React, Python, Figma"
            className="flex-1"
          />
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addSkill} variant="secondary" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Skills display */}
      {skills.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground">
            No skills added yet. Add skills above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-muted border border-border"
                  >
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}
