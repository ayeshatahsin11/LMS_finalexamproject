"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl gradient-text tracking-tight">
          Pathway
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/courses" className="text-text-muted hover:text-text transition">
            Browse courses
          </Link>

          {loading ? null : user ? (
            <>
              <Link href={dashboardPath} className="text-text-muted hover:text-text transition">
                Dashboard
              </Link>
              <Link href="/profile" className="text-text-muted hover:text-text transition">
                Profile
              </Link>
              <span className="hidden sm:inline text-text-faint">
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