export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success animate-fade-in-up">
      {message}
    </div>
  );
}