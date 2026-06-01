"use client";

import React, { useState, useRef, useEffect } from "react";
import { FolderOpen, Pencil, Check, ChevronDown, ArrowLeft, HelpCircle, TriangleAlert, CircleCheck } from "lucide-react";
import { useAppStore } from "@/app/lib/store";
import { analyticsEmitter } from "@/app/lib/analytics-events";
import { trackEvent } from "@/app/lib/analytics";
import { cn } from "@/app/lib/utils";
import { buildCodebaseDetectionPrompt } from "@/app/lib/utils";
import type { AnalyticsPlatform, DesignSystemSettings, AnalyticsPlatformSettings } from "@/app/lib/schemas";
import { PRODUCT_AGENT_DESIGN_TEMPLATE } from "@/app/assets/design-templates/product-agent";
import { ConfirmDialog } from "./ConfirmDialog";
import { type SettingsFieldKey, isSettingsFieldFilled, joinFieldLabels } from "@/app/lib/settings-redirect";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/** Confidence chip — glyph encodes level (● high · ◐ medium · ○ low); neutral token color. */
function ConfidenceChip({ level }: { level: "high" | "medium" | "low" }) {
  const glyph = level === "high" ? "●" : level === "medium" ? "◐" : "○";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <span aria-hidden>{glyph}</span>
      {level} confidence
    </span>
  );
}

const ANALYTICS_OPTIONS: { label: string; value: AnalyticsPlatform }[] = [
  { label: "Pendo", value: "pendo" },
  { label: "Mixpanel", value: "mixpanel" },
  { label: "Amplitude", value: "amplitude" },
  { label: "Google Analytics", value: "google_analytics" },
  { label: "Other", value: "other" },
];

const STUCK_TIMEOUT_MS = 90_000;

