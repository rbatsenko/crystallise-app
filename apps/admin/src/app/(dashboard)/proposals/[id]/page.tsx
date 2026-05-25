import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@crystallise/supabase/server";
import { StatusSelect } from "./status-select";
import { NotesEditor } from "./notes-editor";
import { ImageGallery } from "@/components/image-gallery";
import { CopyButton } from "@/components/copy-button";
import { Linkify } from "@/components/linkify";
import { relativeTime } from "@/lib/time";

const FIELDS: { key: Field; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "deliverables", label: "Deliverables" },
  { key: "budget", label: "Budget" },
  { key: "budget_breakdown", label: "Budget breakdown" },
  { key: "additional", label: "Additional info" },
];

type Field =
  | "overview"
  | "deliverables"
  | "budget"
  | "budget_breakdown"
  | "additional";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">Failed to load: {error.message}</p>
      </main>
    );
  }
  if (!proposal) notFound();

  let signedUrls: { path: string; url: string }[] = [];
  if (proposal.image_paths.length > 0) {
    const { data } = await supabase.storage
      .from("proposal-images")
      .createSignedUrls(proposal.image_paths, 3600);
    signedUrls = (data ?? []).flatMap((r) =>
      r.signedUrl && r.path ? [{ path: r.path, url: r.signedUrl }] : [],
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-8">
      <Link
        href="/proposals"
        className="inline-flex items-center gap-1 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] transition-colors mb-6"
      >
        <span aria-hidden>&larr;</span> All proposals
      </Link>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 lg:gap-10 items-start">
        <div className="min-w-0">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              {proposal.name}
            </h1>
            <p className="text-sm text-[color:var(--color-text-muted)] mt-1 inline-flex items-center gap-2">
              <a
                href={`mailto:${proposal.email}`}
                className="hover:text-[color:var(--color-text)] underline-offset-4 hover:underline"
              >
                {proposal.email}
              </a>
              <CopyButton value={proposal.email} label="email" />
            </p>
          </header>

          <div className="space-y-6">
            {FIELDS.map(({ key, label }) => {
              const value = proposal[key];
              if (!value) return null;
              return (
                <section
                  key={key}
                  className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5"
                >
                  <h2 className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-subtle)] mb-2 font-medium">
                    {label}
                  </h2>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Linkify text={value} />
                  </p>
                </section>
              );
            })}

            {signedUrls.length > 0 && (
              <section className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5">
                <h2 className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-subtle)] mb-3 font-medium">
                  Supporting images
                </h2>
                <ImageGallery images={signedUrls} />
              </section>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-8 space-y-5">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5">
            <h2 className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-subtle)] mb-2 font-medium">
              Status
            </h2>
            <StatusSelect id={proposal.id} current={proposal.status} />
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--color-text-subtle)]">
                Received
              </span>
              <time
                title={new Date(proposal.created_at).toLocaleString()}
                className="tabular-nums"
              >
                {relativeTime(proposal.created_at)}
              </time>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--color-text-subtle)]">
                Images
              </span>
              <span className="tabular-nums">{proposal.image_paths.length}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5">
            <h2 className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-subtle)] mb-2 font-medium">
              Admin notes
            </h2>
            <NotesEditor
              id={proposal.id}
              initial={proposal.admin_notes ?? ""}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
