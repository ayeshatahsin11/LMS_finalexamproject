"use client";
import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function ProfileError({ error, reset }) {
  return <RouteErrorFallback error={error} reset={reset} label="Your profile" />;
}