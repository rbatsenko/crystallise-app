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
        placeholder="Private notes — only admins can read these."
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:bg-slate-900 dark:border-slate-700"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900"
        >
          {pending ? "Saving…" : "Save notes"}
        </button>
        {!dirty && savedValue !== "" && (
          <span className="text-xs text-slate-500">Saved.</span>
        )}
      </div>
    </div>
  );
}
