"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function CoursesError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="The course list" />;
}