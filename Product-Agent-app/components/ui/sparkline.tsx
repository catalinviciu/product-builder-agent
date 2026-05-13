"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps {
  dataSeries: { value: number }[];
  color?: { stroke: string; fill: string };
  height?: number;
  className?: string;
}

const DEFAULT_COLOR = { stroke: "var(--accent-green)", fill: "var(--accent-green)" };

function buildPath(values: number[], width: number, height: number): { area: string; line: string } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2; // top/bottom padding in SVG units

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = padding + ((max - v) / range) * (height - padding * 2);
    return { x, y };
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height}Z`;

  return { area, line };
}

export function Sparkline({ dataSeries, color = DEFAULT_COLOR, height = 40, className }: SparklineProps) {
  const gradientId = React.useId();

  if (dataSeries.length < 2) {
    return <div style={{ height }} className={cn("w-full", className)} />;
  }

  const values = dataSeries.map((d) => d.value);
  const viewWidth = 120;
  const { area, line } = buildPath(values, viewWidth, height);

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full opacity-80", className)}
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.fill} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color.fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <polyline
        points={line.replace(/[ML]/g, " ").trim()}
        fill="none"
        stroke={color.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
