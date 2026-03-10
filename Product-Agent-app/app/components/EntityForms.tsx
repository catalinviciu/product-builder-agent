"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Entity, EntityLevel } from "@/app/lib/schemas";
import { LEVEL_META, getDescriptionPlaceholder, createBlockTemplate } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { generateId } from "@/app/lib/utils";

export function AddChildForm({ parentId, childLevel, onClose }: { parentId: string; childLevel: EntityLevel; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const { addChildEntity, navigateToChild } = useAppStore();
  const childMeta = LEVEL_META[childLevel];

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = generateId();
    const entity: Entity = {
      id,
      level: childLevel,
      title: title.trim(),
      icon: childMeta.icon,
      description: getDescriptionPlaceholder(childLevel),
      status: "draft",
      parentId,
      children: [],
      blocks: createBlockTemplate(childLevel, id),
    };
    addChildEntity(parentId, entity);
    navigateToChild(id);
    onClose();
  };

  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        New {childMeta.label}
      </span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={`${childMeta.label} title (required)`}
        maxLength={80}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
          <Check size={12} /> Create
        </button>
        <button onClick={onClose} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

export function AddRootEntityForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const { addRootEntity, navigateToChild } = useAppStore();
  const boMeta = LEVEL_META.business_outcome;

  const handleSubmit = () => {
    if (!title.trim()) return;
    const id = generateId();
    const entity: Entity = {
      id,
      level: "business_outcome",
      title: title.trim(),
      icon: boMeta.icon,
      description: getDescriptionPlaceholder("business_outcome"),
      status: "draft",
      children: [],
      blocks: createBlockTemplate("business_outcome", id),
    };
    addRootEntity(entity);
    navigateToChild(id);
    onClose();
  };

  return (
    <div className="rounded-xl border border-border-strong p-4 flex flex-col gap-3 bg-surface-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        New Business Outcome
      </span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Business Outcome title (required)"
        maxLength={80}
        className="bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus"
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
          <Check size={12} /> Create
        </button>
        <button onClick={onClose} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}
