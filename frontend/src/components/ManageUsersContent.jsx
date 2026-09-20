"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import RowSkeleton from "@/components/RowSkeleton";
import ProgressBar from "@/components/ProgressBar";

export default function ManageUsersContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [enrollmentsByUser, setEnrollmentsByUser] = useState({});

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

  const loadEnrollmentsFor = async (userId) => {
    try {
      const res = await api.get(`/enrollments/user/${userId}`);
      setEnrollmentsByUser((prev) => ({ ...prev, [userId]: res.data.enrollments }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this student's courses.");
    }
  };

  const toggleExpand = (u) => {
    if (u.role !== "student") return; // only students have enrollments
    if (expandedId === u._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(u._id);
    if (!enrollmentsByUser[u._id]) {
      loadEnrollmentsFor(u._id);
    }
  };

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Manage users" }]} />
      <h1 className="text-3xl mb-1">Manage users</h1>
      <p className="text-text-muted mb-8">
        Search, moderate, and inspect every account. Click a student to see their courses and progress.
      </p>

      <ErrorMessage message={error} />

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
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {users.length === 0 ? (
            <p className="p-5 text-text-muted text-sm">No users match your filters.</p>
          ) : (
            users.map((u) => {
              const isSelf = u._id === currentUser?._id;
              const isBusy = busyId === u._id;
              const isOpen = expandedId === u._id;
              const enrollments = enrollmentsByUser[u._id];

              return (
                <div key={u._id}>
                  <div
                    onClick={() => toggleExpand(u)}
                    className={`flex items-center gap-4 px-5 py-4 flex-wrap ${
                      u.role === "student" ? "cursor-pointer hover:bg-surface-hover" : ""
                    } transition`}
                  >
                    <div className="flex-1 min-w-[160px]">
                      <p className="text-sm text-text">
                        {u.name} {isSelf && <span className="text-text-faint">(you)</span>}
                      </p>
                      <p className="text-xs text-text-faint">{u.email}</p>
                    </div>

                    <select
                      value={u.role}
                      disabled={isSelf || isBusy}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="input-field !py-1.5 !w-32 text-xs capitalize disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      disabled={isSelf || isBusy}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActive(u);
                      }}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded transition disabled:opacity-50 ${
                        u.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </button>

                    <button
                      disabled={isSelf || isBusy}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(u._id);
                      }}
                      className="text-xs text-text-faint hover:text-danger transition disabled:opacity-50"
                    >
                      Delete
                    </button>

                    {u.role === "student" && (
                      isOpen ? (
                        <ChevronUp size={16} className="text-text-faint shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-text-faint shrink-0" />
                      )
                    )}
                  </div>

                  {isOpen && (
                    <div className="border-t border-border bg-bg-soft px-5 py-4">
                      {!enrollments ? (
                        <RowSkeleton />
                      ) : enrollments.length === 0 ? (
                        <p className="text-sm text-text-faint">Not enrolled in any course yet.</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {enrollments.map((e) => (
                            <div key={e._id} className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text truncate">{e.course?.title}</p>
                                <p className="text-xs text-text-faint">{e.course?.category}</p>
                              </div>
                              <div className="w-40 shrink-0">
                                <ProgressBar percent={e.progressPercent} />
                              </div>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${
                                  e.status === "completed" ? "bg-success/10 text-success" : "bg-purple/10 text-purple"
                                }`}
                              >
                                {e.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}