import Link from "next/link";
import { createClient } from "@crystallise/supabase/server";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  reviewing:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  accepted:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  declined: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default async function ProposalsPage() {
  const supabase = await createClient();
  const { data: proposals, error } = await supabase
    .from("proposals")
    .select("id, created_at, name, email, status")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Proposals</h1>
        <p className="text-red-600">Failed to load: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Proposals</h1>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Sign out
          </button>
        </form>
      </div>

      {proposals.length === 0 ? (
        <p className="text-slate-500">No proposals yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/proposals/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
