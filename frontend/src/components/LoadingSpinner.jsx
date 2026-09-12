export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-light">
      <div className="h-8 w-8 rounded-full border-2 border-line border-t-ink animate-spin-slow" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
