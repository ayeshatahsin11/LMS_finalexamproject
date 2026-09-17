import Skeleton from "./Skeleton";

// Matches the icon + number + label stat cards used across dashboards.
export default function StatCardSkeleton() {
  return (
    <div className="card p-5 flex items-center gap-4">
      <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-6 w-12 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}