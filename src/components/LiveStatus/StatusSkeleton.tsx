export function StatusSkeleton() {
  return (
    <div className="flex h-12 items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 shadow-card sm:h-[52px] sm:gap-2.5 sm:px-4 sm:py-2">
      <div className="h-6 w-6 animate-pulse rounded-sm bg-line sm:h-8 sm:w-8" />
      <div className="h-4 w-20 animate-pulse rounded-sm bg-line sm:h-5 sm:w-24" />
    </div>
  );
}
