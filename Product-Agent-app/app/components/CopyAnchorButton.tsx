"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyAnchorButton({ text, tooltip }: { text: string; tooltip?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title={tooltip ?? "Copy context anchor for AI agent"}
      className="cursor-pointer p-1 rounded text-muted-foreground/50 hover:text-foreground transition-colors"
    >
      {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}
