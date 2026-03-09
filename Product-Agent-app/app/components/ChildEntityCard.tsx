"use client";

import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, User,
  type LucideIcon,
} from "lucide-react";
import type { EntityLevel, EntityStatus } from "@/app/lib/schemas";
import { LEVEL_META, ENTITY_STATUS_META } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { cn } from "@/app/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const LEVEL_ICON_MAP: Record<string, LucideIcon> = {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical,
};

interface ChildEntityCardProps {
  id: string;
  title: string;
  icon: string;
  level: EntityLevel;
  preview: string;
  status?: EntityStatus;
  badge?: string;
  hideStatus?: boolean;
  draggable?: boolean;
  personaName?: string;
  personaDescription?: string;
  secondaryPersonaCount?: number;
  assumptionTypeLabel?: string;
  assumptionTypeColor?: string;
  assumptionTypeDescription?: string;
  assumptionTypeDotColor?: string;
  testTypeLabel?: string;
  testTypeColor?: string;
  testTypeDescription?: string;
  testTypeDotColor?: string;
  iceScore?: number;
  iceScoreColor?: { text: string; bg: string; border: string };
}

export function ChildEntityCard({ id, title, level, preview, status, badge, hideStatus, draggable, personaName, personaDescription, secondaryPersonaCount, assumptionTypeLabel, assumptionTypeColor, assumptionTypeDescription, assumptionTypeDotColor, testTypeLabel, testTypeColor, testTypeDescription, testTypeDotColor, iceScore, iceScoreColor }: ChildEntityCardProps) {
  const { navigateToChild } = useAppStore();
  const levelMeta = LEVEL_META[level];
  const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !draggable,
  });

  return (
    <TooltipProvider delayDuration={300}>
    <button
      ref={setNodeRef}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      onClick={() => navigateToChild(id)}
      className={cn(
        "cursor-pointer text-left w-full p-4 rounded-xl border-l-2 border border-border-default",
        "hover:border-border-strong hover:bg-surface-hover hover:shadow-md hover:shadow-shadow-color hover:brightness-110 dark:hover:brightness-125 transition-all duration-150",
        "flex flex-col gap-2.5 group relative",
        levelMeta.bgTint,
        levelMeta.borderTint,
        isDragging && "opacity-0 pointer-events-none",
      )}
    >
      {status && !hideStatus && (
        <span className={cn("absolute top-3 right-3 text-[9px] px-1.5 py-0.5 rounded border font-medium", ENTITY_STATUS_META[status].color)}>
          {ENTITY_STATUS_META[status].label}
        </span>
      )}
      <div className="flex items-start gap-2.5 min-w-0">
        {IconComponent && (
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", levelMeta.iconBg)}>
            <IconComponent size={13} className={levelMeta.accentColor} />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <span className={cn("text-sm font-semibold text-foreground line-clamp-3", !hideStatus && "pr-14")}>{title}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">{preview}</p>

      {(personaName || badge || assumptionTypeLabel || testTypeLabel || iceScore != null) && (
        <div className="flex items-center justify-end gap-1.5">
          {iceScore != null && iceScoreColor && (
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-medium", iceScoreColor.text, iceScoreColor.bg, iceScoreColor.border)}>
              ICE: {iceScore}
            </span>
          )}
          {assumptionTypeLabel && (
            assumptionTypeDescription ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", assumptionTypeDotColor)} />
                    {assumptionTypeLabel}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{assumptionTypeDescription}</TooltipContent>
              </Tooltip>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", assumptionTypeDotColor)} />
                {assumptionTypeLabel}
              </span>
            )
          )}
          {testTypeLabel && (
            testTypeDescription ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", testTypeDotColor)} />
                    {testTypeLabel}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{testTypeDescription}</TooltipContent>
              </Tooltip>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", testTypeDotColor)} />
                {testTypeLabel}
              </span>
            )
          )}
          {badge && (
            <span className="text-[10px] text-muted-foreground/50 font-medium whitespace-nowrap">
              {badge}
            </span>
          )}
          {personaName && (
            personaDescription ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                    <User size={9} className="shrink-0" />
                    {personaName}
                    {secondaryPersonaCount != null && secondaryPersonaCount > 0 && (
                      <span className="text-muted-foreground/40 ml-0.5">+{secondaryPersonaCount}</span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{personaDescription}</TooltipContent>
              </Tooltip>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border-subtle text-muted-foreground/70 flex items-center gap-1">
                <User size={9} className="shrink-0" />
                {personaName}
                {secondaryPersonaCount != null && secondaryPersonaCount > 0 && (
                  <span className="text-muted-foreground/40 ml-0.5">+{secondaryPersonaCount}</span>
                )}
              </span>
            )
          )}
        </div>
      )}
    </button>
    </TooltipProvider>
  );
}
