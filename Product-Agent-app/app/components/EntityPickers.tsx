"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Users, Check } from "lucide-react";
import type { EntityStatus } from "@/app/lib/schemas";
import { ENTITY_STATUS_META, ENTITY_STATUSES, ASSUMPTION_TYPE_META, TEST_TYPE_META } from "@/app/lib/schemas";
import type { AssumptionType, TestType } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { cn } from "@/app/lib/utils";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { MarkdownBlock } from "./MarkdownToolbar";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// ── Status picker ─────────────────────────────────────────────────────────

export function StatusPicker({ status, onChange }: { status: EntityStatus; onChange: (s: EntityStatus) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const meta = ENTITY_STATUS_META[status];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "cursor-pointer text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border transition-all duration-150 group/status flex items-center gap-1.5",
          meta.color,
          "hover:brightness-125 hover:shadow-[0_0_8px_rgba(255,255,255,0.06)] hover:scale-105"
        )}
      >
        {meta.label}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[120px]">
          {ENTITY_STATUSES.map((s) => {
            const m = ENTITY_STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                  status === s && "bg-surface-3"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", m.dotColor)} />
                <span className={status === s ? "text-foreground font-medium" : "text-muted-foreground"}>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Persona picker ────────────────────────────────────────────────────────

export function PersonaPicker({ entityId, personaId, secondaryPersonaIds }: { entityId: string; personaId?: string; secondaryPersonaIds?: string[] }) {
  const [open, setOpen] = useState(false);
  const [confirmUnassign, setConfirmUnassign] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { assignPersona } = useAppStore();
  const productLine = useProductLine();
  const personas = productLine.personas ?? [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentPersona = personas.find((p) => p.id === personaId);

  return (
    <div ref={ref} className="relative">
      <TooltipProvider delayDuration={300}>
        {currentPersona?.description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={cn(
                  "cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1",
                  "text-foreground/70"
                )}
              >
                <User size={10} />
                {currentPersona.name}
              </button>
            </TooltipTrigger>
            <TooltipContent><MarkdownBlock content={currentPersona.description} /></TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className={cn(
              "cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1",
              currentPersona ? "text-foreground/70" : "text-muted-foreground/50"
            )}
          >
            <User size={10} />
            {currentPersona ? currentPersona.name : "Unassigned"}
          </button>
        )}
      </TooltipProvider>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[160px]">
          {confirmUnassign ? (
            <div className="px-3 py-2 flex flex-col gap-1.5">
              <span className="text-[10px] text-muted-foreground">This will also clear {(secondaryPersonaIds ?? []).length} secondary persona(s)</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); assignPersona(entityId, undefined); setConfirmUnassign(false); setOpen(false); }}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
                >
                  Unassign all
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmUnassign(false); }}
                  className="cursor-pointer text-[10px] font-medium px-2 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if ((secondaryPersonaIds ?? []).length > 0) {
                  setConfirmUnassign(true);
                } else {
                  assignPersona(entityId, undefined);
                  setOpen(false);
                }
              }}
              className={cn(
                "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                !personaId && "bg-surface-3"
              )}
            >
              <span className={!personaId ? "text-foreground font-medium" : "text-muted-foreground"}>Unassigned</span>
            </button>
          )}
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={(e) => { e.stopPropagation(); assignPersona(entityId, p.id); setOpen(false); }}
              className={cn(
                "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                personaId === p.id && "bg-surface-3"
              )}
            >
              <span className={personaId === p.id ? "text-foreground font-medium" : "text-muted-foreground"}>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Secondary persona picker (multi-select) ──────────────────────────────

