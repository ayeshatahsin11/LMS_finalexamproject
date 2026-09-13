"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, PlayCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Breadcrumbs from "@/components/Breadcrumbs";

// YouTube links need an <iframe> embed; anything else is treated as a
// direct video file URL and played with a native <video> tag.
function getYoutubeEmbedUrl(url) {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function LessonViewerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/lessons/${id}`);
      const currentLesson = res.data.lesson;
      setLesson(currentLesson);

      const courseId = currentLesson.course?._id;
      const [lessonsRes, enrollRes] = await Promise.all([
        api.get(`/lessons/course/${courseId}`),
        user?.role === "student" ? api.get("/enrollments/my") : Promise.resolve(null),
      ]);
      setAllLessons(lessonsRes.data.lessons);

      if (enrollRes) {
        const match = enrollRes.data.enrollments.find((e) => e.course?._id === courseId);
        setEnrollment(match || null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }
      setError(err.response?.data?.message || "Unable to load this lesson.");
    } finally {
      setLoading(false);
    }
  }, [id, user, router]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const isDone = enrollment?.completedLessons?.some((l) => (l._id || l) === id);

  const handleMarkComplete = async () => {
    if (!enrollment) return;
    setMarking(true);
    try {
      const res = await api.put(`/enrollments/${enrollment._id}/progress`, { lessonId: id });
      setEnrollment(res.data.enrollment);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update progress.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading lesson..." />;

  if (error && !lesson) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <ErrorMessage message={error} />
        <Link href="/courses" className="btn-outline mt-4 inline-block">
          Back to courses
        </Link>
      </div>
    );
  }
  if (!lesson) return null;

  const currentIndex = allLessons.findIndex((l) => l._id === id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const youtubeUrl = getYoutubeEmbedUrl(lesson.videoUrl);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Courses", href: "/courses" },
          { label: lesson.course?.title, href: `/courses/${lesson.course?._id}` },
          { label: lesson.title },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <ErrorMessage message={error} />

          <div className="card overflow-hidden mb-5 aspect-video bg-black flex items-center justify-center">
            {youtubeUrl ? (
              <iframe
                src={youtubeUrl}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lesson.videoUrl ? (
              <video src={lesson.videoUrl} controls className="w-full h-full" />
            ) : (
              <span className="text-text-faint text-sm">No video available for this lesson.</span>
            )}
          </div>

          <h1 className="text-2xl">{lesson.title}</h1>
          {lesson.description && <p className="text-text-muted mt-2">{lesson.description}</p>}

          <div className="flex items-center justify-between mt-8">
            <button
              disabled={!prevLesson}
              onClick={() => prevLesson && router.push(`/lessons/${prevLesson._id}`)}
              className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>

            {enrollment && (
              <button onClick={handleMarkComplete} disabled={marking || isDone} className="btn-primary">
                {isDone ? "Completed ✓" : marking ? "Saving..." : "Mark as complete"}
              </button>
            )}

            <button
              disabled={!nextLesson}
              onClick={() => nextLesson && router.push(`/lessons/${nextLesson._id}`)}
              className="btn-outline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Lesson list sidebar */}
        <div className="card p-2 h-fit">
          <p className="text-xs font-medium text-text-faint uppercase tracking-wide px-3 py-2">
            Course content
          </p>
          <div className="flex flex-col">
            {allLessons.map((l, i) => {
              const active = l._id === id;
              const done = enrollment?.completedLessons?.some((c) => (c._id || c) === l._id);
              const locked = l.locked;
              return (
                <button
                  key={l._id}
                  disabled={locked}
                  onClick={() => router.push(`/lessons/${l._id}`)}
                  className={`flex items-center gap-2 text-left px-3 py-2.5 rounded-md text-sm transition ${
                    active ? "bg-purple/15 text-text" : "text-text-muted hover:bg-surface-hover"
                  } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {done ? (
                    <CheckCircle2 size={15} className="text-success shrink-0" />
                  ) : locked ? (
                    <Lock size={15} className="text-text-faint shrink-0" />
                  ) : (
                    <PlayCircle size={15} className="text-purple shrink-0" />
                  )}
                  <span className="truncate">{i + 1}. {l.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}