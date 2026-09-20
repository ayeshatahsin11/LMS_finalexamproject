"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(search.trim() ? `/courses?search=${encodeURIComponent(search.trim())}` : "/courses");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor" : "/dashboard";

  // The single "middle" link that replaces About/Contact once someone is
  // logged in - different per role.
  const roleLink =
    user?.role === "admin"
      ? { label: "Manage Users", href: "/admin" }
      : user?.role === "instructor"
      ? { label: "My Courses", href: "/instructor" }
      : user?.role === "student"
      ? { label: "My Lessons", href: "/my-lessons" }
      : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-6 py-4">
        <Link href="/" className="font-serif text-xl gradient-text tracking-tight shrink-0">
          Pathway
        </Link>

        <Link href="/courses" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden md:inline">
          Courses
        </Link>

        {loading ? null : user ? (
          // Logged in: single role-specific link (My Lessons / My Courses / Manage Users)
          <Link href={roleLink.href} className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
            {roleLink.label}
          </Link>
        ) : (
          // Guest: About + Contact, scrolling to homepage sections
          <>
            <Link href="/#about" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
              About
            </Link>
            <Link href="/#contact" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
              Contact
            </Link>
          </>
        )}

        {/* Search - grows to fill available space */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="input-field !pl-9 !py-2 text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-5 text-sm ml-auto shrink-0">
          {loading ? null : user ? (
            <>
              <Link href={dashboardPath} className="text-text-muted hover:text-text transition hidden md:inline">
                Dashboard
              </Link>
              <Link href="/profile" className="text-text-muted hover:text-text transition hidden md:inline">
                Profile
              </Link>
              <span className="hidden lg:inline text-text-faint">
                Hi, {user.name?.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-text-muted hover:text-text transition">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}