import { Card, CardContent } from "@/components/ui/card";

export default function ChildrenLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="h-11 w-36 animate-pulse rounded-[var(--radius-button)] bg-gray-200" />
      </div>
      <div className="h-11 w-64 animate-pulse rounded-[var(--radius-input)] bg-gray-100" />
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0 divide-y divide-border-light">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
