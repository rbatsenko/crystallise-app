"use client";

import { useTransition } from "react";
import { updateStatus } from "./actions";
import type { Database } from "@crystallise/supabase/types";

type Status = Database["public"]["Enums"]["proposal_status"];

const OPTIONS: Status[] = ["new", "reviewing", "accepted", "declined"];

export function StatusSelect({
  id,
  current,
}: {
  id: string;
  current: Status;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(async () => {
          await updateStatus(id, next);
        });
      }}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:bg-slate-900 dark:border-slate-700"
    >
      {OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
