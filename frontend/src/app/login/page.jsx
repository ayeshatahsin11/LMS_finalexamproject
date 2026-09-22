"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";
import PasswordInput from "@/components/PasswordInput";

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
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute w-80 h-80 rounded-full bg-indigo/20 blur-3xl -top-10 -left-20 animate-glow" />
      <div className="absolute w-72 h-72 rounded-full bg-pink/15 blur-3xl bottom-0 right-0 animate-glow" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        <div className="card p-8">
          <h1 className="text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-text-muted mb-8">Log in to continue your learning.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ErrorMessage message={error} />
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                spellCheck={false}
                autoComplete="email"
                className="input-field"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Password</label>
              <PasswordInput
                name="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-text-muted mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-pink font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}