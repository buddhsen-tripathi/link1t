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
import { cn } from "@/lib/utils";
import { generateId, type Education } from "@/types/portfolio";

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

interface SortableEducationProps {
  edu: Education;
  index: number;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

function SortableEducation({ edu, index, onUpdate, onRemove }: SortableEducationProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id });

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
            Education {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(edu.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Institution *</Label>
        <Input
          value={edu.institution}
          onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
          placeholder="University or School Name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Degree *</Label>
          <Input
            value={edu.degree}
            onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
            placeholder="e.g., Bachelor's, Master's"
          />
        </div>
        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Input
            value={edu.fieldOfStudy}
            onChange={(e) => onUpdate(edu.id, { fieldOfStudy: e.target.value })}
            placeholder="e.g., Computer Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="month"
            value={edu.startDate}
            onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="month"
            value={edu.endDate}
            onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={edu.description}
          onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
          placeholder="Notable achievements, GPA, relevant coursework..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}

export function EducationSection({ education, onChange }: EducationSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      portfolioId: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      displayOrder: education.length,
    };
    onChange([...education, newEducation]);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(
      education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((edu) => edu.id === active.id);
      const newIndex = education.findIndex((edu) => edu.id === over.id);

      const newOrder = arrayMove(education, oldIndex, newIndex).map((edu, idx) => ({
        ...edu,
        displayOrder: idx,
      }));
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      {education.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No education added yet</p>
          <Button onClick={addEducation} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
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
              items={education.map((edu) => edu.id)}
              strategy={verticalListSortingStrategy}
            >
              {education.map((edu, index) => (
                <SortableEducation
                  key={edu.id}
                  edu={edu}
                  index={index}
                  onUpdate={updateEducation}
                  onRemove={removeEducation}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addEducation} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Education
          </Button>
        </>
      )}
    </div>
  );
}
