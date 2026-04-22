"use client";

import { useState, useTransition } from "react";
import { updateNotes } from "./actions";

export function NotesEditor({
  id,
  initial,
}: {
  id: string;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [savedValue, setSavedValue] = useState(initial);
  const [pending, startTransition] = useTransition();

  const dirty = value !== savedValue;

  function save() {
    startTransition(async () => {
      await updateNotes(id, value);
      setSavedValue(value);
    });
  }

  return (
    <div className="space-y-2">
      <textarea
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Private notes — only admins can see these."
        className="w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-border-strong)] focus:ring-2 focus:ring-[color:var(--color-accent)]/20 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-[color:var(--color-text-subtle)]">
          {!dirty && savedValue !== "" && pending === false
            ? "Saved"
            : dirty
              ? "Unsaved changes"
              : ""}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="rounded-md bg-[color:var(--color-text)] text-[color:var(--color-surface)] px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
