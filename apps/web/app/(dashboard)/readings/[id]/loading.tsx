export default function ReadingDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-card space-y-6">
        <div className="h-7 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="h-20 w-full animate-pulse rounded-[var(--radius-fun)] bg-gray-100" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
