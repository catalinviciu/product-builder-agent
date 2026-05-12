"use client";

import { useState } from "react";
import { Check, Copy, Bot } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CopyAnchorButton({ text, tooltip = "Copy context anchor", icon = "copy", toast: toastMessage }: { text: string; tooltip?: string; icon?: "copy" | "bot"; toast?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (toastMessage) showToast({ message: toastMessage, tone: "success" });
    setTimeout(() => setCopied(false), 2000);
  };
  const IconComponent = icon === "bot" ? Bot : Copy;
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="cursor-pointer p-1.5 rounded-md bg-surface-hover hover:bg-surface-3 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <IconComponent size={12} />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{copied ? "Copied!" : tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
