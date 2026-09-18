"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function AdminError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="The admin dashboard" />;
}