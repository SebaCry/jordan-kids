export default function ChildDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
      <div className="rounded-[var(--radius-card)] bg-white shadow-card overflow-hidden">
        <div className="h-24 animate-pulse bg-gray-200" />
        <div className="p-6 flex items-end gap-4">
          <div className="h-20 w-20 -mt-12 animate-pulse rounded-full bg-gray-300" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-[var(--radius-button)] bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
