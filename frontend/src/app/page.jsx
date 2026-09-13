//  ============= main home page ==================== //

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import CourseCard from "@/components/CourseCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoryShowcase from "@/components/CategoryShowcase";
import HowItWorks from "@/components/HowItWorks";

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
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
        <div className="animate-fade-in-up relative z-10">
          <span className="inline-block text-xs font-medium tracking-wide uppercase text-pink px-3 py-1 rounded-full border border-pink/30 bg-pink/5">
            Learn without limits
          </span>
          <h1 className="text-4xl md:text-5xl leading-tight mt-4">
            Build real skills,<br />
            <span className="gradient-text">one lesson at a time.</span>
          </h1>
          <p className="mt-5 text-text-muted text-lg max-w-md">
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

        <div className="hidden md:flex items-center justify-center relative">
          <div className="absolute w-72 h-72 rounded-full bg-purple/30 blur-3xl animate-glow" />
          <div className="absolute w-56 h-56 rounded-full bg-pink/20 blur-3xl translate-x-16 -translate-y-10 animate-glow" />
          <div className="gradient-border w-full max-w-sm aspect-square relative z-10">
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-7xl gradient-text">P</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Popular courses</h2>
          <Link href="/courses" className="text-sm text-purple hover:text-pink transition">
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading courses..." />
        ) : courses.length === 0 ? (
          <p className="text-text-muted">No published courses yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      <HowItWorks />
      <CategoryShowcase />
    </div>
  );
}