"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Flame } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProgressBar from "@/components/ProgressBar";

export default function StudentDashboardContent() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/enrollments/my")
      .then((res) => setEnrollments(res.data.enrollments))
      .catch((err) => setError(err.response?.data?.message || "Could not load your dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === "completed").length;
  const avgProgress = totalCourses
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progressPercent || 0), 0) / totalCourses)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="text-text-muted mb-8">Here's where you left off.</p>

      <ErrorMessage message={error} />

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-indigo/15 flex items-center justify-center">
            <BookOpen size={20} className="text-indigo" />
          </div>
          <div>
            <p className="text-2xl font-serif text-text">{totalCourses}</p>
            <p className="text-xs text-text-faint">Enrolled courses</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-success/15 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-success" />
          </div>
          <div>
            <p className="text-2xl font-serif text-text">{completedCourses}</p>
            <p className="text-xs text-text-faint">Completed</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-pink/15 flex items-center justify-center">
            <Flame size={20} className="text-pink" />
          </div>
          <div>
            <p className="text-2xl font-serif text-text">{avgProgress}%</p>
            <p className="text-xs text-text-faint">Average progress</p>
          </div>
        </div>
      </div>

      {/* Enrolled courses */}
      <h2 className="text-2xl mb-5">Your courses</h2>

      {enrollments.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-text-muted mb-4">You haven't enrolled in any course yet.</p>
          <Link href="/courses" className="btn-primary">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;
            return (
              <div key={enrollment._id} className="card card-hover p-5 flex flex-col gap-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded capitalize bg-purple/10 text-purple border border-purple/20 self-start">
                  {course.level}
                </span>
                <h3 className="font-serif text-lg text-text">{course.title}</h3>
                <p className="text-xs text-text-faint">By {course.instructor?.name}</p>
                <ProgressBar percent={enrollment.progressPercent} />
                <Link href={`/courses/${course._id}`} className="btn-outline w-full mt-2 text-center">
                  {enrollment.status === "completed" ? "Review course" : "Continue learning"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}