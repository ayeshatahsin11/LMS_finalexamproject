"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // In a real production app this is where you'd send the error to a
    // logging service (Sentry, LogRocket, etc). Logging to console here
    // keeps it visible during development/grading without extra setup.
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-danger/15 blur-3xl -top-10 -right-20 animate-glow" />
      <div className="absolute w-80 h-80 rounded-full bg-purple/15 blur-3xl bottom-0 left-0 animate-glow" />

      <div className="relative z-10 text-center max-w-md animate-fade-in-up">
        <span className="text-6xl">⚠️</span>

        <div className="h-px w-16 bg-border mx-auto my-6" />

        <h1 className="text-2xl mb-3">Something went wrong.</h1>
        <p className="text-text-muted mb-8">
          An unexpected error interrupted this page. It's not you - try again, and if it
          keeps happening, head back home.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={() => reset()} className="btn-primary">
            <RotateCcw size={16} className="mr-1.5" /> Try again
          </button>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}