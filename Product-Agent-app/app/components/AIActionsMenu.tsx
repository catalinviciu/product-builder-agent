"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Copy, FileText, PenLine, Clipboard, Check, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Entity, EntityStore, ProductLine } from "@/app/lib/schemas";
import { buildEntityAnchor, buildOpportunityWriterPrompt, buildSolutionPlanningPrompt } from "@/app/lib/utils";

interface AIAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  getText: () => string;
}

interface AIActionsMenuProps {
  entity: Entity;
  entities: EntityStore;
  productLine: ProductLine;
}

function getActions(entity: Entity, entities: EntityStore, productLine: ProductLine): AIAction[] {
  const actions: AIAction[] = [];

  // Context anchor — available for all levels except solution (which gets planning prompt instead)
  if (entity.level !== "solution") {
    actions.push({
      id: "copy-anchor",
      label: "Copy AI context anchor",
      description: "Reference this entity in an AI conversation",
      icon: Copy,
      getText: () => buildEntityAnchor(entities, productLine.name, entity.id),
    });
  }

  // Solution gets planning prompt instead of context anchor
  if (entity.level === "solution") {
    actions.push({
      id: "copy-planning",
      label: "Copy planning prompt for Claude Code",
      description: "Full prompt with opportunity context, solution details, and skill instructions",
      icon: Clipboard,
      getText: () => buildSolutionPlanningPrompt(entities, productLine, entity.id),
    });
  }

  // Opportunity writer — for product_outcome (write new) and opportunity (refine)
  if (entity.level === "product_outcome") {
    actions.push({
      id: "write-opportunity",
      label: "Write new opportunity",
      description: "Use AI as a thought partner to explore and define a new opportunity",
      icon: FileText,
      getText: () => buildOpportunityWriterPrompt(entities, productLine, entity.id),
    });
  }

  if (entity.level === "opportunity") {
    actions.push({
      id: "refine-opportunity",
      label: "Refine this opportunity",
      description: "Use the AI writing skill to refine this opportunity",
      icon: PenLine,
      getText: () => buildOpportunityWriterPrompt(entities, productLine, entity.id),
    });
  }

  return actions;
}

// ── Root-level AI Actions button (overview page) ──────────────────────────

export function RootAIActionsButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setCopied(false); }}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-muted-foreground/60 hover:text-foreground text-xs transition-colors">
          <Sparkles size={12} />
          <span>AI Actions</span>
          <ChevronDown size={10} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuItem
          onSelect={(e) => { e.preventDefault(); handleCopy(); }}
          className="flex items-start gap-3 py-2.5 cursor-pointer"
        >
          <div className="shrink-0 mt-0.5">
            {copied
              ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
              : <Copy size={14} className="text-muted-foreground" />}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={copied ? "text-emerald-600 dark:text-emerald-400 font-medium text-xs" : "font-medium text-xs"}>
              {copied ? "Copied!" : "Copy AI context anchor"}
            </span>
            <span className="text-[11px] text-muted-foreground/60 leading-tight">
              Reference this product line in an AI conversation
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const TOOLTIP_KEY = "pa-ai-actions-seen";

export function AIActionsMenu({ entity, entities, productLine }: AIActionsMenuProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(TOOLTIP_KEY);
  });

  const actions = getActions(entity, entities, productLine);

  const handleCopy = (action: AIAction) => {
    navigator.clipboard.writeText(action.getText());
    setCopiedId(action.id);
    setTimeout(() => setCopiedId((prev) => (prev === action.id ? null : prev)), 2000);
  };

  const dismissTip = () => {
    localStorage.setItem(TOOLTIP_KEY, "1");
    setShowTip(false);
  };

  return (
    <div className="relative">
      <DropdownMenu onOpenChange={(open) => {
        if (!open) setCopiedId(null);
        if (open && showTip) dismissTip();
      }}>
        <DropdownMenuTrigger asChild>
          <button className="cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-muted-foreground/60 hover:text-foreground text-xs transition-colors">
            <Sparkles size={12} />
            <span>AI Actions</span>
            <ChevronDown size={10} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {actions.map((action, i) => (
            <div key={action.id}>
              {i > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleCopy(action);
                }}
                className="flex items-start gap-3 py-2.5 cursor-pointer"
              >
                <div className="shrink-0 mt-0.5">
                  {copiedId === action.id ? (
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <action.icon size={14} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className={copiedId === action.id ? "text-emerald-600 dark:text-emerald-400 font-medium text-xs" : "font-medium text-xs"}>
                    {copiedId === action.id ? "Copied!" : action.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60 leading-tight">
                    {action.description}
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* First-run tooltip */}
      {showTip && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 px-3 py-2.5 rounded-lg bg-popover border border-border-default shadow-lg">
          <p className="text-xs text-foreground/80 mb-2">
            All AI interactions for this entity live here.
          </p>
          <button
            onClick={dismissTip}
            className="cursor-pointer text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
