"use client";

import { useTransition } from "react";
import { updateStatus } from "./actions";
import { statusLabel } from "@/components/status-chip";
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
      className="w-full rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30 transition-colors"
    >
      {OPTIONS.map((s) => (
        <option key={s} value={s}>
          {statusLabel(s)}
        </option>
      ))}
    </select>
  );
}
