export default function ProgressBar({ percent = 0 }) {
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-surface-hover overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${safePercent}%`,
            backgroundImage: "linear-gradient(90deg, #6366F1, #A855F7, #EC4899)",
          }}
        />
      </div>
      <span className="text-xs text-text-faint mt-1 inline-block">{safePercent}% complete</span>
    </div>
  );
}