export default function ProgressBar({ percent = 0 }) {
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-sage transition-all duration-700 ease-out"
          style={{ width: `${safePercent}%` }}
        />
      </div>
      <span className="text-xs text-slate-light mt-1 inline-block">{safePercent}% complete</span>
    </div>
  );
}
