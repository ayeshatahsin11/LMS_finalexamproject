"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import api from "@/lib/axios";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const MAX_RESULTS = 6;

// Live course search used in both the desktop navbar and the mobile
// menu. Matches on course title/category (see courseController.getCourses),
// shows up to 6 quick results as you type, and clicking one jumps
// straight to that course instead of the full listing page.
export default function SearchBar({ onNavigate, className = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < MIN_CHARS) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get("/courses", { params: { search: term, limit: MAX_RESULTS } })
        .then((res) => setResults(res.data.courses || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on an outside click - onBlur alone would fire before a
  // result's own click has a chance to register.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const reset = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onNavigate?.();
  };

  const goToCourse = (course) => {
    reset();
    router.push(`/courses/${course._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    reset();
    router.push(term ? `/courses?search=${encodeURIComponent(term)}` : "/courses");
  };

  const term = query.trim();
  const showDropdown = open && term.length >= MIN_CHARS;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search courses..."
            className="input-field !pl-9 !py-2 text-sm"
            autoComplete="off"
          />
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 card p-2 z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <p className="text-xs text-text-faint px-3 py-2">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-xs text-text-faint px-3 py-2">
              No courses match &quot;{term}&quot;.
            </p>
          ) : (
            <>
              {results.map((course) => (
                <button
                  key={course._id}
                  type="button"
                  onClick={() => goToCourse(course)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-hover transition text-left"
                >
                  <div className="h-9 w-9 shrink-0 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo/30 via-purple/25 to-pink/20" />
                    {course.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnail} alt="" className="relative h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text truncate">{course.title}</p>
                    <p className="text-xs text-text-faint truncate">{course.category}</p>
                  </div>
                </button>
              ))}
              <Link
                href={`/courses?search=${encodeURIComponent(term)}`}
                onClick={reset}
                className="block text-center text-xs text-purple hover:text-pink transition mt-1 px-2 py-2 border-t border-border"
              >
                See all results for &quot;{term}&quot;
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}