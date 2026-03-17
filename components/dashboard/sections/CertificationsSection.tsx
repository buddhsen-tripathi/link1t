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
import { cn } from "@/lib/utils";
import { generateId, type Certification } from "@/types/portfolio";

interface CertificationsSectionProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

interface SortableCertificationProps {
  cert: Certification;
  index: number;
  onUpdate: (id: string, updates: Partial<Certification>) => void;
  onRemove: (id: string) => void;
}

function SortableCertification({ cert, index, onUpdate, onRemove }: SortableCertificationProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id });

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
            Certification {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(cert.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Certification Name *</Label>
          <Input
            value={cert.name}
            onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
            placeholder="AWS Solutions Architect"
          />
        </div>
        <div className="space-y-2">
          <Label>Issuer *</Label>
          <Input
            value={cert.issuer}
            onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
            placeholder="Amazon Web Services"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Input
            type="month"
            value={cert.issueDate}
            onChange={(e) => onUpdate(cert.id, { issueDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input
            type="month"
            value={cert.expiryDate}
            onChange={(e) => onUpdate(cert.id, { expiryDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Credential URL</Label>
          <Input
            type="url"
            value={cert.credentialUrl}
            onChange={(e) => onUpdate(cert.id, { credentialUrl: e.target.value })}
            placeholder="https://verify.example.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label>Credential ID</Label>
          <Input
            value={cert.credentialId}
            onChange={(e) => onUpdate(cert.id, { credentialId: e.target.value })}
            placeholder="ABC-123-XYZ"
          />
        </div>
      </div>
    </div>
  );
}

export function CertificationsSection({ certifications, onChange }: CertificationsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      portfolioId: "",
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialUrl: "",
      credentialId: "",
      displayOrder: certifications.length,
    };
    onChange([...certifications, newCert]);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onChange(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, ...updates } : cert
      )
    );
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter((cert) => cert.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((cert) => cert.id === active.id);
      const newIndex = certifications.findIndex((cert) => cert.id === over.id);

      const newOrder = arrayMove(certifications, oldIndex, newIndex).map((cert, idx) => ({
        ...cert,
        displayOrder: idx,
      }));
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-4">
      {certifications.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No certifications added yet</p>
          <Button onClick={addCertification} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
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
              items={certifications.map((cert) => cert.id)}
              strategy={verticalListSortingStrategy}
            >
              {certifications.map((cert, index) => (
                <SortableCertification
                  key={cert.id}
                  cert={cert}
                  index={index}
                  onUpdate={updateCertification}
                  onRemove={removeCertification}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={addCertification} variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Certification
          </Button>
        </>
      )}
    </div>
  );
}
