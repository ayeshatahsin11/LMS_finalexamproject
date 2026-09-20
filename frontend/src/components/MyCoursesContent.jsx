"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Users } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import RowSkeleton from "@/components/RowSkeleton";
import LessonManager from "@/components/LessonManager";

export default function MyCoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      const res = await api.get("/courses/my-courses");
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const loadLessonsFor = async (courseId) => {
    try {
      const res = await api.get(`/lessons/course/${courseId}`);
      setLessonsByCourse((prev) => ({ ...prev, [courseId]: res.data.lessons }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load lessons for this course.");
    }
  };

  const toggleExpand = (courseId) => {
    if (expandedId === courseId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(courseId);
    if (!lessonsByCourse[courseId]) {
      loadLessonsFor(courseId);
    }
  };

  const togglePublish = async (course) => {
    try {
      const res = await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
      setCourses((prev) => prev.map((c) => (c._id === course._id ? res.data.course : c)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update publish status.");
    }
  };

  const breadcrumbItems =
    user?.role === "admin"
      ? [{ label: "Admin", href: "/admin" }, { label: "My courses" }]
      : [{ label: "My courses" }];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl mb-1">My courses</h1>
      <p className="text-text-muted mb-8">
        Every course you've created, with full lesson details in one place.
      </p>

      <ErrorMessage message={error} />

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
        <div className="flex flex-col gap-4">
          {courses.map((course) => {
            const isOpen = expandedId === course._id;
            return (
              <div key={course._id} className="card overflow-hidden">
                {/* Course header row */}
                <button
                  onClick={() => toggleExpand(course._id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface-hover transition"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-text truncate">{course.title}</h3>
                    <p className="text-xs text-text-faint mt-0.5">
                      {course.category} • {course.level} • {course.enrollmentCount || 0} enrolled
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 shrink-0 ${
                      course.isPublished ? "bg-success/10 text-success" : "bg-text-faint/10 text-text-faint"
                    }`}
                  >
                    {course.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-text-faint shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-text-faint shrink-0" />
                  )}
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-border p-5">
                    <p className="text-sm text-text-muted mb-4">{course.description}</p>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      <button
                        onClick={() => togglePublish(course)}
                        className={course.isPublished ? "btn-outline" : "btn-primary"}
                      >
                        {course.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <Link href={`/instructor/courses/${course._id}`} className="btn-outline">
                        <Pencil size={14} className="mr-1.5" /> Edit details
                      </Link>
                      <Link href={`/instructor/courses/${course._id}`} className="btn-outline">
                        <Users size={14} className="mr-1.5" /> View enrolled students
                      </Link>
                    </div>

                    {!lessonsByCourse[course._id] ? (
                      <RowSkeleton />
                    ) : (
                      <LessonManager
                        courseId={course._id}
                        lessons={lessonsByCourse[course._id]}
                        onChange={() => loadLessonsFor(course._id)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}