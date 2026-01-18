export function StatusSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-primaryBlueDark/10 backdrop-blur-sm border border-white/5 rounded-full">
      <div className="w-8 h-8 bg-white/10 rounded-md animate-pulse" />
      <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
    </div>
  );
}
