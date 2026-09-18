"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function DashboardError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="Your dashboard" />;
}