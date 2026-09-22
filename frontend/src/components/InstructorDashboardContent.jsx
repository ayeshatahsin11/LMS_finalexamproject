"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Users, Eye, EyeOff, Plus, ListTree } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatCardSkeleton from "@/components/StatCardSkeleton";
import RowSkeleton from "@/components/RowSkeleton";

export default function InstructorDashboardContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/courses/my-courses")
      .then((res) => setCourses(res.data.courses))
      .catch((err) => setError(err.response?.data?.message || "Could not load your courses."))
      .finally(() => setLoading(false));
  }, []);

  const published = courses.filter((c) => c.isPublished).length;
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);

  const breadcrumbItems =
    user?.role === "admin"
      ? [{ label: "Admin", href: "/admin" }, { label: "Instructor" }]
      : [{ label: "Instructor" }];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <h1 className="text-3xl">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/instructor/my-courses" className="btn-outline">
            <ListTree size={16} className="mr-1" /> Manage lessons
          </Link>
          <Link href="/instructor/courses/new" className="btn-primary">
            <Plus size={16} className="mr-1" /> New course
          </Link>
        </div>
      </div>
      <p className="text-text-muted mb-8">Manage your courses and see how students are progressing.</p>

      <ErrorMessage message={error} />

      {/* Summary stats */}
      {loading ? (
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-indigo/15 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{courses.length}</p>
              <p className="text-xs text-text-faint">Total courses</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-success/15 flex items-center justify-center">
              <Eye size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{published}</p>
              <p className="text-xs text-text-faint">Published</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-pink/15 flex items-center justify-center">
              <Users size={20} className="text-pink" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{totalEnrollments}</p>
              <p className="text-xs text-text-faint">Total enrollments</p>
            </div>
          </div>
        </div>
      )}

      {/* Course list */}
      <h2 className="text-2xl mb-5">Your courses</h2>

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-text-muted mb-4">You haven't created any course yet.</p>
          <Link href="/instructor/courses/new" className="btn-primary">
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/instructor/courses/${course._id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition flex-wrap"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-text truncate">{course.title}</h3>
                <p className="text-xs text-text-faint mt-0.5">
                  {course.category} • {course.level}
                </p>
              </div>
              <span className="text-xs text-text-faint hidden sm:inline">
                {course.enrollmentCount || 0} enrolled
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${
                  course.isPublished
                    ? "bg-success/10 text-success"
                    : "bg-text-faint/10 text-text-faint"
                }`}
              >
                {course.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}