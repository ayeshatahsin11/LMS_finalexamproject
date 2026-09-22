"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import RowSkeleton from "@/components/RowSkeleton";

export default function ManageAllCoursesContent() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (search) params.search = search;

    api
      .get("/courses/all", { params })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => setError(err.response?.data?.message || "Could not load courses."))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Manage courses" }]} />
      <h1 className="text-3xl mb-1">Manage courses</h1>
      <p className="text-text-muted mb-8">
        Every course on the platform, from every instructor - published or still a draft.
      </p>

      <ErrorMessage message={error} />

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="input-field !pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-10 text-center text-text-muted text-sm">
          No courses match your search.
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {courses.map((course) => (
            <div key={course._id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-text truncate">{course.title}</p>
                <p className="text-xs text-text-faint mt-0.5">
                  By {course.instructor?.name || "Unknown"} · {course.category} · {course.level}
                </p>
              </div>

              <span className="text-xs text-text-faint hidden sm:inline">
                {course.enrollmentCount || 0} enrolled
              </span>

              <span
                className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 shrink-0 ${
                  course.isPublished ? "bg-success/10 text-success" : "bg-text-faint/10 text-text-faint"
                }`}
              >
                {course.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                {course.isPublished ? "Published" : "Draft"}
              </span>

              <Link href={`/instructor/courses/${course._id}`} className="btn-outline shrink-0">
                Manage this course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}