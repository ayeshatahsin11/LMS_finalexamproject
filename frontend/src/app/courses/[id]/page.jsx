"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorMessage from "@/components/ErrorMessage";
import ProgressBar from "@/components/ProgressBar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const isOwner = user && course && course.instructor?._id === user._id;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data.course);

      const lessonsRes = await api.get(`/lessons/course/${id}`);
      setLessons(lessonsRes.data.lessons);

      // If a student is logged in, check whether they're already enrolled
      // so we can show progress instead of an "Enroll" button.
      if (user?.role === "student") {
        const enrollRes = await api.get("/enrollments/my");
        const match = enrollRes.data.enrollments.find((e) => e.course?._id === id);
        setEnrollment(match || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Course not found.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    setError("");
    try {
      await api.post("/enrollments", { courseId: id });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to enroll right now.");
    } finally {
      setEnrolling(false);
    }
  };

  const canAccessFull = isOwner || isAdmin || !!enrollment;

  const isLessonDone = (lessonId) =>
    enrollment?.completedLessons?.some((l) => (l._id || l) === lessonId);

  if (loading) return <LoadingScreen label="Loading course" />;
  if (error && !course) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.category, href: `/courses?category=${encodeURIComponent(course.category)}` },
          { label: course.title },
        ]}
      />

      {/* Thumbnail banner - only shown if the instructor uploaded one */}
      {course.thumbnail && (
        <div className="w-full h-56 md:h-72 rounded-xl overflow-hidden mb-8 border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded capitalize bg-purple/10 text-purple border border-purple/20">
            {course.level}
          </span>
          <h1 className="text-3xl mt-3">{course.title}</h1>
          <p className="text-text-muted mt-3">{course.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-text-faint">
            <span>By {course.instructor?.name || "Instructor"}</span>
            <span>•</span>
            <span>{course.category}</span>
            <span>•</span>
            <span>{course.enrollmentCount || 0} enrolled</span>
          </div>
        </div>

        <div className="card p-5 h-fit">
          {error && <ErrorMessage message={error} />}

          {isOwner || isAdmin ? (
            <Link href={`/instructor/courses/${course._id}`} className="btn-primary w-full">
              Manage this course
            </Link>
          ) : enrollment ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-success">You're enrolled</span>
              <ProgressBar percent={enrollment.progressPercent} />
              {lessons.length > 0 && (
                <Link href={`/lessons/${lessons[0]._id}`} className="btn-primary w-full mt-2">
                  Continue learning
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling || !isStudent && !!user}
              className="btn-primary w-full"
            >
              {enrolling
                ? "Enrolling..."
                : !user
                ? "Log in to enroll"
                : !isStudent
                ? "Only students can enroll"
                : "Enroll now"}
            </button>
          )}
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-2xl mb-4">Course content</h2>
        <div className="card divide-y divide-border overflow-hidden">
          {lessons.length === 0 ? (
            <p className="p-5 text-text-muted text-sm">No lessons added yet.</p>
          ) : (
            lessons.map((lesson, i) => {
              const unlocked = lesson.isFreePreview || canAccessFull;
              const done = isLessonDone(lesson._id);
              return (
                <div
                  key={lesson._id}
                  className={`flex items-center gap-3 px-5 py-4 ${
                    unlocked ? "cursor-pointer hover:bg-surface-hover" : "opacity-60"
                  } transition`}
                  onClick={() => unlocked && router.push(`/lessons/${lesson._id}`)}
                >
                  {done ? (
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                  ) : unlocked ? (
                    <PlayCircle size={18} className="text-purple shrink-0" />
                  ) : (
                    <Lock size={18} className="text-text-faint shrink-0" />
                  )}
                  <span className="text-sm text-text-faint w-6">{i + 1}.</span>
                  <span className="flex-1 text-sm text-text">{lesson.title}</span>
                  {lesson.isFreePreview && (
                    <span className="text-xs text-pink border border-pink/30 rounded px-2 py-0.5">
                      Free preview
                    </span>
                  )}
                  {lesson.duration ? (
                    <span className="flex items-center gap-1 text-xs text-text-faint">
                      <Clock size={12} />
                      {Math.round(lesson.duration / 60)}m
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}