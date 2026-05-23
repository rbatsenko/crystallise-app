"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable; ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label ? `Copy ${label}` : "Copy"}
      className={`shrink-0 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-0.5 text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)] transition-colors ${className ?? ""}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
