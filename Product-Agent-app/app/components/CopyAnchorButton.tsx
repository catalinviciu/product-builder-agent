"use client";

import { useState } from "react";
import { Check, Copy, Bot } from "lucide-react";

export function CopyAnchorButton({ text, tooltip, icon = "copy" }: { text: string; tooltip?: string; icon?: "copy" | "bot" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const IconComponent = icon === "bot" ? Bot : Copy;
  return (
    <button
      onClick={handleCopy}
      title={tooltip ?? "Copy context anchor for AI agent"}
      className="cursor-pointer p-1 rounded text-muted-foreground/50 hover:text-foreground transition-colors"
    >
      {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <IconComponent size={14} />}
    </button>
  );
}
