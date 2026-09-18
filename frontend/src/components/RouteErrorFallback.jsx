"use client";

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";

// Used inside route-level error.jsx files (one per major page segment).
// Because Next.js scopes an error boundary to the segment it's placed
// in, an error here only replaces THIS page's content - the root
// layout (Navbar/Footer) and every other route stay fully intact and
// navigable, unlike the root-level app/error.jsx (which is reserved
// for a true whole-app crash and shows a modal instead of navigating).
//
// "Back to home" uses a hard navigation (window.location.href) instead
// of next/link - a plain Link can occasionally fail to fully recover
// from a thrown error's router state, while a full navigation always
// works regardless.
export default function RouteErrorFallback({ error, reset, label = "This page" }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute w-72 h-72 rounded-full bg-danger/15 blur-3xl -top-10 -right-10 animate-glow" />

      <div className="relative z-10 text-center max-w-md animate-fade-in-up">
        <span className="text-5xl">😕</span>

        <div className="h-px w-14 bg-border mx-auto my-5" />

        <h1 className="text-xl mb-2">{label} ran into a problem.</h1>
        <p className="text-text-muted text-sm mb-7">
          Something went wrong loading this content. The rest of the site is unaffected -
          you can try again or head back home.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => reset()} className="btn-primary">
            <RotateCcw size={15} className="mr-1.5" /> Try again
          </button>
          <button onClick={() => (window.location.href = "/")} className="btn-outline">
            <Home size={15} className="mr-1.5" /> Back to home
          </button>
        </div>
      </div>
    </div>
  );
}