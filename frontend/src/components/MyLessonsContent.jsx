"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import RowSkeleton from "@/components/RowSkeleton";

export default function MyLessonsContent() {
  const router = useRouter();
  const [groups, setGroups] = useState([]); // [{ course, lessons, completedLessons }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const enrollRes = await api.get("/enrollments/my");
        const enrollments = enrollRes.data.enrollments.filter((e) => e.course);

        const results = await Promise.all(
          enrollments.map(async (enrollment) => {
            const lessonsRes = await api.get(`/lessons/course/${enrollment.course._id}`);
            return {
              course: enrollment.course,
              lessons: lessonsRes.data.lessons,
              completedLessons: enrollment.completedLessons || [],
            };
          })
        );

        if (!cancelled) setGroups(results);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load your lessons.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDone = (group, lessonId) =>
    group.completedLessons.some((l) => (l._id || l) === lessonId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "My lessons" }]} />
      <h1 className="text-3xl mb-1">My lessons</h1>
      <p className="text-text-muted mb-8">Every lesson across all your enrolled courses, in one place.</p>

      <ErrorMessage message={error} />

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : groups.length === 0 ? (
        <div className="card p-10 text-center text-text-muted text-sm">
          You're not enrolled in any course yet - browse courses to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <div key={group.course._id}>
              <h2 className="font-serif text-lg text-text mb-3">{group.course.title}</h2>
              <div className="card divide-y divide-border overflow-hidden">
                {group.lessons.length === 0 ? (
                  <p className="p-4 text-sm text-text-muted">No lessons in this course yet.</p>
                ) : (
                  group.lessons.map((lesson, i) => {
                    const locked = lesson.locked;
                    const done = isDone(group, lesson._id);
                    return (
                      <div
                        key={lesson._id}
                        onClick={() => !locked && router.push(`/lessons/${lesson._id}`)}
                        className={`flex items-center gap-3 px-5 py-3.5 ${
                          locked ? "opacity-50" : "cursor-pointer hover:bg-surface-hover"
                        } transition`}
                      >
                        {done ? (
                          <CheckCircle2 size={16} className="text-success shrink-0" />
                        ) : locked ? (
                          <Lock size={16} className="text-text-faint shrink-0" />
                        ) : (
                          <PlayCircle size={16} className="text-purple shrink-0" />
                        )}
                        <span className="text-xs text-text-faint w-5">{i + 1}.</span>
                        <span className="flex-1 text-sm text-text truncate">{lesson.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}