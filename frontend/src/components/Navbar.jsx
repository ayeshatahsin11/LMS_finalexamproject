"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    closeMenu();
    router.push(search.trim() ? `/courses?search=${encodeURIComponent(search.trim())}` : "/courses");
  };

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor" : "/dashboard";

  // The single "middle" link that replaces About/Contact once someone is
  // logged in - different per role.
  const roleLink =
    user?.role === "admin"
      ? { label: "Manage Users", href: "/admin/users" }
      : user?.role === "instructor"
      ? { label: "My Courses", href: "/instructor/my-courses" }
      : user?.role === "student"
      ? { label: "My Lessons", href: "/my-lessons" }
      : null;

  // Close the mobile menu automatically whenever the route changes (e.g.
  // tapping a link), so it never stays open over the new page.
  const NavLink = ({ href, children, className = "" }) => (
    <Link href={href} onClick={closeMenu} className={className}>
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-4 sm:px-6 py-4">
        <Link href="/" onClick={closeMenu} className="font-serif text-xl gradient-text tracking-tight shrink-0">
          Pathway
        </Link>

        {/* Desktop links - hidden below md, replaced by the hamburger menu */}
        <NavLink href="/courses" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden md:inline">
          Courses
        </NavLink>

        {loading ? null : user ? (
          <NavLink href={roleLink.href} className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
            {roleLink.label}
          </NavLink>
        ) : (
          <>
            <NavLink href="/#about" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
              About
            </NavLink>
            <NavLink href="/#contact" className="text-sm text-text-muted hover:text-text transition shrink-0 hidden lg:inline">
              Contact
            </NavLink>
          </>
        )}

        {/* Search - desktop only, sits inline; mobile gets its own inside the menu */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="input-field !pl-9 !py-2 text-sm"
            />
          </div>
        </form>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-5 text-sm ml-auto shrink-0">
          {loading ? null : user ? (
            <>
              <NavLink href={dashboardPath} className="text-text-muted hover:text-text transition">
                Dashboard
              </NavLink>
              <NavLink href="/profile" className="text-text-muted hover:text-text transition">
                Profile
              </NavLink>
              <span className="hidden lg:inline text-text-faint">
                Hi, {user.name?.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login" className="text-text-muted hover:text-text transition">
                Log in
              </NavLink>
              <NavLink href="/register" className="btn-primary">
                Get started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile: hamburger toggle, pushed to the right */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden ml-auto h-9 w-9 flex items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg px-4 sm:px-6 py-5 flex flex-col gap-1">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="input-field !pl-9 !py-2 text-sm"
              />
            </div>
          </form>

          <NavLink href="/courses" className="py-2.5 text-sm text-text border-b border-border">
            Courses
          </NavLink>

          {loading ? null : user ? (
            <>
              <NavLink href={roleLink.href} className="py-2.5 text-sm text-text border-b border-border">
                {roleLink.label}
              </NavLink>
              <NavLink href={dashboardPath} className="py-2.5 text-sm text-text border-b border-border">
                Dashboard
              </NavLink>
              <NavLink href="/profile" className="py-2.5 text-sm text-text border-b border-border">
                Profile
              </NavLink>
              <p className="py-2.5 text-xs text-text-faint">Signed in as {user.name}</p>
              <button onClick={handleLogout} className="btn-outline w-full justify-center mt-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink href="/#about" className="py-2.5 text-sm text-text border-b border-border">
                About
              </NavLink>
              <NavLink href="/#contact" className="py-2.5 text-sm text-text border-b border-border">
                Contact
              </NavLink>
              <NavLink href="/login" className="btn-outline w-full justify-center mt-3">
                Log in
              </NavLink>
              <NavLink href="/register" className="btn-primary w-full justify-center mt-2">
                Get started
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}