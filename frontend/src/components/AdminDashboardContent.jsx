"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, ShieldCheck, ArrowRight, Plus, BookOpen, ImageIcon, LayoutList, LayoutGrid, MessageSquare } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import StatCardSkeleton from "@/components/StatCardSkeleton";

export default function AdminDashboardContent() {
  const [counts, setCounts] = useState({ student: 0, instructor: 0, admin: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users", { params: { limit: 200 } })
      .then((res) => {
        const users = res.data.users;
        setCounts({
          student: users.filter((u) => u.role === "student").length,
          instructor: users.filter((u) => u.role === "instructor").length,
          admin: users.filter((u) => u.role === "admin").length,
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin" }]} />
      <h1 className="text-3xl mb-1">Admin dashboard</h1>
      <p className="text-text-muted mb-8">A quick overview of the whole platform.</p>

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
              <GraduationCap size={20} className="text-indigo" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{counts.student}</p>
              <p className="text-xs text-text-faint">Students</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-pink/15 flex items-center justify-center">
              <Users size={20} className="text-pink" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{counts.instructor}</p>
              <p className="text-xs text-text-faint">Instructors</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-success/15 flex items-center justify-center">
              <ShieldCheck size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-serif text-text">{counts.admin}</p>
              <p className="text-xs text-text-faint">Admins</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/admin/users" className="card card-hover p-6 flex flex-col gap-3">
          <Users size={20} className="text-purple" />
          <h3 className="font-serif text-lg text-text">Manage users</h3>
          <p className="text-sm text-text-muted flex-1">
            Search accounts, change roles, activate/deactivate, and inspect student progress.
          </p>
          <span className="text-sm text-purple flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/admin/courses" className="card card-hover p-6 flex flex-col gap-3">
          <LayoutList size={20} className="text-success" />
          <h3 className="font-serif text-lg text-text">Manage courses</h3>
          <p className="text-sm text-text-muted flex-1">
            Every course on the platform, from any instructor - published or still a draft.
          </p>
          <span className="text-sm text-success flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/admin/categories" className="card card-hover p-6 flex flex-col gap-3">
          <LayoutGrid size={20} className="text-indigo" />
          <h3 className="font-serif text-lg text-text">Manage categories</h3>
          <p className="text-sm text-text-muted flex-1">
            Add, hide or reorder course categories, with their own icon and color.
          </p>
          <span className="text-sm text-indigo flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/admin/reviews" className="card card-hover p-6 flex flex-col gap-3">
          <MessageSquare size={20} className="text-danger" />
          <h3 className="font-serif text-lg text-text">Manage reviews</h3>
          <p className="text-sm text-text-muted flex-1">
            Moderate what students and instructors have written on the homepage.
          </p>
          <span className="text-sm text-danger flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/admin/banners" className="card card-hover p-6 flex flex-col gap-3">
          <ImageIcon size={20} className="text-pink" />
          <h3 className="font-serif text-lg text-text">Homepage banner</h3>
          <p className="text-sm text-text-muted flex-1">
            Update the hero headline, image or video for a promotion or announcement.
          </p>
          <span className="text-sm text-pink flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/instructor/my-courses" className="card card-hover p-6 flex flex-col gap-3">
          <BookOpen size={20} className="text-indigo" />
          <h3 className="font-serif text-lg text-text">My courses</h3>
          <p className="text-sm text-text-muted flex-1">
            View and manage every course you've created, including lessons.
          </p>
          <span className="text-sm text-indigo flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/instructor/courses/new" className="card card-hover p-6 flex flex-col gap-3">
          <Plus size={20} className="text-pink" />
          <h3 className="font-serif text-lg text-text">Create a course</h3>
          <p className="text-sm text-text-muted flex-1">
            Start a new course as an admin, just like an instructor would.
          </p>
          <span className="text-sm text-pink flex items-center gap-1">
            Go there <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </div>
  );
}