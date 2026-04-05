"use client";

import { useAppStore } from "@/app/lib/store";
import { ICE_DIMENSIONS, getIceScoreColor } from "@/app/lib/schemas";
import { cn } from "@/app/lib/utils";

export function IceScorePanel({ entityId, iceScore }: { entityId: string; iceScore?: { i: number; c: number; e: number; rationale?: string } }) {
  const { updateIceScore } = useAppStore();
  const scored = iceScore != null;
  const current = iceScore ?? { i: 5, c: 5, e: 5 };
  const total = current.i * current.c * current.e;
  const tierColor = getIceScoreColor(total);

  const handleInit = () => {
    updateIceScore(entityId, { i: 5, c: 5, e: 5 });
  };

  const handleChange = (key: "i" | "c" | "e", value: number) => {
    updateIceScore(entityId, { ...current, [key]: value });
  };

  if (!scored) {
    return (
      <div className="w-full lg:w-[40%] shrink-0 rounded-xl border border-border-default bg-surface-1 p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-foreground">ICE Score</span>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Prioritize with Impact × Confidence × Ease</p>
          </div>
          <button
            onClick={handleInit}
            className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-surface-2 border border-border-default text-foreground hover:bg-surface-hover transition-colors"
          >
            Set ICE Score
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[40%] shrink-0 rounded-xl border border-border-default bg-surface-1 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">ICE Score</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/40">
            {current.i} × {current.c} × {current.e} =
          </span>
          <span className={cn("text-sm font-bold px-2.5 py-0.5 rounded-full border", tierColor.text, tierColor.bg, tierColor.border)}>
            {total}
          </span>
        </div>
      </div>
      {ICE_DIMENSIONS.map((dim) => {
        const val = current[dim.key];
        return (
          <div key={dim.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", dim.dotColor)} />
                <span className={cn("text-xs font-medium", dim.color)}>{dim.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">{val}</span>
                <span className="text-[10px] text-muted-foreground/60">{dim.valueLabels[val]}</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={val}
              onChange={(e) => handleChange(dim.key, Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-3 cursor-pointer accent-current"
              style={{ accentColor: dim.key === "i" ? "#3b82f6" : dim.key === "c" ? "#8b5cf6" : "#10b981" }}
            />
          </div>
        );
      })}
    </div>
  );
}
