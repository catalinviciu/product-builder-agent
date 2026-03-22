"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Copy, FileText, PenLine, Clipboard, Check, Lightbulb, FlaskConical, LayoutTemplate, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Entity, EntityStore, ProductLine } from "@/app/lib/schemas";
import { buildEntityAnchor, buildOpportunityWriterPrompt, buildSolutionPlanningPrompt, buildSolutionsBrainstormerPrompt, buildAssumptionTesterPrompt, buildPrototypeBuilderPrompt } from "@/app/lib/utils";

export interface AIAction {
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

  // Context anchor — available for all levels
  actions.push({
    id: "copy-anchor",
    label: "Copy AI context anchor",
    description: "Reference this entity in an AI conversation",
    icon: Copy,
    getText: () => buildEntityAnchor(entities, productLine.name, entity.id),
  });

  // Test (prototype type) gets a build action
  if (entity.level === "test" && entity.testType === "prototype") {
    actions.push({
      id: "build-prototype",
      label: "Build this prototype",
      description: "Turn this test definition into a lightweight HTML prototype ready to run with real users",
      icon: LayoutTemplate,
      getText: () => buildPrototypeBuilderPrompt(entities, productLine, entity.id),
    });
  }

  // Solution also gets planning prompt and assumption tester
  if (entity.level === "solution") {
    actions.push({
      id: "copy-planning",
      label: "Plan & implement this solution",
      description: "Full prompt to plan and build this feature — includes opportunity context, solution details, and codebase path",
      icon: Clipboard,
      getText: () => buildSolutionPlanningPrompt(entities, productLine, entity.id),
    });
    actions.push({
      id: "identify-assumptions",
      label: "Identify assumptions & tests",
      description: "Use AI to surface critical assumptions and design lightweight tests before building",
      icon: FlaskConical,
      getText: () => buildAssumptionTesterPrompt(entities, productLine, entity.id),
    });
    actions.push({
      id: "build-prototype",
      label: "Build a prototype",
      description: "Design and build a lightweight HTML prototype to test a key assumption before writing production code",
      icon: LayoutTemplate,
      getText: () => buildPrototypeBuilderPrompt(entities, productLine, entity.id),
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
    actions.push({
      id: "brainstorm-solutions",
      label: "Brainstorm solutions",
      description: "Use the AI skill to generate 5 distinct solution approaches",
      icon: Lightbulb,
      getText: () => buildSolutionsBrainstormerPrompt(entities, productLine, entity.id),
    });
  }

  return actions;
}

// ── Root-level AI Actions button (overview page) ──────────────────────────

export function RootAIActionsButton({ actions }: { actions: AIAction[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (action: AIAction) => {
    navigator.clipboard.writeText(action.getText());
    setCopiedId(action.id);
    setTimeout(() => setCopiedId((prev) => (prev === action.id ? null : prev)), 2000);
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setCopiedId(null); }}>
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
                  {copiedId === action.id ? "Prompt copied!" : action.label}
                </span>
                <span className="text-[11px] text-muted-foreground/60 leading-tight">
                  {copiedId === action.id
                    ? "Paste it in Claude Code (or your AI tool) in plan mode to get started"
                    : action.description}
                </span>
              </div>
            </DropdownMenuItem>
          </div>
        ))}
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
                    {copiedId === action.id ? "Prompt copied!" : action.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60 leading-tight">
                    {copiedId === action.id
                      ? "Paste it in Claude Code (or your AI tool) in plan mode to get started"
                      : action.description}
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
