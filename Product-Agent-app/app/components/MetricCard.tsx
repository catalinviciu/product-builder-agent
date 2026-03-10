"use client";

export function MetricCard({ metric, currentValue, targetValue, timeframe }: {
  metric: string; currentValue: string; targetValue: string; timeframe?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border-default">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{metric}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground/60">{currentValue}</span>
          <span className="text-muted-foreground/40">&rarr;</span>
          <span className="text-lg font-semibold text-foreground">{targetValue}</span>
        </div>
        {timeframe && <span className="text-[11px] text-muted-foreground/40">{timeframe}</span>}
      </div>
    </div>
  );
}
