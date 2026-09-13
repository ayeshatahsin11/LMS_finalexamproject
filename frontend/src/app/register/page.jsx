"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const newUser = await register(form.name, form.email, form.password, form.role);
      router.push(newUser.role === "instructor" ? "/instructor" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute w-80 h-80 rounded-full bg-purple/20 blur-3xl -top-10 -right-20 animate-glow" />
      <div className="absolute w-72 h-72 rounded-full bg-indigo/15 blur-3xl bottom-0 left-0 animate-glow" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        <div className="card p-8">
          <h1 className="text-2xl mb-1">Create your account</h1>
          <p className="text-sm text-text-muted mb-8">Start learning or start teaching.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ErrorMessage message={error} />

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Full name</label>
              <input
                type="text"
                name="name"
                required
                spellCheck={false}
                autoComplete="name"
                className="input-field"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </div>

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
              <input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">I am joining as a...</label>
              <div className="grid grid-cols-2 gap-3">
                {["student", "instructor"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`rounded-md border px-4 py-2.5 text-sm font-medium capitalize transition ${
                      form.role === r
                        ? "border-transparent text-white"
                        : "border-border text-text-muted hover:border-purple/50"
                    }`}
                    style={
                      form.role === r
                        ? { backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)" }
                        : {}
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-text-muted mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-pink font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}