export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-8">
      <div className="h-4 w-28 rounded bg-[color:var(--color-surface-muted)] animate-pulse mb-6" />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 lg:gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded bg-[color:var(--color-surface-muted)] animate-pulse" />
            <div className="h-4 w-40 rounded bg-[color:var(--color-surface-muted)] animate-pulse opacity-70" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5 space-y-2"
            >
              <div className="h-3 w-20 rounded bg-[color:var(--color-surface-muted)] animate-pulse" />
              <div className="h-4 w-full rounded bg-[color:var(--color-surface-muted)] animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-[color:var(--color-surface-muted)] animate-pulse opacity-70" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)] p-5 h-24 animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
