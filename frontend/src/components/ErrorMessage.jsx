export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger animate-fade-in-up">
      {message}
    </div>
  );
}