import Skeleton from "./Skeleton";

// A single placeholder list row - for user tables, enrolled-student
// lists, instructor course lists, etc.
export default function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="h-4 flex-1 max-w-[180px]" />
      <Skeleton className="h-6 w-20 hidden sm:block" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}