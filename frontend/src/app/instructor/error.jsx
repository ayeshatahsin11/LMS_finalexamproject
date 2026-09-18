"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

// Covers /instructor, /instructor/courses/new, and /instructor/courses/[id]
// automatically - error.jsx applies to its whole nested segment tree.
export default function InstructorError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="The instructor dashboard" />;
}