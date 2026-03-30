"use client";

import { useState } from "react";
import { Bot, Copy, Check, X } from "lucide-react";
import { useProductLine } from "@/app/lib/hooks/useProductLine";
import { buildNewProductLineSetupPrompt } from "@/app/lib/utils";
import { trackEvent } from "@/app/lib/analytics";

// ── Full intro card — shown on empty product line first visit ─────────────

interface CoworkerIntroCardProps {
  onDismiss: () => void;
}

export function CoworkerIntroCard({ onDismiss }: CoworkerIntroCardProps) {
  const productLine = useProductLine();
  const [copied, setCopied] = useState(false);

  function handleStart() {
    const prompt = buildNewProductLineSetupPrompt(productLine);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    trackEvent("Coworker Setup Started", { product_line_id: productLine.id });
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSkip() {
    trackEvent("Coworker Setup Skipped", { product_line_id: productLine.id });
    onDismiss();
  }

  return (
    <div className="relative flex flex-col gap-5 bg-surface-2 border border-border-default rounded-xl p-6 max-w-xl">
      <button
        onClick={handleSkip}
        className="absolute top-3 right-3 p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded"
        aria-label="Skip"
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0 rounded-lg bg-surface-3 p-2">
          <Bot size={18} className="text-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-foreground">Meet your Product Builder co-worker</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Product Agent is your Product Builder co-worker. They live in Claude Code or your preferred agentic tool — this app shows what you build together.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Click the button below and paste the copied prompt into Claude Code or your agentic tool. Your co-worker will interview you and set up your product structure — Business Outcome, Product Outcome, and first Opportunities — in plain language. No product management terminology required.
      </p>

      <div className="flex flex-col items-start gap-3">
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied — paste into your agent →" : "Define your product with Builder co-worker →"}
        </button>

        <button
          onClick={handleSkip}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── Compact button — shown in empty state after card is dismissed ──────────

export function CoworkerEmptyButton() {
  const productLine = useProductLine();
  const [copied, setCopied] = useState(false);

  function handleStart() {
    const prompt = buildNewProductLineSetupPrompt(productLine);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    trackEvent("Coworker Setup Started", { product_line_id: productLine.id });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleStart}
      className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-foreground px-3 py-2 rounded-lg border border-dashed border-border-default hover:border-border-strong transition-colors justify-center"
    >
      {copied ? <Check size={14} /> : <Bot size={14} />}
      {copied ? "Copied — paste into your agent →" : "Define your product with Builder co-worker →"}
    </button>
  );
}
