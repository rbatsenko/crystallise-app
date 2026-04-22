import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@crystallise/supabase/server";
import { StatusSelect } from "./status-select";
import { NotesEditor } from "./notes-editor";

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

  // Generate signed URLs (1 hour) for images.
  let signedUrls: { path: string; url: string }[] = [];
  if (proposal.image_paths.length > 0) {
    const { data } = await supabase.storage
      .from("proposal-images")
      .createSignedUrls(proposal.image_paths, 3600);
    signedUrls = (data ?? []).flatMap((r) =>
      r.signedUrl && r.path
        ? [{ path: r.path, url: r.signedUrl }]
        : [],
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/proposals"
        className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        &larr; All proposals
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="text-2xl font-semibold">{proposal.name}</h1>
        <p className="text-slate-500">
          <a
            href={`mailto:${proposal.email}`}
            className="hover:underline"
          >
            {proposal.email}
          </a>
          <span className="mx-2">·</span>
          <time>{new Date(proposal.created_at).toLocaleString()}</time>
        </p>
      </header>

      <section className="mb-8">
        <label className="block text-xs uppercase tracking-wide text-slate-500 mb-2">
          Status
        </label>
        <StatusSelect id={proposal.id} current={proposal.status} />
      </section>

      {FIELDS.map(({ key, label }) => {
        const value = proposal[key];
        if (!value) return null;
        return (
          <section key={key} className="mb-6">
            <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              {label}
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {value}
            </p>
          </section>
        );
      })}

      {signedUrls.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Supporting images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {signedUrls.map(({ path, url }) => (
              <a
                key={path}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block aspect-square overflow-hidden rounded-md border border-slate-200 dark:border-slate-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-wide text-slate-500 mb-2">
          Admin notes
        </h2>
        <NotesEditor id={proposal.id} initial={proposal.admin_notes ?? ""} />
      </section>
    </main>
  );
}
