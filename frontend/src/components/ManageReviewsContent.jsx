"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import RowSkeleton from "@/components/RowSkeleton";
import { useAutoDismiss } from "@/lib/useAutoDismiss";

export default function ManageReviewsContent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  useAutoDismiss(success, setSuccess);

  const loadReviews = useCallback(() => {
    setLoading(true);
    api
      .get("/reviews/all")
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => setError(err.response?.data?.message || "Could not load reviews."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const toggleVisibility = async (review) => {
    setBusyId(review._id);
    setError("");
    try {
      const res = await api.patch(`/reviews/${review._id}/visibility`);
      setReviews((prev) => prev.map((r) => (r._id === review._id ? res.data.review : r)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this review.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (review) => {
    if (!confirm(`Delete ${review.name}'s review? This cannot be undone.`)) return;
    setBusyId(review._id);
    setError("");
    try {
      await api.delete(`/reviews/${review._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
      setSuccess("Review deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this review.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Manage reviews" }]} />
      <h1 className="text-3xl mb-1">Reviews</h1>
      <p className="text-text-muted mb-8">
        Every review submitted from the homepage or the reviews page — students and
        instructors write these themselves. Hide one to pull it from the public marquee
        without deleting it outright.
      </p>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-text-muted text-sm">
          No reviews yet — run <code className="text-xs bg-surface-hover px-1.5 py-0.5 rounded">npm run seed:reviews</code>{" "}
          in the backend folder to restore the original 6, or wait for students/instructors to write their own.
        </p>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {reviews.map((r) => {
            const isBusy = busyId === r._id;
            return (
              <div key={r._id} className="flex items-start gap-4 px-5 py-4 flex-wrap">
                <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-indigo via-purple to-pink flex items-center justify-center text-white font-serif text-sm">
                  {r.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-text">{r.name}</p>
                    <span className="text-xs text-text-faint">{r.role}</span>
                    {!r.user && (
                      <span className="text-[10px] uppercase tracking-wide text-text-faint bg-surface-hover px-1.5 py-0.5 rounded">
                        seeded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 max-w-lg">&quot;{r.quote}&quot;</p>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        className={idx < r.rating ? "text-amber-400 fill-amber-400" : "text-border"}
                      />
                    ))}
                  </div>
                </div>

                <button
                  disabled={isBusy}
                  onClick={() => toggleVisibility(r)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded transition disabled:opacity-50 shrink-0 ${
                    r.isVisible ? "bg-success/10 text-success" : "bg-surface-hover text-text-faint hover:text-text"
                  }`}
                >
                  {r.isVisible ? "Visible" : "Hidden"}
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => handleDelete(r)}
                  className="text-xs text-text-faint hover:text-danger transition disabled:opacity-50 flex items-center gap-1 shrink-0"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}