export function SecondaryPersonaPicker({ entityId, secondaryPersonaIds, excludePersonaId }: {
  entityId: string; secondaryPersonaIds: string[]; excludePersonaId?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { assignSecondaryPersonas } = useAppStore();
  const productLine = useProductLine();
  const personas = (productLine.personas ?? []).filter((p) => p.id !== excludePersonaId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (personaId: string) => {
    const next = secondaryPersonaIds.includes(personaId)
      ? secondaryPersonaIds.filter((id) => id !== personaId)
      : [...secondaryPersonaIds, personaId];
    assignSecondaryPersonas(entityId, next);
  };

  const count = secondaryPersonaIds.length;
  const selectedPersonaNames = personas
    .filter((p) => secondaryPersonaIds.includes(p.id))
    .map((p) => p.name);

  return (
    <div ref={ref} className="relative">
      <TooltipProvider delayDuration={300}>
        {count > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1 text-foreground/70"
              >
                <Users size={10} />
                {`${count} more`}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {selectedPersonaNames.map((name, i) => (
                <div key={i}>{name}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1 text-muted-foreground/50"
          >
            <Users size={10} />
            Add personas
          </button>
        )}
      </TooltipProvider>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[180px]">
          {personas.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">No other personas</div>
          )}
          {personas.map((p) => {
            const selected = secondaryPersonaIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={(e) => { e.stopPropagation(); toggle(p.id); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                  selected && "bg-surface-3"
                )}
              >
                <span className={cn(
                  "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                  selected ? "bg-foreground/80 border-foreground/80" : "border-border-default"
                )}>
                  {selected && <Check size={9} className="text-background" />}
                </span>
                <span className={selected ? "text-foreground font-medium" : "text-muted-foreground"}>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Assumption type picker ────────────────────────────────────────────────

const ASSUMPTION_TYPES = Object.keys(ASSUMPTION_TYPE_META) as AssumptionType[];

export function AssumptionTypePicker({ entityId, assumptionType }: { entityId: string; assumptionType?: AssumptionType }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { assignAssumptionType } = useAppStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentMeta = assumptionType ? ASSUMPTION_TYPE_META[assumptionType] : undefined;

  return (
    <div ref={ref} className="relative">
      <TooltipProvider delayDuration={300}>
        {currentMeta ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={cn(
                  "cursor-pointer text-[11px] px-2 py-0.5 rounded-full border transition-colors hover:brightness-110 dark:hover:brightness-125 flex items-center gap-1",
                  currentMeta.color
                )}
              >
                {currentMeta.label}
              </button>
            </TooltipTrigger>
            <TooltipContent>{currentMeta.description}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1 text-muted-foreground/50"
          >
            Set type
          </button>
        )}
      </TooltipProvider>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[200px]">
          <button
            onClick={(e) => { e.stopPropagation(); assignAssumptionType(entityId, undefined); setOpen(false); }}
            className={cn(
              "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
              !assumptionType && "bg-surface-3"
            )}
          >
            <span className={!assumptionType ? "text-foreground font-medium" : "text-muted-foreground"}>Unassigned</span>
          </button>
          {ASSUMPTION_TYPES.map((type) => {
            const meta = ASSUMPTION_TYPE_META[type];
            return (
              <button
                key={type}
                onClick={(e) => { e.stopPropagation(); assignAssumptionType(entityId, type); setOpen(false); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                  assumptionType === type && "bg-surface-3"
                )}
              >
                <span className={assumptionType === type ? "text-foreground font-medium" : "text-muted-foreground"}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Test type picker ─────────────────────────────────────────────────────

const TEST_TYPES = Object.keys(TEST_TYPE_META) as TestType[];

export function TestTypePicker({ entityId, testType }: { entityId: string; testType?: TestType }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { assignTestType } = useAppStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentMeta = testType ? TEST_TYPE_META[testType] : undefined;

  return (
    <div ref={ref} className="relative">
      <TooltipProvider delayDuration={300}>
        {currentMeta ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={cn(
                  "cursor-pointer text-[11px] px-2 py-0.5 rounded-full border transition-colors hover:brightness-110 dark:hover:brightness-125 flex items-center gap-1",
                  currentMeta.color
                )}
              >
                {currentMeta.label}
              </button>
            </TooltipTrigger>
            <TooltipContent>{currentMeta.description}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full border border-border-default bg-surface-1 transition-colors hover:bg-surface-hover flex items-center gap-1 text-muted-foreground/50"
          >
            Set type
          </button>
        )}
      </TooltipProvider>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg border border-border-default bg-popover shadow-xl overflow-hidden min-w-[200px]">
          <button
            onClick={(e) => { e.stopPropagation(); assignTestType(entityId, undefined); setOpen(false); }}
            className={cn(
              "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
              !testType && "bg-surface-3"
            )}
          >
            <span className={!testType ? "text-foreground font-medium" : "text-muted-foreground"}>Unassigned</span>
          </button>
          {TEST_TYPES.map((type) => {
            const meta = TEST_TYPE_META[type];
            return (
              <button
                key={type}
                onClick={(e) => { e.stopPropagation(); assignTestType(entityId, type); setOpen(false); }}
                className={cn(
                  "cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-hover",
                  testType === type && "bg-surface-3"
                )}
              >
                <span className={testType === type ? "text-foreground font-medium" : "text-muted-foreground"}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
