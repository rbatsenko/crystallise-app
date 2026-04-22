import type { Database } from "@crystallise/supabase/types";

type Status = Database["public"]["Enums"]["proposal_status"];

const STYLES: Record<Status, string> = {
  new: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-900/60",
  reviewing:
    "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60",
  accepted:
    "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/60",
  declined:
    "bg-stone-200/70 text-stone-600 ring-stone-300 dark:bg-stone-800/60 dark:text-stone-400 dark:ring-stone-700",
};

const LABELS: Record<Status, string> = {
  new: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  declined: "Declined",
};

export function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {LABELS[status]}
    </span>
  );
}

export const STATUS_ORDER: Status[] = [
  "new",
  "reviewing",
  "accepted",
  "declined",
];

export function statusLabel(status: Status): string {
  return LABELS[status];
}
