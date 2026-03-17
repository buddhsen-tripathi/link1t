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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateId, LANGUAGE_PROFICIENCIES, type Language, type LanguageProficiency } from "@/types/portfolio";

interface LanguagesSectionProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

interface SortableLanguageProps {
  lang: Language;
  index: number;
  onUpdate: (id: string, updates: Partial<Language>) => void;
  onRemove: (id: string) => void;
}

function SortableLanguage({ lang, index, onUpdate, onRemove }: SortableLanguageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lang.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-border p-4 bg-background",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            value={lang.name}
            onChange={(e) => onUpdate(lang.id, { name: e.target.value })}
            placeholder="English"
          />
          <Select
            value={lang.proficiency}
            onValueChange={(v) => onUpdate(lang.id, { proficiency: v as LanguageProficiency })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Proficiency" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_PROFICIENCIES.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(lang.id)}
          className="text-destructive hover:text-destructive shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function LanguagesSection({ languages, onChange }: LanguagesSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLanguage = () => {
    const newLang: Language = {
      id: generateId(),
      portfolioId: "",
      name: "",
      proficiency: "professional",
      displayOrder: languages.length,
    };
    onChange([...languages, newLang]);
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    onChange(
      languages.map((lang) =>
        lang.id === id ? { ...lang, ...updates } : lang
      )
    );
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter((lang) => lang.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = languages.findIndex((lang) => lang.id === active.id);
      const newIndex = languages.findIndex((lang) => lang.id === over.id);

      const newOrder = arrayMove(languages, oldIndex, newIndex).map((lang, idx) => ({
        ...lang,
        displayOrder: idx,
      }));
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      {languages.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No languages added yet</p>
          <Button onClick={addLanguage} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 px-12">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Label className="text-xs text-muted-foreground">Proficiency</Label>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={languages.map((lang) => lang.id)}
              strategy={verticalListSortingStrategy}
            >
              {languages.map((lang, index) => (
                <SortableLanguage
                  key={lang.id}
                  lang={lang}
                  index={index}
                  onUpdate={updateLanguage}
                  onRemove={removeLanguage}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addLanguage} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Language
          </Button>
        </>
      )}
    </div>
  );
}
