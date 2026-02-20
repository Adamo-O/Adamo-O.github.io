export function StatusSkeleton() {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 h-12 sm:h-[52px] bg-primaryBlueDark/10 backdrop-blur-sm border border-white/5 rounded-full">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-md animate-pulse" />
      <div className="h-4 sm:h-5 w-20 sm:w-24 bg-white/10 rounded animate-pulse" />
    </div>
  );
}
