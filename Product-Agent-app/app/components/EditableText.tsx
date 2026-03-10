"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { MarkdownBlock, MarkdownToolbar } from "./MarkdownToolbar";

export function EditableText({ value, onSave, as = "input", placeholder, maxLength }: {
  value: string; onSave: (v: string) => void; as?: "input" | "textarea"; placeholder?: string; maxLength?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  if (!editing) {
    const display = as === "textarea" && value
      ? <MarkdownBlock content={value} />
      : <span>{value || <span className="text-muted-foreground/40 italic">{placeholder || "Click to edit"}</span>}</span>;

    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="cursor-pointer text-left group inline-flex items-start gap-1.5 hover:bg-surface-hover rounded-md px-1 -mx-1 transition-colors"
      >
        {display}
        <Pencil size={12} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
      </button>
    );
  }

  const save = () => { onSave(draft); setEditing(false); };
  const cancel = () => setEditing(false);

  const common = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && as === "input") save();
      if (e.key === "Escape") cancel();
    },
    className: "w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-focus",
  };

  return (
    <div className="flex flex-col gap-2">
      {as === "textarea" ? (
        <div className="flex flex-col">
          <MarkdownToolbar
            textareaRef={ref as React.RefObject<HTMLTextAreaElement | null>}
            draft={draft}
            setDraft={setDraft}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />
          {showPreview ? (
            <div className="w-full bg-surface-hover border border-border-strong rounded-lg px-3 py-2 text-sm min-h-[6rem]">
              {draft ? <MarkdownBlock content={draft} /> : <span className="text-muted-foreground/40 italic">Nothing to preview</span>}
            </div>
          ) : (
            <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} rows={4} {...common} />
          )}
        </div>
      ) : (
        <input ref={ref as React.RefObject<HTMLInputElement>} {...(maxLength ? { maxLength } : {})} {...common} />
      )}
      <div className="flex gap-2">
        <button onClick={save} className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-surface-3 hover:bg-surface-active text-foreground transition-colors flex items-center gap-1">
          <Check size={12} /> Save
        </button>
        <button onClick={cancel} className="cursor-pointer text-xs px-2.5 py-1 rounded-md hover:bg-surface-hover text-muted-foreground transition-colors flex items-center gap-1">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}
