"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Pencil, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import ReviewMarqueeColumn from "./ReviewMarqueeColumn";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import { useAutoDismiss } from "@/lib/useAutoDismiss";

const MAX_QUOTE_LENGTH = 300;
const EMPTY_FORM = { role: "", quote: "", rating: 5 };

export default function ReviewsSection() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [myReview, setMyReview] = useState(null);
  const [loadingMine, setLoadingMine] = useState(!!user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useAutoDismiss(success, setSuccess);

  useEffect(() => {
    api
      .get("/reviews")
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, []);

  // Only ever check "my review" when actually logged in - calling a
  // protected route as a guest would 401 and trigger the axios
  // interceptor's redirect-to-login, which is the last thing a visitor
  // just browsing the homepage should hit.
  useEffect(() => {
    if (!user) {
      setMyReview(null);
      setLoadingMine(false);
      return;
    }
    setLoadingMine(true);
    api
      .get("/reviews/mine")
      .then((res) => setMyReview(res.data.review))
      .catch(() => setMyReview(null))
      .finally(() => setLoadingMine(false));
  }, [user]);

  // Split into 3 columns, round-robin - works for any number of
  // reviews, not just a fixed set of 6. Each column scrolls a different
  // direction for the "wall of testimonials" effect.
  const columns = [[], [], []];
  reviews.forEach((r, i) => columns[i % 3].push(r));

  const startEdit = () => {
    setForm({ role: myReview.role, quote: myReview.quote, rating: myReview.rating });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      if (myReview) {
        const res = await api.put(`/reviews/${myReview._id}`, form);
        setMyReview(res.data.review);
        setReviews((prev) => prev.map((r) => (r._id === myReview._id ? res.data.review : r)));
        setSuccess("Your review was updated.");
      } else {
        const res = await api.post("/reviews", form);
        setMyReview(res.data.review);
        setReviews((prev) => [res.data.review, ...prev]);
        setSuccess("Thanks for sharing!");
      }
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview || !confirm("Delete your review?")) return;
    setSubmitting(true);
    setError("");
    try {
      await api.delete(`/reviews/${myReview._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== myReview._id));
      setMyReview(null);
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const showForm = user && (editing || !myReview);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-block text-xs font-medium tracking-wide uppercase text-pink px-3 py-1 rounded-full border border-pink/30 bg-pink/5 mb-4">
          Success stories
        </span>
        <h1 className="text-4xl leading-tight mb-3">
          What our <span className="gradient-text">students</span> say
        </h1>
        <p className="text-text-muted text-lg">
          Real people, real courses, real progress. Here&apos;s what learning on Pathway looks like.
        </p>
      </div>

      {!loadingReviews && reviews.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <ReviewMarqueeColumn stories={columns[0]} reverse={false} />
          <ReviewMarqueeColumn stories={columns[1]} reverse={true} className="hidden sm:block" />
          <ReviewMarqueeColumn stories={columns[2]} reverse={false} className="hidden lg:block" />
        </div>
      )}

      <div className="card p-10">
        {!user ? (
          <div className="text-center">
            <h2 className="text-2xl mb-2">Ready to write your own success story?</h2>
            <p className="text-text-muted mb-6">Join and start your first course today.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/courses" className="btn-primary">
                Browse courses
              </Link>
              <Link href="/login" className="btn-outline">
                Log in to leave a review
              </Link>
            </div>
          </div>
        ) : loadingMine ? null : showForm ? (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl mb-1 text-center">
              {myReview ? "Edit your review" : "Share your experience"}
            </h2>
            <p className="text-text-muted mb-6 text-center">
              {myReview ? "Update what you wrote below." : "One review per account - you can edit it any time."}
            </p>

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Your rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      <Star
                        size={26}
                        className={
                          n <= (hoverRating || form.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-border"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Your role <span className="text-text-faint font-normal">(shown under your name)</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Completed Web Development Bootcamp"
                  maxLength={80}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text">Your review</label>
                  <span className="text-xs text-text-faint">
                    {form.quote.length}/{MAX_QUOTE_LENGTH}
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value.slice(0, MAX_QUOTE_LENGTH) })}
                  placeholder="What was your experience learning on Pathway?"
                />
              </div>

              <div className="flex items-center gap-3 mt-1">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving..." : myReview ? "Save changes" : "Submit review"}
                </button>
                {myReview && (
                  <button type="button" onClick={cancelEdit} className="text-sm text-text-faint hover:text-text transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl mb-4">Your review</h2>
            <ErrorMessage message={error} />
            <div className="card p-6 text-left mb-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < myReview.rating ? "text-amber-400 fill-amber-400" : "text-border"}
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">&quot;{myReview.quote}&quot;</p>
              <p className="text-xs text-text-faint mt-3">{myReview.role}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={startEdit} className="btn-outline flex items-center gap-1.5">
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="text-sm text-danger hover:opacity-80 transition flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}