export function ProductLineSettingsView() {
  const settingsProductLineId = useAppStore((s) => s.settingsProductLineId);
  const productLines = useAppStore((s) => s.productLines);
  const updateProductLineSettings = useAppStore((s) => s.updateProductLineSettings);
  const closeSettings = useAppStore((s) => s.closeSettings);
  const settingsRedirect = useAppStore((s) => s.settingsRedirect);
  const exitSettingsRedirect = useAppStore((s) => s.exitSettingsRedirect);

  const pl = settingsProductLineId ? productLines[settingsProductLineId] : null;
  const settings = pl?.settings;
  const savedPath = settings?.codebasePath ?? null;

  // Codebase state
  const [editing, setEditing] = useState(savedPath === null);
  const [inputValue, setInputValue] = useState(savedPath ?? "");

  // Design system state
  const savedSkillName =
    settings?.designSystem?.mode === "skill" ? (settings.designSystem.skillName ?? null) : null;
  const [dsExpanded, setDsExpanded] = useState(false);
  const [dsInput, setDsInput] = useState(savedSkillName ?? "");
  // Detection-review state (Story 4)
  const [showDsReasoning, setShowDsReasoning] = useState(false);
  const [showApReasoning, setShowApReasoning] = useState(false);
  const [dsMdCollapsedOverride, setDsMdCollapsedOverride] = useState<boolean | null>(null);

  // Analytics platform state
  const savedPlatform =
    settings?.analyticsPlatform?.mode === "manual" ? (settings.analyticsPlatform.platform ?? null) : null;
  const savedOtherName =
    settings?.analyticsPlatform?.mode === "manual" ? (settings.analyticsPlatform.otherName ?? null) : null;
  const [apExpanded, setApExpanded] = useState(false);
  const [otherInput, setOtherInput] = useState(savedOtherName ?? "");

  // Detection state
  const [detecting, setDetecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stuck, setStuck] = useState(false);
  const detectStartedAt = useRef<number | null>(null);
  const stuckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Snapshots taken when detection starts, so we can tell "fresh write from the
  // agent" apart from "this product line already had a design system before".
  const detectBaselineDs = useRef<DesignSystemSettings | undefined>(undefined);
  const detectBaselineAp = useRef<AnalyticsPlatformSettings | undefined>(undefined);

  // Section refs for redirect highlight + auto-scroll
  const sectionRefs = useRef<Partial<Record<SettingsFieldKey, HTMLDivElement | null>>>({});

  // Auto-scroll to first missing section when a redirect arrives
  useEffect(() => {
    if (!settingsRedirect || !settings) return;
    const firstMissing = settingsRedirect.missingFields.find(
      (k) => !isSettingsFieldFilled(settings, k) && sectionRefs.current[k]
    );
    if (firstMissing) {
      sectionRefs.current[firstMissing]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when a new redirect arrives
  }, [settingsRedirect]);

  // Confirm dialog state
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirm = (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }) => {
    setPendingConfirm(opts);
  };

  // Watch for detection results landing — exit detecting state when done
  useEffect(() => {
    if (!detecting) return;

    const dsChanged = settings?.designSystem !== detectBaselineDs.current;
    const apChanged = settings?.analyticsPlatform !== detectBaselineAp.current;
    const hasError = !!settings?.detectionError;

    if (dsChanged || apChanged || hasError) {
      setDetecting(false);
      setStuck(false);
      if (stuckTimerRef.current) {
        clearTimeout(stuckTimerRef.current);
        stuckTimerRef.current = null;
      }
    }
  }, [detecting, settings?.designSystem, settings?.analyticsPlatform, settings?.detectionError]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    };
  }, []);

  if (!pl || !settingsProductLineId) return null;

  const id = settingsProductLineId;

  // ── Redirect banner state ────────────────────────────────────────────────
  const redirect = settingsRedirect;
  const stillMissing: SettingsFieldKey[] =
    redirect && settings ? redirect.missingFields.filter((k) => !isSettingsFieldFilled(settings, k)) : [];
  const allResolved = !!redirect && stillMissing.length === 0;

  // Warning treatment applied to a settings section the redirect still needs filled.
  const missingSectionClass =
    "ring-1 ring-warning-border bg-warning-surface px-3 py-3 -mx-3 transition-shadow";
  // Amber "Needed" badge rendered next to a section heading when that field is still missing.
  const neededBadge = (
    <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-warning align-middle">
      <span className="size-1.5 rounded-full bg-warning" /> Needed
    </span>
  );

  // ── Codebase path validation ─────────────────────────────────────────────
  const validateCodebasePath = (value: string): { ok: boolean; reason?: string } => {
    const v = value.trim();
    if (v.length < 3) return { ok: false, reason: "Path is too short." };
    if (v.length > 500) return { ok: false, reason: "Path is too long (max 500 characters)." };
    if (!/[\\/]/.test(v)) return { ok: false, reason: "Doesn't look like a file path — must contain / or \\." };
    const isAbsolute = /^[A-Za-z]:[\\/]/.test(v) || v.startsWith("/");
    if (!isAbsolute) return { ok: false, reason: "Must be an absolute path (e.g. D:\\Projects\\app or /home/user/app)." };
    return { ok: true };
  };

  const EMPTY_ANALYTICS: AnalyticsPlatformSettings = { mode: "manual", platform: null, otherName: null };
  const CLEARED_DESIGN_SYSTEM: DesignSystemSettings = { mode: "skill", skillName: null };

  // ── Codebase handlers ────────────────────────────────────────────────────
  const handleSave = () => {
    const trimmed = inputValue.trim();

    // Clear path (empty input + existing path)
    if (!trimmed && savedPath) {
      requestConfirm({
        title: "Clear codebase?",
        message: "Your detected design system and analytics platform will also be cleared.",
        confirmLabel: "Clear",
        destructive: true,
        onConfirm: () => {
          updateProductLineSettings(id, {
            codebasePath: null,
            designSystem: CLEARED_DESIGN_SYSTEM,
            analyticsPlatform: EMPTY_ANALYTICS,
          });
          analyticsEmitter.emit("CodebaseSkipped", { productLineId: id });
          setEditing(false);
        },
      });
      return;
    }

    // No-op: empty with no prior path
    if (!trimmed) return;

    // Validate
    if (!validateCodebasePath(trimmed).ok) return;

    // Cascade: changing from one non-null path to a different non-null path
    if (savedPath && savedPath !== trimmed) {
      requestConfirm({
        title: "Change codebase?",
        message: "Your detected design system and analytics platform will be cleared so they can be re-detected.",
        confirmLabel: "Change",
        destructive: true,
        onConfirm: () => {
          updateProductLineSettings(id, {
            codebasePath: trimmed,
            designSystem: CLEARED_DESIGN_SYSTEM,
            analyticsPlatform: EMPTY_ANALYTICS,
          });
          analyticsEmitter.emit("CodebasePicked", { productLineId: id });
          setEditing(false);
        },
      });
      return;
    }

    // First save or same path
    updateProductLineSettings(id, { codebasePath: trimmed });
    analyticsEmitter.emit("CodebasePicked", { productLineId: id });
    setEditing(false);
  };

  const handleSkip = () => {
    updateProductLineSettings(id, { codebasePath: null });
    analyticsEmitter.emit("CodebaseSkipped", { productLineId: id });
    setEditing(false);
  };

  const handleEdit = () => {
    setInputValue(savedPath ?? "");
    setEditing(true);
  };

  // ── Design System handlers ───────────────────────────────────────────────
  const handleDsSave = () => {
    const trimmed = dsInput.trim();
    if (!trimmed) return;
    updateProductLineSettings(id, { designSystem: { mode: "skill", skillName: trimmed } });
    analyticsEmitter.emit("ManualSettingSaved", { Field: "designSystem", Mode: "skill", Source: "settings-page" });
    setDsExpanded(false);
  };

  // ── Analytics Platform handlers ──────────────────────────────────────────
  const handlePlatformSelect = (platform: AnalyticsPlatform) => {
    const wasDetected = settings?.analyticsPlatform?.mode === "detected";
    const detectedPlatform = wasDetected ? (settings?.analyticsPlatform as { platform?: AnalyticsPlatform | null }).platform : null;
    // E2: warn before discarding a detected result
    // Note: radio may show the new value briefly until the dialog resolves (uncontrolled DOM); will revert on cancel.
    if (wasDetected && platform !== detectedPlatform) {
      requestConfirm({
        title: "Discard auto-detected platform?",
        message: "Switching will discard the auto-detected analytics platform.",
        confirmLabel: "Switch",
        destructive: true,
        onConfirm: () => {
          if (platform === "other") {
            updateProductLineSettings(id, { analyticsPlatform: { mode: "manual", platform: "other", otherName: savedOtherName } });
          } else {
            updateProductLineSettings(id, { analyticsPlatform: { mode: "manual", platform, otherName: null } });
          }
          analyticsEmitter.emit("ManualSettingSaved", { Field: "analyticsPlatform", Mode: "manual", Source: "settings-page" });
          trackEvent("DetectionFieldEdited", { Field: "analyticsPlatform", FromMode: "detected", ToMode: "manual" });
        },
      });
      return;
    }
    if (platform === "other") {
      updateProductLineSettings(id, { analyticsPlatform: { mode: "manual", platform: "other", otherName: savedOtherName } });
    } else {
      updateProductLineSettings(id, { analyticsPlatform: { mode: "manual", platform, otherName: null } });
    }
    analyticsEmitter.emit("ManualSettingSaved", { Field: "analyticsPlatform", Mode: "manual", Source: "settings-page" });
    if (wasDetected) trackEvent("DetectionFieldEdited", { Field: "analyticsPlatform", FromMode: "detected", ToMode: "manual" });
  };

  const handleOtherSave = () => {
    const trimmed = otherInput.trim();
    if (!trimmed) return;
    updateProductLineSettings(id, { analyticsPlatform: { mode: "manual", platform: "other", otherName: trimmed } });
    analyticsEmitter.emit("ManualSettingSaved", { Field: "analyticsPlatform", Mode: "manual", Source: "settings-page" });
  };

  // ── Detection handlers ───────────────────────────────────────────────────
  const startDetecting = () => {
    detectBaselineDs.current = settings?.designSystem;
    detectBaselineAp.current = settings?.analyticsPlatform;
    setDetecting(true);
    setStuck(false);
    detectStartedAt.current = Date.now();
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    stuckTimerRef.current = setTimeout(() => {
      setStuck(true);
    }, STUCK_TIMEOUT_MS);
  };

  const cancelDetecting = () => {
    setDetecting(false);
    setStuck(false);
    if (stuckTimerRef.current) {
      clearTimeout(stuckTimerRef.current);
      stuckTimerRef.current = null;
    }
  };

  const handleCopyPrompt = () => {
    const prompt = buildCodebaseDetectionPrompt(pl);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent("DetectionPromptCopied", { product_line_id: pl.id });
  };

  // ── Design System review handlers (Story 4) ──────────────────────────────
  const handleDsMarkdownChange = (value: string) => {
    const cur = settings?.designSystem;
    if (cur?.mode !== "designMd") return;
    const wasDetected = cur.source === "detected";
    // Editing flips source -> "edited" and drops confidence/reasoning; library/tokensHint kept for orientation.
    updateProductLineSettings(id, {
      designSystem: {
        mode: "designMd",
        designMd: value,
        source: "edited",
        library: cur.library ?? null,
        tokensHint: cur.tokensHint ?? null,
      },
    });
    if (wasDetected) {
      trackEvent("DetectionFieldEdited", { Field: "designSystem", FromMode: "detected", ToMode: "edited" });
    }
  };

  const handleUseTemplate = () => {
    const cur = settings?.designSystem;
    const hasExisting = cur?.mode === "designMd" && !!cur.designMd;
    const doUseTemplate = () => {
      updateProductLineSettings(id, {
        designSystem: {
          mode: "designMd",
          designMd: PRODUCT_AGENT_DESIGN_TEMPLATE,
          source: "template",
          library: "Product Agent (Tailwind + shadcn/ui)",
          tokensHint: "colors_and_type.css",
        },
      });
      setDsMdCollapsedOverride(false);
      setDsExpanded(false);
    };
    if (hasExisting) {
      requestConfirm({
        title: "Replace design system?",
        message: "Your current design system content will be overwritten with the Product Agent template.",
        confirmLabel: "Replace",
        destructive: true,
        onConfirm: doUseTemplate,
      });
      return;
    }
    doUseTemplate();
  };

  const handleSwitchToSkill = () => {
    const cur = settings?.designSystem;
    const wasDetected = cur?.mode === "designMd" && cur.source === "detected";
    requestConfirm({
      title: "Switch to skill mode?",
      message: "This clears the detected design system content.",
      confirmLabel: "Switch",
      destructive: true,
      onConfirm: () => {
        updateProductLineSettings(id, { designSystem: { mode: "skill", skillName: null } });
        if (wasDetected) {
          trackEvent("DetectionFieldEdited", { Field: "designSystem", FromMode: "detected", ToMode: "skill" });
        }
        setDsInput("");
        setShowDsReasoning(false);
        setDsExpanded(true);
      },
    });
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const isSkipped = savedPath === null;
  const dsSaved = savedSkillName !== null;
  const apSaved = savedPlatform !== null;
  const detectionError = settings?.detectionError ?? null;

  // Listening = detecting, not stuck, no error
  const isListening = detecting && !stuck && !detectionError;

  // ── Detection-review derived flags (Story 4) ─────────────────────────────
  const dsObj = settings?.designSystem;
  const dsIsMd = dsObj?.mode === "designMd";
  const dsSource = dsIsMd ? dsObj.source : null;
  const dsMarkdown = dsIsMd ? dsObj.designMd : "";
  const dsConfidence = dsIsMd ? (dsObj.confidence ?? null) : null;
  const dsReasoning = dsIsMd ? (dsObj.reasoning ?? null) : null;
  const dsLibrary = dsIsMd ? (dsObj.library ?? null) : null;
  const dsTokensHint = dsIsMd ? (dsObj.tokensHint ?? null) : null;
  // High confidence collapses by default; medium/low expand so the editor + TODOs are visible.
  const dsDefaultCollapsed = dsSource === "detected" && dsConfidence === "high";
  const dsCollapsed = dsMdCollapsedOverride ?? dsDefaultCollapsed;

  const apObj = settings?.analyticsPlatform;
  const apDetected = apObj?.mode === "detected";
  const apDetectedPlatform = apDetected ? (apObj.platform ?? null) : null;
  const apConfidence = apDetected ? (apObj.confidence ?? null) : null;
  const apReasoning = apDetected ? (apObj.reasoning ?? null) : null;
  const apDetectedLabel =
    apDetectedPlatform === "other"
      ? "Other"
      : ANALYTICS_OPTIONS.find((o) => o.value === apDetectedPlatform)?.label ?? apDetectedPlatform ?? "";

  return (
    <div className="px-8 py-8 max-w-2xl">
      {/* Redirect banner — only rendered when an AI action sent the user here */}
      {redirect && (
        <div className="sticky top-0 z-20 -mx-8 px-8 pt-2 pb-3 mb-4 bg-background/95 backdrop-blur">
          <div
            className={cn(
              "rounded-xl px-4 py-3 flex flex-col gap-3 border-l-2",
              allResolved
                ? "border border-border-default border-l-border-default bg-surface-3"
                : "border-l-warning bg-warning-surface",
            )}
          >
            <div className="flex items-start gap-2.5">
              {allResolved
                ? <CircleCheck size={15} className="text-foreground shrink-0 mt-0.5" />
                : <TriangleAlert size={15} className="text-warning shrink-0 mt-0.5" />}
              <p className="text-sm text-foreground">
                {allResolved
                  ? <><span className="font-medium">{redirect.actionName}</span> — all set. Ready to return.</>
                  : <><span className="font-medium">{redirect.actionName}</span> needs {joinFieldLabels(stillMissing)}. Add {stillMissing.length > 1 ? "them" : "it"} below to continue.</>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {allResolved && (
                <button
                  onClick={exitSettingsRedirect}
                  className="cursor-pointer text-xs px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 active:opacity-85 focus:outline-2 focus:outline-border-focus transition-opacity font-medium"
                >
                  Return to {redirect.actionName}
                </button>
              )}
              <button
                onClick={exitSettingsRedirect}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors"
              >
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={closeSettings}
          aria-label="Back to product line"
          className="cursor-pointer flex items-center gap-1.5 text-sm rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors px-2 py-1 -ml-2"
        >
          <ArrowLeft size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">{pl.name}</span>
          <span className="text-muted-foreground/40 mx-0.5">·</span>
          <span className="text-foreground font-medium">Settings</span>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* ── Codebase section ── */}
        <div
          ref={(el) => { sectionRefs.current.codebasePath = el; }}
          className={cn(
            "flex flex-col gap-4 rounded-xl transition-shadow",
            stillMissing.includes("codebasePath") && missingSectionClass
          )}
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Codebase
              {stillMissing.includes("codebasePath") && neededBadge}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Link the folder where this product line&apos;s code lives. Used to know where to apply code changes, and to detect your design system and analytics platform below.
            </p>
          </div>

          {savedPath && !editing ? (
            <div className="rounded-xl border border-border-default bg-surface-1 px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <FolderOpen size={14} className="text-muted-foreground/50 shrink-0" />
                <span className="text-xs font-mono text-foreground flex-1 truncate">{savedPath}</span>
                <button
                  onClick={handleEdit}
                  aria-label="Edit codebase path"
                  className="cursor-pointer p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors shrink-0"
                >
                  <Pencil size={12} />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => requestConfirm({
                    title: "Clear codebase?",
                    message: "Your detected design system and analytics platform will also be cleared.",
                    confirmLabel: "Clear",
                    destructive: true,
                    onConfirm: () => {
                      updateProductLineSettings(id, { codebasePath: null, designSystem: { mode: "skill", skillName: null }, analyticsPlatform: EMPTY_ANALYTICS });
                      analyticsEmitter.emit("CodebaseSkipped", { productLineId: id });
                    },
                  })}
                  className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : !editing && savedPath === null ? (
            <div className="rounded-xl border border-border-subtle bg-surface-1 px-4 py-3 flex items-center gap-3">
              <span className={cn("text-xs flex-1", stillMissing.includes("codebasePath") ? "text-muted-foreground" : "text-muted-foreground/50")}>No codebase linked</span>
              <button
                onClick={handleEdit}
                className={cn(
                  "cursor-pointer text-xs px-2.5 py-1 rounded-md focus:outline-2 focus:outline-border-focus transition-colors",
                  stillMissing.includes("codebasePath")
                    ? "bg-foreground text-background hover:opacity-90 active:opacity-85 font-medium"
                    : "bg-surface-3 hover:bg-surface-active active:bg-surface-active text-foreground",
                )}
              >
                Add a codebase
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
              {!savedPath && (
                <h3 className="text-sm font-medium text-foreground">
                  Where does this product line&apos;s code live?
                </h3>
              )}
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`D:\\Projects\\my-app`}
                className="bg-surface-2 border border-border-strong rounded-md px-3 py-2 text-sm text-foreground hover:border-border-strong focus:outline-none focus:border-border-focus font-mono"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") {
                    if (savedPath) { setEditing(false); } else { handleSkip(); }
                  }
                }}
              />
              <p className="text-xs text-muted-foreground/60">
                Open your file explorer and copy/paste the codebase folder&apos;s path here.
              </p>
              {inputValue.trim() && !validateCodebasePath(inputValue).ok && (
                <p className="text-xs text-destructive">
                  {validateCodebasePath(inputValue).reason}
                </p>
              )}
              <div className={cn("flex items-center", savedPath ? "gap-2" : "flex-col items-start gap-2")}>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={inputValue.trim().length > 0 && !validateCodebasePath(inputValue).ok}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  {savedPath && (
                    <button
                      onClick={() => setEditing(false)}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus text-muted-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {!savedPath && (
                  <button
                    onClick={handleSkip}
                    className="cursor-pointer text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    I don&apos;t have a codebase yet — set up without one.
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Inline notice (SKIPPED state only) ── */}
        {isSkipped && (
          <p className="text-xs text-muted-foreground/60 border-l-2 border-border-subtle pl-3">
            Plan &amp; Implement needs a codebase. Prototype needs a design-system skill. Story AC writing needs an analytics platform.
          </p>
        )}

        {/* ── Detect from codebase panel ── only shown when codebase is linked */}
        {savedPath !== null && (() => {
          const detectionDone =
            (dsObj?.mode === "designMd") ||
            (apObj?.mode === "detected");
          if (detectionDone && !detecting) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60">Design system and analytics detected.</span>
                <button
                  onClick={startDetecting}
                  className="cursor-pointer text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Re-detect
                </button>
              </div>
            );
          }
          return (
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-4 flex flex-col gap-3">
              {detecting ? (
                <>
                  {/* Prompt code block */}
                  <div className="bg-surface-2 border border-border-subtle rounded-md p-3 font-mono text-xs whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
                    {buildCodebaseDetectionPrompt(pl)}
                  </div>

                  {/* Copy button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopyPrompt}
                      className="cursor-pointer flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={12} />
                          Copied!
                        </>
                      ) : (
                        "Copy prompt"
                      )}
                    </button>

                    {/* Listening indicator */}
                    {isListening && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                        Listening for results…
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-muted-foreground">
                    Paste into Claude Code. This page updates automatically.
                  </p>

                  {/* Error state */}
                  {detectionError && (
                    <p className="text-xs text-destructive">{detectionError}</p>
                  )}

                  {/* Stuck state */}
                  {stuck && !detectionError && (
                    <p className="text-xs text-muted-foreground">
                      Detection seems stuck — try pasting again or set values manually.
                    </p>
                  )}

                  {/* Cancel */}
                  <button
                    onClick={cancelDetecting}
                    className="cursor-pointer self-start text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">Detect from codebase</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Scan your codebase to auto-fill your design system and analytics platform below. You&apos;ll review the results before they&apos;re applied.
                      </p>
                    </div>
                    <button
                      onClick={startDetecting}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors shrink-0"
                    >
                      Detect
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* ── Design System section ── */}
        <div
          ref={(el) => { sectionRefs.current.designSystem = el; }}
          className={cn(
            "flex flex-col gap-4 rounded-xl transition-shadow",
            stillMissing.includes("designSystem") && missingSectionClass
          )}
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Design System
              {(stillMissing.includes("designSystem") || isSkipped) && neededBadge}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Point to your design-system skill file so AI actions can generate on-brand prototypes.
            </p>
          </div>

          {/* Normal Design System body — detected/template/edited markdown, skill, or empty */}
          {!detecting && (
            <>
              {dsIsMd ? (
                <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
                  {/* Header: confidence chip + reasoning reveal + collapse */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {dsSource === "detected" && dsConfidence ? (
                      <ConfidenceChip level={dsConfidence} />
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {dsSource === "template" ? "From template" : "Edited"}
                      </span>
                    )}
                    {dsSource === "detected" && dsReasoning && (
                      <button
                        onClick={() => setShowDsReasoning((v) => !v)}
                        className="cursor-pointer text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Why?
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      onClick={() => setDsMdCollapsedOverride(!dsCollapsed)}
                      aria-label={dsCollapsed ? "Expand design system editor" : "Collapse design system editor"}
                      className="cursor-pointer p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors"
                    >
                      <ChevronDown size={14} className={cn("transition-transform", dsCollapsed && "-rotate-90")} />
                    </button>
                  </div>

                  {showDsReasoning && dsReasoning && (
                    <p className="text-xs text-muted-foreground">{dsReasoning}</p>
                  )}

                  {!dsCollapsed && (
                    <textarea
                      value={dsMarkdown}
                      onChange={(e) => handleDsMarkdownChange(e.target.value)}
                      spellCheck={false}
                      className="bg-surface-2 border border-border-strong rounded-md px-3 py-2 text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:border-border-focus min-h-[220px] resize-y"
                    />
                  )}

                  {(dsLibrary || dsTokensHint) && (
                    <p className="text-xs text-muted-foreground/60">
                      {dsLibrary ?? "Design system"}{dsTokensHint ? ` · tokens: ${dsTokensHint}` : ""}
                    </p>
                  )}

                  {/* Action row — visible whenever design system has content (detected, template, or edited) */}
                  {!dsCollapsed && (
                    <>
                      <p className="text-xs text-muted-foreground/60">
                        {dsSource === "template"
                          ? "Using the Product Agent template. Keep editing, switch to a skill file, or clear it."
                          : "Auto-detected from your codebase. Keep editing, switch to a skill file, or clear it."}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={handleSwitchToSkill}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                        >
                          Switch to skill mode
                        </button>
                        <button
                          onClick={() => requestConfirm({
                            title: "Clear design system?",
                            message: "The current design system will be removed.",
                            confirmLabel: "Clear",
                            destructive: true,
                            onConfirm: () => updateProductLineSettings(id, { designSystem: { mode: "skill", skillName: null } }),
                          })}
                          className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : !dsExpanded ? (
                dsSaved ? (
                  <div className="rounded-xl border border-border-default bg-surface-1 px-4 py-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-foreground flex-1 truncate">{savedSkillName}</span>
                      <button
                        onClick={() => { setDsInput(savedSkillName ?? ""); setDsExpanded(true); }}
                        aria-label="Edit design system skill path"
                        className="cursor-pointer p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors shrink-0"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => requestConfirm({
                          title: "Clear design system?",
                          message: "The linked design system skill will be removed.",
                          confirmLabel: "Clear",
                          destructive: true,
                          onConfirm: () => updateProductLineSettings(id, { designSystem: { mode: "skill", skillName: null } }),
                        })}
                        className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-subtle bg-surface-1 px-4 py-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className={cn("text-xs flex-1", stillMissing.includes("designSystem") ? "text-muted-foreground" : "text-muted-foreground/50")}>
                        {savedPath ? "No design system detected from the codebase" : "No design system linked"}
                      </span>
                      <button
                        onClick={() => { setDsInput(""); setDsExpanded(true); }}
                        className={cn(
                          "cursor-pointer text-xs px-2.5 py-1 rounded-md focus:outline-2 focus:outline-border-focus transition-colors shrink-0",
                          stillMissing.includes("designSystem")
                            ? "bg-foreground text-background hover:opacity-90 active:opacity-85 font-medium"
                            : "bg-surface-3 hover:bg-surface-active active:bg-surface-active text-foreground",
                        )}
                      >
                        Set up
                      </button>
                    </div>
                    <button
                      onClick={handleUseTemplate}
                      className="cursor-pointer self-start text-xs px-2.5 py-1 rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors"
                    >
                      Use Product Agent&apos;s design system as a starting template
                    </button>
                  </div>
                )
              ) : (
                /* Input state (SKIPPED always visible, or PICKED when expanded) */
                <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
                  {!dsSaved && isSkipped && (
                    <h3 className="text-sm font-medium text-foreground">
                      Where is your design-system skill file?
                    </h3>
                  )}
                  <input
                    value={dsInput}
                    onChange={(e) => setDsInput(e.target.value)}
                    placeholder="D:\Projects\my-app\.claude\skills\design-system\SKILL.md"
                    className="bg-surface-2 border border-border-strong rounded-md px-3 py-2 text-sm text-foreground hover:border-border-strong focus:outline-none focus:border-border-focus font-mono"
                    autoFocus={isSkipped ? false : true}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDsSave();
                      if (e.key === "Escape" && !isSkipped) setDsExpanded(false);
                    }}
                  />
                  <p className="text-xs text-muted-foreground/60">
                    Open your file explorer and copy/paste the skill file&apos;s path here.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDsSave}
                      disabled={!dsInput.trim()}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setDsExpanded(false)}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus text-muted-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Analytics Platform section ── */}
        <div
          ref={(el) => { sectionRefs.current.analyticsPlatform = el; }}
          className={cn(
            "flex flex-col gap-4 rounded-xl transition-shadow",
            stillMissing.includes("analyticsPlatform") && missingSectionClass
          )}
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Analytics Platform
              {(stillMissing.includes("analyticsPlatform") || isSkipped) && neededBadge}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your analytics tool so AI actions can generate the right tracking events.
            </p>
          </div>

          {/* Detected review state */}
          {apDetected && !apExpanded ? (
            <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-foreground">{apDetectedLabel}</span>
                {apConfidence && <ConfidenceChip level={apConfidence} />}
                {apReasoning && (
                  <button
                    onClick={() => setShowApReasoning((v) => !v)}
                    className="cursor-pointer text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Why?
                  </button>
                )}
              </div>
              {showApReasoning && apReasoning && (
                <p className="text-xs text-muted-foreground">{apReasoning}</p>
              )}
              <p className="text-xs text-muted-foreground/60">Select a different platform to override:</p>
              <div className="flex flex-col gap-1">
                {ANALYTICS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <input
                      type="radio"
                      name={`analytics-${id}`}
                      value={opt.value}
                      checked={apDetectedPlatform === opt.value}
                      onChange={() => handlePlatformSelect(opt.value)}
                      className="accent-foreground"
                    />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
              {/* E3: Clear detection */}
              <button
                onClick={() => requestConfirm({
                  title: "Clear detected analytics platform?",
                  message: "The auto-detected analytics platform will be removed.",
                  confirmLabel: "Clear",
                  destructive: true,
                  onConfirm: () => updateProductLineSettings(id, { analyticsPlatform: EMPTY_ANALYTICS }),
                })}
                className="cursor-pointer self-start text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
              >
                Clear detection
              </button>
            </div>
          ) : !apExpanded ? (
            apSaved ? (
              <div className="rounded-xl border border-border-default bg-surface-1 px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground flex-1">
                    {savedPlatform === "other"
                      ? savedOtherName ?? "Other"
                      : ANALYTICS_OPTIONS.find((o) => o.value === savedPlatform)?.label ?? savedPlatform}
                  </span>
                  <button
                    onClick={() => setApExpanded(true)}
                    aria-label="Edit analytics platform"
                    className="cursor-pointer p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors shrink-0"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => requestConfirm({
                      title: "Clear analytics platform?",
                      message: "The selected analytics platform will be removed.",
                      confirmLabel: "Clear",
                      destructive: true,
                      onConfirm: () => updateProductLineSettings(id, { analyticsPlatform: EMPTY_ANALYTICS }),
                    })}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-2 border border-border-default hover:bg-surface-hover hover:border-border-strong active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-surface-1 px-4 py-3 flex items-center gap-3">
                <span className={cn("text-xs flex-1", stillMissing.includes("analyticsPlatform") ? "text-muted-foreground" : "text-muted-foreground/50")}>No platform selected</span>
                <button
                  onClick={() => setApExpanded(true)}
                  className={cn(
                    "cursor-pointer text-xs px-2.5 py-1 rounded-md focus:outline-2 focus:outline-border-focus transition-colors",
                    stillMissing.includes("analyticsPlatform")
                      ? "bg-foreground text-background hover:opacity-90 active:opacity-85 font-medium"
                      : "bg-surface-3 hover:bg-surface-active active:bg-surface-active text-foreground",
                  )}
                >
                  Set up
                </button>
              </div>
            )
          ) : (
            /* Radio group — always visible in SKIPPED state, expanded in PICKED state */
            <div className="rounded-xl border border-border-strong bg-surface-1 p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                {ANALYTICS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <input
                      type="radio"
                      name={`analytics-${id}`}
                      value={opt.value}
                      checked={savedPlatform === opt.value}
                      onChange={() => handlePlatformSelect(opt.value)}
                      className="accent-foreground"
                    />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Other free-text input — show when "other" is selected */}
              {savedPlatform === "other" && (
                <div className="flex flex-col gap-2 pt-1 border-t border-border-subtle">
                  <input
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    placeholder="e.g. PostHog, Heap, FullStory…"
                    className="bg-surface-2 border border-border-strong rounded-md px-3 py-2 text-sm text-foreground hover:border-border-strong focus:outline-none focus:border-border-focus"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleOtherSave();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleOtherSave}
                      disabled={!otherInput.trim()}
                      className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active active:bg-surface-active focus:outline-2 focus:outline-border-focus text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                  {savedOtherName && (
                    <p className="text-xs text-muted-foreground/60">Currently saved: {savedOtherName}</p>
                  )}
                </div>
              )}

              <button
                onClick={() => setApExpanded(false)}
                className="cursor-pointer self-start text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus text-muted-foreground transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* ── Prototype output path section ── */}
        <div className="flex flex-col gap-4 rounded-xl">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Prototype output path</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Base folder where prototypes for this product line are saved.
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-surface-1 px-4 py-3 flex items-center gap-3">
            <FolderOpen size={14} className="text-muted-foreground/50 shrink-0" />
            <span className="text-xs font-mono text-foreground flex-1">Product-Agent-app/public/prototypes/</span>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="About the prototype output path"
                    className="cursor-pointer p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-surface-hover active:bg-surface-active focus:outline-2 focus:outline-border-focus transition-colors shrink-0"
                  >
                    <HelpCircle size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Prototypes are saved under this folder. Each prototype creates its own subfolder based on the product line, parent opportunity, and solution when you trigger the Prototype action.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingConfirm !== null}
        title={pendingConfirm?.title ?? ""}
        message={pendingConfirm?.message ?? ""}
        confirmLabel={pendingConfirm?.confirmLabel}
        destructive={pendingConfirm?.destructive}
        onConfirm={() => {
          pendingConfirm?.onConfirm();
          setPendingConfirm(null);
        }}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}
