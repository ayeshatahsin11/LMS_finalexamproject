export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-text-faint">
      <div
        className="h-8 w-8 rounded-full animate-spin-slow"
        style={{
          border: "2px solid var(--color-border)",
          borderTopColor: "var(--color-purple)",
        }}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}