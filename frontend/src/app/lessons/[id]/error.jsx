"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function LessonError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="This lesson" />;
}