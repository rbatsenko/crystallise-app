"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  id: string;
  name: string;
  rows: number;
  maxLength: number;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const textareaClasses =
  "w-full bg-cream border border-stone/40 rounded-none px-4 py-3 font-[family-name:var(--font-body)] text-charcoal text-sm focus:outline-none focus:border-gold transition-colors";

// text-sm leading is 20px, py-3 adds 24px of vertical padding.
const LINE_HEIGHT = 20;
const VERTICAL_PADDING = 24;

function autoGrow(el: HTMLTextAreaElement, minHeight: number) {
  el.style.height = "auto";
  el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
}

export default function ExpandableTextarea({
  id,
  name,
  rows,
  maxLength,
  placeholder,
  value,
  onChange,
  label,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inlineRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = rows * LINE_HEIGHT + VERTICAL_PADDING;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (inlineRef.current) autoGrow(inlineRef.current, minHeight);
  }, [value, minHeight]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    const len = modalRef.current?.value.length ?? 0;
    modalRef.current?.setSelectionRange(len, len);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <label
          htmlFor={id}
          className="block font-[family-name:var(--font-display)] text-sm text-charcoal"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-slate hover:text-charcoal font-[family-name:var(--font-body)] cursor-pointer"
          aria-label={`Open ${label} in larger editor`}
        >
          Expand ⤢
        </button>
      </div>
      <textarea
        ref={inlineRef}
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
        className={`${textareaClasses} resize-none overflow-hidden`}
        style={{ minHeight }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-slate/50 mt-1 text-right font-[family-name:var(--font-body)]">
        {value.length}/{maxLength}
      </p>

      {expanded && mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${label} editor`}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExpanded(false)}
          >
            <div
              className="bg-warm-gray w-full max-w-3xl max-h-[90vh] flex flex-col p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-charcoal">
                  {label}
                </h2>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="text-charcoal/60 hover:text-charcoal text-3xl leading-none cursor-pointer"
                  aria-label="Close editor"
                >
                  ×
                </button>
              </div>
              <textarea
                ref={modalRef}
                maxLength={maxLength}
                className={`${textareaClasses} flex-1 resize-none`}
                style={{ minHeight: "60vh" }}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate/60 font-[family-name:var(--font-body)]">
                  Press Esc to close - your text is kept.
                </p>
                <p className="text-xs text-slate/60 font-[family-name:var(--font-body)]">
                  {value.length}/{maxLength}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
