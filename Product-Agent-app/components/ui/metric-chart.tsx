"use client";

import * as React from "react";
import {
  ResponsiveContainer, AreaChart, Area, Line, ReferenceLine, Customized,
  Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid,
  useXAxisScale, useYAxisScale, usePlotArea,
} from "recharts";
import { cn } from "@/lib/utils";

// ── Public types & constants ────────────────────────────────────────────

export interface ChartColorConfig {
  stroke: string;
  fill: string;
}

export interface ChartDataPoint {
  date: string;   // ISO YYYY-MM-DD
  value: number;
}

export const DEFAULT_CHART_COLOR: ChartColorConfig = { stroke: "#3b82f6", fill: "#3b82f6" };

export interface MetricChartProps {
  dataSeries: ChartDataPoint[];
  target?: number;
  endDate?: string;
  height?: number;
  color?: ChartColorConfig;
  formatValue?: (value: number) => string;
  className?: string;
}

// ── Internal overlay components ─────────────────────────────────────────

function TodayMarker({ todayIso, chartData, color }: {
  todayIso: string;
  chartData: { date: string }[];
  color: ChartColorConfig;
}) {
  const xScale = useXAxisScale();
  const plotArea = usePlotArea();
  if (!xScale || !plotArea) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xFn = xScale as any;
  const bw = typeof xFn.bandwidth === "function" ? (xFn.bandwidth() as number) : 0;

  // Interpolate today's x position between surrounding data points
  let todayX: number | null = null;
  for (let i = 0; i < chartData.length - 1; i++) {
    if (chartData[i].date <= todayIso && chartData[i + 1].date >= todayIso) {
      const x0 = (xFn(chartData[i].date) as number) + bw / 2;
      const x1 = (xFn(chartData[i + 1].date) as number) + bw / 2;
      const t0 = new Date(chartData[i].date).getTime();
      const t1 = new Date(chartData[i + 1].date).getTime();
      const tNow = new Date(todayIso).getTime();
      const ratio = t1 > t0 ? (tNow - t0) / (t1 - t0) : 0;
      todayX = x0 + ratio * (x1 - x0);
      break;
    }
  }
  if (todayX === null && chartData.find(d => d.date === todayIso)) {
    todayX = (xFn(todayIso) as number) + bw / 2;
  }
  if (todayX === null) return null;

  return (
    <g>
      <line x1={todayX} x2={todayX} y1={plotArea.y} y2={plotArea.y + plotArea.height} stroke={color.stroke} strokeOpacity={0.35} strokeWidth={1} />
      <text x={todayX + 3} y={plotArea.y + 10} fontSize={9} fill={color.stroke} fillOpacity={0.5}>Today</text>
    </g>
  );
}

function TargetPathLabel({ chartData, color }: {
  chartData: { date: string; projection?: number }[];
  color: ChartColorConfig;
}) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  if (!xScale || !yScale) return null;

  const projStart = chartData.find(d => d.projection !== undefined);
  const projEnd = [...chartData].reverse().find(d => d.projection !== undefined);
  if (!projStart || !projEnd || projStart === projEnd) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xFn = xScale as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yFn = yScale as any;
  const bw = typeof xFn.bandwidth === "function" ? (xFn.bandwidth() as number) : 0;
  const x0 = (xFn(projStart.date) as number) + bw / 2;
  const x1 = (xFn(projEnd.date) as number) + bw / 2;
  const y0 = yFn(projStart.projection!) as number;
  const y1 = yFn(projEnd.projection!) as number;
  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;

  return (
    <text x={midX} y={midY - 6} textAnchor="middle" fontSize={8} fill={color.stroke} fillOpacity={0.45}>
      Gap to target
    </text>
  );
}

function ChartTooltip({ active, payload, label, formatValue }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatValue?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const fmtVal = formatValue ? formatValue(payload[0].value) : payload[0].value;
  return (
    <div className="bg-popover border border-border-default rounded-lg shadow-md px-2.5 py-1.5 text-xs">
      <div className="text-muted-foreground/60">{label}</div>
      <div className="font-semibold text-foreground">{fmtVal}</div>
    </div>
  );
}

// ── MetricChart ─────────────────────────────────────────────────────────

function MetricChart({
  dataSeries,
  target,
  endDate,
  height = 110,
  color = DEFAULT_CHART_COLOR,
  formatValue,
  className,
}: MetricChartProps) {
  const uid = React.useId();
  const gradientId = `metricGrad-${uid.replace(/:/g, "")}`;

  if (dataSeries.length === 0 && target === undefined) return null;

  if (dataSeries.length === 0) {
    return (
      <div
        data-slot="metric-chart"
        className={cn("flex items-center justify-center rounded-lg bg-surface-1 border border-border-subtle", className)}
        style={{ height }}
      >
        <span className="text-[10px] text-muted-foreground/40">No data yet</span>
      </div>
    );
  }

  const lastPoint = dataSeries[dataSeries.length - 1];
  const hasProjection = target !== undefined && endDate && endDate > lastPoint.date;

  const chartData = dataSeries.map((dp) => ({
    date: dp.date,
    value: dp.value,
    projection: dp.date === lastPoint.date ? dp.value : undefined as number | undefined,
  }));

  const todayIso = new Date().toISOString().slice(0, 10);

  if (hasProjection) {
    chartData.push({
      date: endDate,
      value: undefined as unknown as number,
      projection: target,
    });
  }

  chartData.sort((a, b) => a.date.localeCompare(b.date));

  const allValues = dataSeries.map((dp) => dp.value);
  if (target !== undefined) allValues.push(target);
  const yMin = Math.min(...allValues) - 1;
  const yMax = Math.max(...allValues) + 1;

  const firstDate = chartData[0].date;
  const lastDate = chartData[chartData.length - 1].date;
  const showToday = todayIso >= firstDate && todayIso <= lastDate;

  return (
    <div data-slot="metric-chart" className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color.fill} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color.fill} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
          <XAxis dataKey="date" hide />
          <YAxis hide domain={[yMin, yMax]} />
          <RechartsTooltip content={<ChartTooltip formatValue={formatValue} />} cursor={{ stroke: color.stroke, strokeOpacity: 0.2 }} />
          {target !== undefined && (
            <ReferenceLine
              y={target}
              stroke="#888"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{ value: `Target: ${formatValue ? formatValue(target) : target}`, position: "insideBottomRight", fontSize: 9, fill: "#888" }}
            />
          )}
          {showToday && (
            <Customized component={<TodayMarker todayIso={todayIso} chartData={chartData} color={color} />} />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color.stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ r: 2.5, fill: color.stroke, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: color.stroke, strokeWidth: 2, stroke: "var(--surface-2)" }}
            connectNulls
          />
          {hasProjection && (
            <>
              <Line
                type="monotone"
                dataKey="projection"
                stroke={color.stroke}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeOpacity={0.25}
                dot={false}
                activeDot={false}
                connectNulls
              />
              <Customized component={<TargetPathLabel chartData={chartData} color={color} />} />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { MetricChart };
