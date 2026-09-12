export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-sage/30 bg-sage-light px-4 py-3 text-sm text-sage animate-fade-in-up">
      {message}
    </div>
  );
}
