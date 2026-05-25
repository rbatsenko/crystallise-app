"use client";

import { useTransition } from "react";
import { deleteProposal, setArchived } from "./actions";

export function ProposalActions({
  id,
  archived,
  name,
}: {
  id: string;
  archived: boolean;
  name: string;
}) {
  const [archivePending, startArchive] = useTransition();
  const [deletePending, startDelete] = useTransition();
  const busy = archivePending || deletePending;

  function onArchiveClick() {
    startArchive(async () => {
      await setArchived(id, !archived);
    });
  }

  function onDeleteClick() {
    const ok = window.confirm(
      `Delete "${name}"? This permanently removes the proposal and its images. This cannot be undone.`,
    );
    if (!ok) return;
    startDelete(async () => {
      await deleteProposal(id);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onArchiveClick}
        disabled={busy}
        className="w-full rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-sm text-left hover:bg-[color:var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {archivePending
          ? archived
            ? "Unarchiving…"
            : "Archiving…"
          : archived
            ? "Unarchive"
            : "Archive"}
      </button>
      <button
        type="button"
        onClick={onDeleteClick}
        disabled={busy}
        className="w-full rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-left text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
      >
        {deletePending ? "Deleting…" : "Delete permanently"}
      </button>
    </div>
  );
}
