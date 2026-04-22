export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
      <div className="h-7 w-32 rounded bg-[color:var(--color-surface-muted)] animate-pulse mb-2" />
      <div className="h-4 w-48 rounded bg-[color:var(--color-surface-muted)] animate-pulse mb-6 opacity-70" />
      <div className="flex gap-1.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 rounded-full bg-[color:var(--color-surface-muted)] animate-pulse"
          />
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-raised)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-[color:var(--color-border)] last:border-b-0"
          >
            <div className="h-9 w-9 rounded-full bg-[color:var(--color-surface-muted)] animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 rounded bg-[color:var(--color-surface-muted)] animate-pulse" />
              <div className="h-3 w-full max-w-md rounded bg-[color:var(--color-surface-muted)] animate-pulse opacity-70" />
            </div>
            <div className="h-5 w-20 rounded-full bg-[color:var(--color-surface-muted)] animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
