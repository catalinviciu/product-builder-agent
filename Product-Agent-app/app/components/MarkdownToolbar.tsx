"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold, Italic, Link, List, ListOrdered, Eye, EyeOff,
} from "lucide-react";

export function MarkdownBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <article className="max-w-none text-[var(--text-body)] leading-[var(--text-body-leading)] text-foreground/80
      [&_h1]:text-[var(--text-body)] [&_h2]:text-[var(--text-body)] [&_h3]:text-[var(--text-body)] [&_h4]:text-[var(--text-body)]
      [&_h1]:font-medium [&_h2]:font-medium [&_h3]:font-medium [&_h4]:font-medium
      [&_h1]:text-foreground/70 [&_h2]:text-foreground/70 [&_h3]:text-foreground/70 [&_h4]:text-foreground/70
      [&_h1]:mt-3 [&_h2]:mt-3 [&_h3]:mt-3 [&_h4]:mt-3
      [&_h1]:mb-1 [&_h2]:mb-1 [&_h3]:mb-1 [&_h4]:mb-1
      [&_p]:my-1.5
      [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5
      [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5
      [&_li]:my-0.5
      [&_strong]:text-foreground/90 [&_strong]:font-semibold
      [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline
      [&_code]:text-blue-600 dark:[&_code]:text-blue-300 [&_code]:text-xs [&_code]:bg-surface-hover [&_code]:px-1 [&_code]:rounded
      [&_blockquote]:text-muted-foreground/70 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong
      [&_blockquote]:pl-4 [&_blockquote]:text-[13px] [&_blockquote]:italic [&_blockquote]:my-2"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}

export function wrapSelection(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  before: string,
  after: string,
  draft: string,
  setDraft: (v: string) => void,
) {
  const el = ref.current;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = draft.slice(start, end);
  const replacement = selected ? `${before}${selected}${after}` : `${before}text${after}`;
  const newValue = draft.slice(0, start) + replacement + draft.slice(end);
  setDraft(newValue);
  // Restore cursor after React re-render
  requestAnimationFrame(() => {
    el.focus();
    const cursorPos = selected
      ? start + replacement.length
      : start + before.length; // place cursor on "text"
    const selEnd = selected ? cursorPos : cursorPos + 4;
    el.setSelectionRange(cursorPos, selEnd);
  });
}

export function insertLinePrefix(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  prefix: string,
  draft: string,
  setDraft: (v: string) => void,
) {
  const el = ref.current;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = draft.slice(start, end);
  if (selected) {
    const lines = selected.split("\n").map((line, i) =>
      prefix === "1. " ? `${i + 1}. ${line}` : `${prefix}${line}`
    );
    const replacement = lines.join("\n");
    setDraft(draft.slice(0, start) + replacement + draft.slice(end));
  } else {
    const insertion = `${prefix}item`;
    setDraft(draft.slice(0, start) + insertion + draft.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + 4);
    });
  }
}

export function MarkdownToolbar({
  textareaRef,
  draft,
  setDraft,
  showPreview,
  setShowPreview,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  draft: string;
  setDraft: (v: string) => void;
  showPreview: boolean;
  setShowPreview: (v: boolean) => void;
}) {
  const btnClass = "cursor-pointer p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground/60 hover:text-foreground transition-colors";
  return (
    <div className="flex items-center gap-0.5 pb-1.5 border-b border-border-subtle mb-1.5">
      <button type="button" title="Bold" className={btnClass} onClick={() => wrapSelection(textareaRef, "**", "**", draft, setDraft)}>
        <Bold size={14} />
      </button>
      <button type="button" title="Italic" className={btnClass} onClick={() => wrapSelection(textareaRef, "*", "*", draft, setDraft)}>
        <Italic size={14} />
      </button>
      <button type="button" title="Link" className={btnClass} onClick={() => wrapSelection(textareaRef, "[", "](url)", draft, setDraft)}>
        <Link size={14} />
      </button>
      <button type="button" title="Bullet list" className={btnClass} onClick={() => insertLinePrefix(textareaRef, "- ", draft, setDraft)}>
        <List size={14} />
      </button>
      <button type="button" title="Numbered list" className={btnClass} onClick={() => insertLinePrefix(textareaRef, "1. ", draft, setDraft)}>
        <ListOrdered size={14} />
      </button>
      <div className="w-px h-4 bg-border-subtle mx-1" />
      <button type="button" title={showPreview ? "Edit" : "Preview"} className={btnClass} onClick={() => setShowPreview(!showPreview)}>
        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}
