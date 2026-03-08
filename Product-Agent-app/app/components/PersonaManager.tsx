"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Trash2, Plus, Users } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";

export function PersonaManager() {
  const [expanded, setExpanded] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { deletePersona, openPersonaPanel } = useAppStore();
  const productLine = useProductLine();
  const personas = productLine.personas ?? [];

  return (
    <div className="px-2 mb-1">
      {/* Section toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "cursor-pointer flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left transition-colors",
          "hover:bg-surface-hover",
          expanded && "bg-surface-hover"
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1.5">
          <Users size={11} className="text-muted-foreground/40" />
          Personas
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/50 font-medium">
            {personas.length}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground/40 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="flex flex-col gap-1 mt-1 px-1">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="group/persona flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <span className="text-xs text-foreground/80 truncate flex-1" title={persona.description || persona.name}>
                {persona.name}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                {confirmDeleteId === persona.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { deletePersona(persona.id); setConfirmDeleteId(null); }}
                      className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="cursor-pointer text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted-foreground"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => openPersonaPanel(persona.id)}
                      className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-foreground opacity-0 group-hover/persona:opacity-100 transition-opacity"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(persona.id)}
                      className="cursor-pointer p-1 rounded text-muted-foreground/30 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover/persona:opacity-100 transition-opacity"
                    >
                      <Trash2 size={11} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => openPersonaPanel()}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground/50 hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <Plus size={12} /> Add persona
          </button>
        </div>
      )}
    </div>
  );
}
