import Link from "next/link";
import { createClient } from "@crystallise/supabase/server";
import {
  StatusChip,
  STATUS_ORDER,
  statusLabel,
} from "@/components/status-chip";
import { relativeTime } from "@/lib/time";
import type { Database } from "@crystallise/supabase/types";

type Status = Database["public"]["Enums"]["proposal_status"];
type Filter = Status | "all" | "archived";

const FILTERS: Filter[] = ["all", ...STATUS_ORDER, "archived"];

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter: Filter = isFilter(status) ? status : "all";

  const supabase = await createClient();

  const [listResult, { data: counts }] = await Promise.all([
    listProposals(supabase, activeFilter),
    supabase.from("proposals").select("status, archived_at"),
  ]);

  const active = (counts ?? []).filter((r) => r.archived_at === null);
  const byStatus = countByStatus(active);
  const totalCount = active.length;
  const archivedCount = (counts?.length ?? 0) - totalCount;

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Proposals</h1>
        <p className="text-sm text-[color:var(--color-text-muted)] mt-1">
          {totalCount === 0
            ? "Nothing has come in yet."
            : `${totalCount} total · review, accept, or decline.`}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {FILTERS.map((f) => {
          const count =
            f === "all"
              ? totalCount
              : f === "archived"
                ? archivedCount
                : byStatus[f] ?? 0;
          const isActive = activeFilter === f;
          return (
            <Link
              key={f}
              href={f === "all" ? "/proposals" : `/proposals?status=${f}`}
              scroll={false}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[color:var(--color-text)] text-[color:var(--color-surface)]"
                  : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]",
              ].join(" ")}
            >
              {f === "all"
                ? "All"
                : f === "archived"
                  ? "Archived"
                  : statusLabel(f)}
              <span
                className={[
                  "tabular-nums",
                  isActive
                    ? "opacity-70"
                    : "text-[color:var(--color-text-subtle)]",
                ].join(" ")}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {listResult.error ? (
        <p className="text-sm text-red-600">
          Failed to load: {listResult.error.message}
        </p>
      ) : listResult.data.length === 0 ? (
        <EmptyState filter={activeFilter} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <ul className="divide-y divide-[color:var(--color-border)]">
            {listResult.data.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/proposals/${p.id}`}
                  className="flex items-center gap-4 px-4 md:px-5 py-3.5 hover:bg-[color:var(--color-surface-muted)]/60 transition-colors"
                >
                  <Avatar name={p.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-xs text-[color:var(--color-text-subtle)] truncate">
                        {p.email}
                      </span>
                    </div>
                    <p className="text-sm text-[color:var(--color-text-muted)] truncate mt-0.5">
                      {p.overview}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                    <StatusChip status={p.status} />
                    <time
                      title={new Date(p.created_at).toLocaleString()}
                      className="text-xs text-[color:var(--color-text-subtle)] tabular-nums"
                    >
                      {relativeTime(p.created_at)}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

function isFilter(v: string | undefined): v is Filter {
  return (
    v === "all" ||
    v === "new" ||
    v === "reviewing" ||
    v === "accepted" ||
    v === "declined" ||
    v === "archived"
  );
}

type ProposalRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  overview: string;
  status: Status;
};

async function listProposals(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filter: Filter,
): Promise<{ data: ProposalRow[]; error: { message: string } | null }> {
  let q = supabase
    .from("proposals")
    .select("id, created_at, name, email, overview, status")
    .order("created_at", { ascending: false });
  if (filter === "archived") {
    q = q.not("archived_at", "is", null);
  } else {
    q = q.is("archived_at", null);
    if (filter !== "all") q = q.eq("status", filter);
  }
  const { data, error } = await q;
  return { data: data ?? [], error };
}

function countByStatus(
  rows: { status: Status }[],
): Partial<Record<Status, number>> {
  const acc: Partial<Record<Status, number>> = {};
  for (const r of rows) acc[r.status] = (acc[r.status] ?? 0) + 1;
  return acc;
}

function Avatar({ name }: { name: string }) {
  const initials =
    name
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-muted)] text-[color:var(--color-accent)] text-xs font-semibold">
      {initials}
    </span>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  const message =
    filter === "all"
      ? "No proposals yet. The first one will land here when someone submits the form."
      : filter === "archived"
        ? "No archived proposals."
        : `No proposals with status “${statusLabel(filter)}”.`;
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--color-border)] px-8 py-16 text-center">
      <p className="text-sm text-[color:var(--color-text-muted)]">{message}</p>
    </div>
  );
}
