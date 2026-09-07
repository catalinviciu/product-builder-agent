"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Entity, Metric } from "@/app/lib/schemas";
import { MetricTreeCard } from "./MetricTreeCard";

interface MetricTilePreviewProps {
  metric: Metric;
  outcome?: Entity;
  pastOutcomes?: Entity[];
  anchor: HTMLElement | null;
}

interface Position {
  left: number;
  top: number;
  placement: "above" | "below";
}

const GAP = 8;
const VIEWPORT_MARGIN = 8;
// The card's fixed 260px width plus the popover shell's 4px padding on each
// side - matching this exactly is what makes the flip/clamp math correct
// rather than guessed from the tile's own (much narrower) box.
const PREVIEW_WIDTH = 268;

function computePosition(anchor: HTMLElement): Position {
  const rect = anchor.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  // Prefer above the tile; flip below only when there isn't room to clip-free.
  const fitsAbove = rect.top - GAP >= VIEWPORT_MARGIN;
  const placement: "above" | "below" = fitsAbove ? "above" : "below";
  const top = fitsAbove ? rect.top - GAP : rect.bottom + GAP;

  const center = rect.left + rect.width / 2;
  const left = Math.min(
    Math.max(center - PREVIEW_WIDTH / 2, VIEWPORT_MARGIN),
    viewportWidth - PREVIEW_WIDTH - VIEWPORT_MARGIN,
  );

  return { left, top, placement };
}

/**
 * A read-only, full-size copy of the tile's card, shown on hover so a
 * shrunken tile stays readable without a click. Portalled to <body> because
 * the tree canvas carries a `transform: scale()` for zoom, which makes
 * `position: fixed` resolve against the canvas instead of the viewport - see
 * AddMetricModal in MetricTreeView.tsx for the same constraint.
 */
export function MetricTilePreview({ metric, outcome, pastOutcomes, anchor }: MetricTilePreviewProps) {
  const [position, setPosition] = useState<Position | null>(null);

  // Position has to be measured from the DOM, so it can only be known after the
  // anchor is mounted. A stale position is left behind when the anchor goes away
  // rather than cleared, so the exit fade animates from where the preview was.
  useEffect(() => {
    if (!anchor) return;

    function recompute() {
      if (anchor) setPosition(computePosition(anchor));
    }

    recompute();
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
    };
  }, [anchor]);

  if (typeof document === "undefined") return null;

  // The card's own top-left corner is what should land at `position`, so the
  // "above" placement translates fully up by its own height first.
  const transform = position?.placement === "above" ? "translateY(-100%)" : "none";

  // AnimatePresence has to stay mounted for the exit fade to run, so the caller
  // keeps this component alive and drops `anchor` to null instead of unmounting.
  return createPortal(
    <AnimatePresence>
      {anchor && position && (
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: "fixed", left: position.left, top: position.top, transform }}
          className="z-50 pointer-events-none p-1 rounded-[var(--radius-lg)] border border-border-subtle bg-popover shadow-lg"
        >
          <MetricTreeCard metric={metric} outcome={outcome} pastOutcomes={pastOutcomes} display="full" interactive={false} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
