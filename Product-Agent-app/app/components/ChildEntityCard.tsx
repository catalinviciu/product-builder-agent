"use client";

import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical,
  type LucideIcon,
} from "lucide-react";
import type { EntityLevel, EntityStatus } from "@/app/lib/schemas";
import { LEVEL_META, ENTITY_STATUS_META } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { cn } from "@/app/lib/utils";

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
}

export function ChildEntityCard({ id, title, level, preview, status, badge }: ChildEntityCardProps) {
  const { navigateToChild } = useAppStore();
  const levelMeta = LEVEL_META[level];
  const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];

  return (
    <button
      onClick={() => navigateToChild(id)}
      className={cn(
        "cursor-pointer text-left w-full p-4 rounded-xl border-l-2 border border-white/8",
        "hover:border-white/20 hover:bg-white/[0.03] hover:shadow-md hover:shadow-white/[0.03] transition-all duration-150",
        "flex flex-col gap-2.5 group relative",
        levelMeta.bgTint,
        levelMeta.borderTint,
      )}
    >
      {status && (
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
          <span className="text-sm font-semibold text-foreground line-clamp-3 pr-14">{title}</span>
          <span className={cn("text-[10px] uppercase tracking-wider font-medium", levelMeta.accentColor)}>
            {levelMeta.label}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">{preview}</p>
        {badge && (
          <span className="shrink-0 text-[10px] text-muted-foreground/50 font-medium whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}
