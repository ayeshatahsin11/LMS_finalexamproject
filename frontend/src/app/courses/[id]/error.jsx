"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function CourseDetailsError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="This course" />;
}