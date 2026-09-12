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
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm animate-fade-in-up">
        <h1 className="text-2xl mb-1">Create your account</h1>
        <p className="text-sm text-slate-light mb-8">Start learning or start teaching.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorMessage message={error} />

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </div>

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
              minLength={6}
              className="input-field"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">I am joining as a...</label>
            <div className="grid grid-cols-2 gap-3">
              {["student", "instructor"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-md border px-4 py-2.5 text-sm font-medium capitalize transition ${
                    form.role === r
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-slate hover:border-ink/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-slate-light mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-ink font-medium underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
