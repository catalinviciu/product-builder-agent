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
  const [phase, setPhase] = useState<"intro" | "copied">("intro");

  function handleStart() {
    const prompt = buildNewProductLineSetupPrompt(productLine);
    navigator.clipboard.writeText(prompt);
    trackEvent("Coworker Setup Started", { product_line_id: productLine.id });
    setPhase("copied");
  }

  function handleRecopy() {
    const prompt = buildNewProductLineSetupPrompt(productLine);
    navigator.clipboard.writeText(prompt);
    trackEvent("Coworker Prompt Recopied", { product_line_id: productLine.id });
  }

  function handleSkip() {
    trackEvent("Coworker Setup Skipped", { product_line_id: productLine.id });
    onDismiss();
  }

  function handleDone() {
    trackEvent("Coworker Setup Acknowledged", { product_line_id: productLine.id });
    onDismiss();
  }

  if (phase === "copied") {
    return (
      <div className="relative flex flex-col bg-surface-2 border border-border-default rounded-xl overflow-hidden">
        <button
          onClick={handleDone}
          className="absolute top-3 right-3 p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded z-10"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        {/* Hero banner */}
        <div className="flex items-center gap-4 bg-surface-3 px-6 py-5 border-b border-border-subtle">
          <div className="flex-shrink-0 rounded-xl bg-surface-2 p-3">
            <Check size={22} className="text-foreground" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Prompt copied — now paste it in your agent</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your co-worker is ready to start the conversation.</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">1</div>
              <div>
                <p className="text-sm font-medium text-foreground">Open Claude Code and paste</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Switch to Claude Code (or your preferred agentic tool), paste the copied prompt, and press Enter. Your co-worker will take it from there.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">2</div>
              <div>
                <p className="text-sm font-medium text-foreground">Answer their questions</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Your co-worker will interview you about your product in plain language — no product management terminology required.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">3</div>
              <div>
                <p className="text-sm font-medium text-foreground">Come back when they&apos;re done</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  After the conversation, your co-worker will automatically fill in your Business Outcome, Product Outcome, and first Opportunities — right here in this app. Come back once the session is complete and your tree will be ready.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleRecopy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Copy size={12} /> Re-copy the prompt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col bg-surface-2 border border-border-default rounded-xl overflow-hidden">
      <button
        onClick={handleSkip}
        className="absolute top-3 right-3 p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded z-10"
        aria-label="Skip"
      >
        <X size={14} />
      </button>

      {/* Hero banner */}
      <div className="flex items-center gap-4 bg-surface-3 px-6 py-5 border-b border-border-subtle">
        <div className="flex-shrink-0 rounded-xl bg-surface-2 p-3">
          <Bot size={22} className="text-foreground" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Meet your Product Builder co-worker</h2>
          <p className="text-sm text-muted-foreground mt-0.5">They live in Claude Code — this app shows what you build together.</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Product Agent is your AI co-worker for product thinking. You have conversations with them in Claude Code or your preferred agentic tool, and this app keeps a living record of what you build together — your Business Outcomes, Product Outcomes, Opportunities, Solutions, and more.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To get started, click the button below. It copies a setup prompt to your clipboard. Paste it into Claude Code and your co-worker will interview you about your product in plain language — no product management terminology required — and automatically set up your product structure here.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Copy size={14} />
            Define your product with Builder co-worker →
          </button>

          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
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
