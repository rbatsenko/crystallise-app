export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="h-11 bg-slate-50 dark:bg-slate-900" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 px-4 py-3"
          >
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="ml-auto h-3 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
