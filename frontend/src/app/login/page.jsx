"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      const redirectTo =
        loggedInUser.role === "admin"
          ? "/admin"
          : loggedInUser.role === "instructor"
          ? "/instructor"
          : "/dashboard";
      router.push(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm animate-fade-in-up">
        <h1 className="text-2xl mb-1">Welcome back</h1>
        <p className="text-sm text-slate-light mb-8">Log in to continue your learning.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorMessage message={error} />
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-slate-light mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-ink font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
