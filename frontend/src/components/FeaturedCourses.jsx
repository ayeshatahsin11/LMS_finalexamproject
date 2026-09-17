"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import CourseCard from "@/components/CourseCard";
import CourseGridSkeleton from "@/components/CourseGridSkeleton";

export default function FeaturedCourses() {
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
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Popular courses</h2>
        <Link href="/courses" className="text-sm text-purple hover:text-pink transition">
          View all →
        </Link>
      </div>

      {loading ? (
        <CourseGridSkeleton count={3} />
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
  );
}

