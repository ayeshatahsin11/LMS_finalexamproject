"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import CourseCard from "@/components/CourseCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses?limit=3")
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <span className="text-xs font-medium tracking-wide uppercase text-amber-dark">
            Learn without limits
          </span>
          <h1 className="text-4xl md:text-5xl leading-tight mt-3">
            Build real skills, one lesson at a time.
          </h1>
          <p className="mt-5 text-slate-light text-lg max-w-md">
            Pathway connects instructors and students in one place — courses, video
            lessons, and progress tracking that actually keeps you moving forward.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/courses" className="btn-primary">
              Browse courses
            </Link>
            <Link href="/register" className="btn-outline">
              Become an instructor
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <div className="w-full aspect-square max-w-sm rounded-2xl bg-gradient-to-br from-ink via-slate to-ink/80 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-6xl text-amber/80">P</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Popular courses</h2>
          <Link href="/courses" className="text-sm text-ink underline">
            View all
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading courses..." />
        ) : courses.length === 0 ? (
          <p className="text-slate-light">No published courses yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
