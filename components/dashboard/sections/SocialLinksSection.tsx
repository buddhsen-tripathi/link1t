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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateId, SOCIAL_PLATFORMS, type SocialLink, type SocialPlatform } from "@/types/portfolio";

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onChange: (socialLinks: SocialLink[]) => void;
}

const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  website: "Website",
  dribbble: "Dribbble",
  behance: "Behance",
  youtube: "YouTube",
  medium: "Medium",
  devto: "Dev.to",
  instagram: "Instagram",
};

const PLATFORM_PLACEHOLDERS: Record<SocialPlatform, string> = {
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",
  website: "https://yourwebsite.com",
  dribbble: "https://dribbble.com/username",
  behance: "https://behance.net/username",
  youtube: "https://youtube.com/@username",
  medium: "https://medium.com/@username",
  devto: "https://dev.to/username",
  instagram: "https://instagram.com/username",
};

interface SortableSocialLinkProps {
  link: SocialLink;
  availablePlatforms: { value: SocialPlatform; label: string }[];
  onUpdate: (id: string, updates: Partial<SocialLink>) => void;
  onRemove: (id: string) => void;
}

function SortableSocialLink({ link, availablePlatforms, onUpdate, onRemove }: SortableSocialLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-3 p-3 border border-border bg-background",
        isDragging && "opacity-50 z-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded mt-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Select
            value={link.platform}
            onValueChange={(value: SocialPlatform) => {
              onUpdate(link.id, { platform: value });
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={link.platform}>
                {PLATFORM_ICONS[link.platform]}
              </SelectItem>
              {availablePlatforms.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={link.url}
            onChange={(e) => onUpdate(link.id, { url: e.target.value })}
            placeholder={PLATFORM_PLACEHOLDERS[link.platform]}
            className="flex-1"
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(link.id)}
        className="text-destructive hover:text-destructive shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function SocialLinksSection({ socialLinks, onChange }: SocialLinksSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const usedPlatforms = new Set(socialLinks.map((s) => s.platform));

  const addSocialLink = () => {
    const availablePlatform = SOCIAL_PLATFORMS.find(
      (p) => !usedPlatforms.has(p.value)
    );
    if (!availablePlatform) return;

    const newLink: SocialLink = {
      id: generateId(),
      portfolioId: "",
      platform: availablePlatform.value,
      url: "",
      displayOrder: socialLinks.length,
    };
    onChange([...socialLinks, newLink]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    onChange(
      socialLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const removeSocialLink = (id: string) => {
    onChange(socialLinks.filter((link) => link.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = socialLinks.findIndex((link) => link.id === active.id);
      const newIndex = socialLinks.findIndex((link) => link.id === over.id);

      const newOrder = arrayMove(socialLinks, oldIndex, newIndex).map((link, idx) => ({
        ...link,
        displayOrder: idx,
      }));
      onChange(newOrder);
    }
  };

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => !usedPlatforms.has(p.value)
  );

  return (
    <div className="space-y-4">
      {socialLinks.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No social links added yet</p>
          <Button onClick={addSocialLink} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
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
              items={socialLinks.map((link) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              {socialLinks.map((link) => (
                <SortableSocialLink
                  key={link.id}
                  link={link}
                  availablePlatforms={availablePlatforms}
                  onUpdate={updateSocialLink}
                  onRemove={removeSocialLink}
                />
              ))}
            </SortableContext>
          </DndContext>
          {availablePlatforms.length > 0 && (
            <Button onClick={addSocialLink} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Link
            </Button>
          )}
        </>
      )}
    </div>
  );
}
