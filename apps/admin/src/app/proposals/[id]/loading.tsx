export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-6" />
      <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-2" />
      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-8" />
      <div className="h-10 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-8" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-2" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-1" />
          <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      ))}
    </main>
  );
}
