import Skeleton from "./Skeleton";

// Mirrors CourseCard's layout so the grid doesn't visually "jump" once
// real data replaces the placeholders.
export default function CourseCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col">
      <Skeleton className="h-36 w-full !rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}