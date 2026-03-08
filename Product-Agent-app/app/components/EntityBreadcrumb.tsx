"use client";

import { ChevronRight } from "lucide-react";
import {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { LEVEL_META } from "@/app/lib/schemas";
import { useAppStore } from "@/app/lib/store";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { getEntity, getParentChain, cn } from "@/app/lib/utils";

const LEVEL_ICON_MAP: Record<string, LucideIcon> = {
  Target, TrendingUp, Lightbulb, Puzzle, HelpCircle, FlaskConical, LayoutGrid,
};

export function EntityBreadcrumb() {
  const { currentEntityId, navigateTo } = useAppStore();
  const { entities } = useProductLine();

  if (!currentEntityId) return null;

  const entity = getEntity(entities, currentEntityId);
  if (!entity) return null;

  const ancestors = getParentChain(entities, currentEntityId);
  const segments = [...ancestors, entity];

  return (
    <nav className="sticky top-0 z-10 flex items-center gap-2 text-sm text-muted-foreground py-3 mb-1 flex-wrap bg-background border-b border-border -mx-8 px-8">
      <button
        onClick={() => navigateTo(null)}
        className="cursor-pointer flex items-center gap-1.5 hover:text-foreground transition-colors px-1.5 py-0.5 rounded-md hover:bg-surface-hover"
      >
        <LayoutGrid size={13} className="shrink-0 text-muted-foreground/50" />
        <span>Overview</span>
      </button>

      {segments.map((seg) => {
        const isLast = seg.id === currentEntityId;
        const levelMeta = LEVEL_META[seg.level];
        const IconComponent = LEVEL_ICON_MAP[levelMeta.icon];

        return (
          <span key={seg.id} className="flex items-center gap-2 min-w-0">
            <ChevronRight size={12} className="shrink-0 text-muted-foreground/30" />
            {isLast ? (
              <span className={cn("flex items-center gap-1.5 font-medium px-1.5 py-0.5", levelMeta.accentColor)}>
                {IconComponent && <IconComponent size={13} className="shrink-0" />}
                <span>{seg.title}</span>
              </span>
            ) : (
              <button
                onClick={() => navigateTo(seg.id)}
                className="cursor-pointer flex items-center gap-1.5 hover:text-foreground transition-colors px-1.5 py-0.5 rounded-md hover:bg-surface-hover"
              >
                {IconComponent && <IconComponent size={13} className="shrink-0 text-muted-foreground/50" />}
                <span className="truncate max-w-[180px]">{seg.title}</span>
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
