export default function GamesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-card)] border-2 border-gray-200 bg-white p-6 space-y-4"
          >
            <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-11 w-full animate-pulse rounded-[var(--radius-button)] bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
