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

export interface SolutionMarkerEntry {
  date: string;      // ISO YYYY-MM-DD
  titles: string[];  // one or more solution names on this date
}

export interface MetricChartProps {
  dataSeries: ChartDataPoint[];
  target?: number;
  endDate?: string;
  height?: number;
  color?: ChartColorConfig;
  formatValue?: (value: number) => string;
  solutionMarkers?: SolutionMarkerEntry[];
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
  if (todayX === null || isNaN(todayX)) return null;

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

// ── Solution completion markers ──────────────────────────────────────────

const SOLUTION_MARKER_COLOR = "#10b981"; // emerald-500

/** Info passed from SVG markers up to the HTML tooltip overlay */
interface MarkerHoverInfo {
  marker: SolutionMarkerEntry;
  /** x position in SVG coordinates (px from left of the SVG) */
  svgX: number;
  /** y position of the badge in SVG coordinates */
  badgeY: number;
}

function SolutionMarkers({ markers, chartData, onHover }: {
  markers: SolutionMarkerEntry[];
  chartData: { date: string }[];
  onHover: (info: MarkerHoverInfo | null) => void;
}) {
  const xScale = useXAxisScale();
  const plotArea = usePlotArea();

  if (!xScale || !plotArea || markers.length === 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xFn = xScale as any;
  const bw = typeof xFn.bandwidth === "function" ? (xFn.bandwidth() as number) : 0;

  const firstDate = chartData[0]?.date;
  const lastDate = chartData[chartData.length - 1]?.date;

  return (
    <g>
      {markers.map((marker) => {
        // Skip markers outside chart range
        if (!firstDate || !lastDate || marker.date < firstDate || marker.date > lastDate) return null;

        // Interpolate x position
        let markerX: number | null = null;
        for (let i = 0; i < chartData.length - 1; i++) {
          if (chartData[i].date <= marker.date && chartData[i + 1].date >= marker.date) {
            const x0 = (xFn(chartData[i].date) as number) + bw / 2;
            const x1 = (xFn(chartData[i + 1].date) as number) + bw / 2;
            const t0 = new Date(chartData[i].date).getTime();
            const t1 = new Date(chartData[i + 1].date).getTime();
            const tM = new Date(marker.date).getTime();
            const ratio = t1 > t0 ? (tM - t0) / (t1 - t0) : 0;
            markerX = x0 + ratio * (x1 - x0);
            break;
          }
        }
        if (markerX === null && chartData.find(d => d.date === marker.date)) {
          markerX = (xFn(marker.date) as number) + bw / 2;
        }
        if (markerX === null || isNaN(markerX)) return null;

        const count = marker.titles.length;
        const badgeY = plotArea.y + plotArea.height - 9;

        return (
          <g
            key={marker.date}
            onMouseEnter={() => onHover({ marker, svgX: markerX!, badgeY })}
            onMouseLeave={() => onHover(null)}
          >
            {/* Dashed vertical line */}
            <line
              x1={markerX} x2={markerX}
              y1={plotArea.y} y2={plotArea.y + plotArea.height}
              stroke={SOLUTION_MARKER_COLOR}
              strokeOpacity={0.45}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />

            {/* Count badge (on x-axis) or dot (single) */}
            {count > 1 ? (
              <>
                <circle cx={markerX} cy={badgeY} r={7}
                  fill={SOLUTION_MARKER_COLOR} fillOpacity={0.9} />
                <text x={markerX} y={badgeY + 3.5}
                  textAnchor="middle" fontSize={8} fontWeight="bold"
                  fill="white">
                  {count}
                </text>
              </>
            ) : (
              <circle cx={markerX} cy={badgeY} r={3.5}
                fill={SOLUTION_MARKER_COLOR} fillOpacity={0.8} />
            )}

            {/* Invisible wider hit area for easier hover */}
            <rect
              x={markerX - 8} y={plotArea.y}
              width={16} height={plotArea.height}
              fill="transparent"
              style={{ cursor: "default" }}
            />
          </g>
        );
      })}
    </g>
  );
}

// ── Solution marker HTML tooltip (rendered outside SVG) ──────────────────

function SolutionTooltip({ hoverInfo, containerRef }: {
  hoverInfo: MarkerHoverInfo;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ left: number; bottom: number } | null>(null);
  const { marker, svgX, badgeY } = hoverInfo;
  const count = marker.titles.length;

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const svgEl = container?.querySelector("svg");
    if (!container || !svgEl) return;

    const containerRect = container.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();

    // Convert SVG coordinates to container-relative pixel coordinates
    const pxX = svgRect.left - containerRect.left + svgX;
    const pxBadgeY = svgRect.top - containerRect.top + badgeY;

    // Position: centered horizontally on marker, above the badge
    setPos({
      left: pxX,
      bottom: containerRect.height - pxBadgeY + 12,
    });
  }, [svgX, badgeY, containerRef]);

  if (!pos) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        left: pos.left,
        bottom: pos.bottom,
        transform: "translateX(-50%)",
        zIndex: 50,
        pointerEvents: "none",
        background: "var(--popover)",
        border: "1px solid color-mix(in srgb, currentColor 15%, transparent)",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 10,
        lineHeight: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ color: SOLUTION_MARKER_COLOR, fontWeight: 600, marginBottom: 3, fontSize: 9 }}>
        {marker.date}
      </div>
      {marker.titles.map((title, i) => (
        <div key={i} style={{
          color: "var(--foreground)",
          fontWeight: 500,
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}>
          {count > 1 && <span style={{ color: SOLUTION_MARKER_COLOR, flexShrink: 0, fontSize: 8 }}>•</span>}
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
}

// ── ChartTooltip ─────────────────────────────────────────────────────────

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
  solutionMarkers,
  className,
}: MetricChartProps) {
  const uid = React.useId();
  const gradientId = `metricGrad-${uid.replace(/:/g, "")}`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [markerHover, setMarkerHover] = React.useState<MarkerHoverInfo | null>(null);

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
  const visibleMarkers = solutionMarkers?.filter(
    (m) => m.date >= firstDate && m.date <= lastDate
  );

  return (
    <div ref={containerRef} data-slot="metric-chart" className={cn("w-full relative", className)}>
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
          {visibleMarkers && visibleMarkers.length > 0 && (
            <Customized component={<SolutionMarkers markers={visibleMarkers} chartData={chartData} onHover={setMarkerHover} />} />
          )}
        </AreaChart>
      </ResponsiveContainer>
      {/* HTML tooltip rendered outside SVG so it can overflow freely */}
      {markerHover && (
        <SolutionTooltip hoverInfo={markerHover} containerRef={containerRef} />
      )}
    </div>
  );
}

export { MetricChart };
