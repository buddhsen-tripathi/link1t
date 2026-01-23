"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
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
import { generateId, type Experience } from "@/types/portfolio";

interface ExperienceSectionProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

interface SortableExperienceProps {
  exp: Experience;
  index: number;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
  onCurrentChange: (id: string, isCurrent: boolean) => void;
}

function SortableExperience({ exp, index, onUpdate, onRemove, onCurrentChange }: SortableExperienceProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
            Experience {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(exp.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company *</Label>
          <Input
            value={exp.company}
            onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
            placeholder="Company Name"
          />
        </div>
        <div className="space-y-2">
          <Label>Position *</Label>
          <Input
            value={exp.position}
            onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
            placeholder="Job Title"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={exp.location}
          onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
          placeholder="City, Country or Remote"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="month"
            value={exp.startDate}
            onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="month"
            value={exp.endDate}
            onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
            disabled={exp.isCurrent}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`current-${exp.id}`}
          checked={exp.isCurrent}
          onCheckedChange={(checked) => onCurrentChange(exp.id, checked === true)}
        />
        <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">
          I currently work here
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={exp.description}
          onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
          placeholder="Describe your responsibilities and achievements..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}

export function ExperienceSection({ experiences, onChange }: ExperienceSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      portfolioId: "",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      displayOrder: experiences.length,
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const handleCurrentChange = (id: string, isCurrent: boolean) => {
    updateExperience(id, {
      isCurrent,
      endDate: isCurrent ? "" : experiences.find((e) => e.id === id)?.endDate || "",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((exp) => exp.id === active.id);
      const newIndex = experiences.findIndex((exp) => exp.id === over.id);

      const newOrder = arrayMove(experiences, oldIndex, newIndex).map((exp, idx) => ({
        ...exp,
        displayOrder: idx,
      }));
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      {experiences.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No experience added yet</p>
          <Button onClick={addExperience} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
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
              items={experiences.map((exp) => exp.id)}
              strategy={verticalListSortingStrategy}
            >
              {experiences.map((exp, index) => (
                <SortableExperience
                  key={exp.id}
                  exp={exp}
                  index={index}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                  onCurrentChange={handleCurrentChange}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addExperience} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
}
