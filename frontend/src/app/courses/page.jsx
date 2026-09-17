"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { CATEGORIES, LEVELS } from "@/lib/constants";
import CourseCard from "@/components/CourseCard";
import CourseGridSkeleton from "@/components/CourseGridSkeleton";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [page, setPage] = useState(1);

  // Next.js keeps this component mounted when navigating between two URLs
  // of the SAME route (e.g. /courses -> /courses?category=X via a Link),
  // so the useState above only runs once and won't pick up a later URL
  // change on its own. This keeps the filter UI (and results) in sync
  // whenever the URL's query params change from any source - the
  // breadcrumb, the navbar search, a category card, etc.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setLevel(searchParams.get("level") || "");
  }, [searchParams]);

  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (level) params.level = level;

    api
      .get("/courses", { params })
      .then((res) => {
        setCourses(res.data.courses);
        setPagination({ total: res.data.total, pages: res.data.pages });
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, category, level, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [search, category, level]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
    router.push("/courses");
  };

  const hasActiveFilters = search || category || level;

  const breadcrumbItems = category
    ? [{ label: "Courses", href: "/courses" }, { label: category }]
    : [{ label: "Courses" }];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl mb-2">Browse courses</h1>
      <p className="text-text-muted mb-8">Find your next skill. Filter by category or level.</p>

      {/* Top horizontal filter bar */}
      <div className="card p-4 mb-8 flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
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
            placeholder="Search by title or keyword..."
            className="input-field !pl-9"
          />
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="input-field md:w-40 capitalize"
        >
          <option value="">All levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l} className="capitalize">{l}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters} type="button" className="btn-outline shrink-0">
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <CourseGridSkeleton count={9} />
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No courses match your filters. Try broadening your search.
        </div>
      ) : (
        <>
          <p className="text-sm text-text-faint mb-4">{pagination.total} course{pagination.total !== 1 ? "s" : ""} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-md text-sm transition ${
                    p === page
                      ? "text-white"
                      : "text-text-muted border border-border hover:border-purple/50"
                  }`}
                  style={p === page ? { backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)" } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading..." />}>
      <CoursesContent />
    </Suspense>
  );
}