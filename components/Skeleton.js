export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-card bg-surface-2/60 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-surface p-5 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
