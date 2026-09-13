"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, GraduationCap, ShieldCheck, Search, Plus, BookOpen } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AdminDashboardContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;

    api
      .get("/users", { params })
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.response?.data?.message || "Could not load users."))
      .finally(() => setLoading(false));
  }, [search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (id, role) => {
    setBusyId(id);
    setError("");
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update role.");
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (u) => {
    setBusyId(u._id);
    setError("");
    try {
      await api.put(`/users/${u._id}`, { isActive: !u.isActive });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isActive: !u.isActive } : x)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this user? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    student: users.filter((u) => u.role === "student").length,
    instructor: users.filter((u) => u.role === "instructor").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin" }]} />
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-3xl">Admin dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/instructor" className="btn-outline">
            <BookOpen size={16} className="mr-1" /> My courses
          </Link>
          <Link href="/instructor/courses/new" className="btn-primary">
            <Plus size={16} className="mr-1" /> Create course
          </Link>
        </div>
      </div>
      <p className="text-text-muted mb-8">Manage every account on the platform.</p>

      <ErrorMessage message={error} />

      {/* Summary stats */}
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

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field !pl-9"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field sm:w-48 capitalize">
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {users.length === 0 ? (
            <p className="p-5 text-text-muted text-sm">No users match your filters.</p>
          ) : (
            users.map((u) => {
              const isSelf = u._id === currentUser?._id;
              const isBusy = busyId === u._id;
              return (
                <div key={u._id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-sm text-text">{u.name} {isSelf && <span className="text-text-faint">(you)</span>}</p>
                    <p className="text-xs text-text-faint">{u.email}</p>
                  </div>

                  <select
                    value={u.role}
                    disabled={isSelf || isBusy}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="input-field !py-1.5 !w-32 text-xs capitalize disabled:opacity-50"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    disabled={isSelf || isBusy}
                    onClick={() => toggleActive(u)}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded transition disabled:opacity-50 ${
                      u.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}
                  >
                    {u.isActive ? "Active" : "Deactivated"}
                  </button>

                  <button
                    disabled={isSelf || isBusy}
                    onClick={() => handleDelete(u._id)}
                    className="text-xs text-text-faint hover:text-danger transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}