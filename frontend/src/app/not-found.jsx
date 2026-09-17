import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-purple/20 blur-3xl -top-10 -left-20 animate-glow" />
      <div className="absolute w-80 h-80 rounded-full bg-pink/15 blur-3xl bottom-0 right-0 animate-glow" />

      <div className="relative z-10 text-center max-w-md animate-fade-in-up">
        <p className="font-serif text-8xl gradient-text leading-none mb-2">404</p>

        <div className="h-px w-16 bg-border mx-auto my-6" />

        <h1 className="text-2xl mb-3">This page wandered off somewhere.</h1>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist, was moved, or never got published.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/courses" className="btn-outline">
            <Compass size={16} className="mr-1.5" /> Browse courses
          </Link>
        </div>
      </div>
    </div>
  );
}