"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

// - Never on /login or /register.
// - Guests: everywhere else (marketing pages, courses, etc).
// - Logged-in users: ONLY on the main site homepage ("/"). Never on
//   dashboards, profile, course management, lesson viewer, etc. - a
//   footer full of marketing links looks out of place on a working
//   dashboard screen.
export default function ConditionalFooter() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (pathname === "/login" || pathname === "/register") return null;
  if (loading) return null;

  if (!user) return <Footer />;

  return pathname === "/" ? <Footer role={user.role} /> : null;
}