"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import api from "@/lib/axios";
import { CATEGORIES, LEVELS } from "@/lib/constants";

function NewCourseForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    level: LEVELS[0],
    thumbnail: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/courses", form);
      router.push(`/instructor/courses/${res.data.course._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create course.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Instructor", href: "/instructor" }, { label: "New course" }]} />

      <h1 className="text-3xl mb-1">Create a new course</h1>
      <p className="text-text-muted mb-8">
        Start with the basics — you can add lessons and publish it once it's ready.
      </p>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <ErrorMessage message={error} />

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Course title</label>
          <input
            type="text"
            name="title"
            required
            className="input-field"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete Web Development Bootcamp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="input-field resize-none"
            value={form.description}
            onChange={handleChange}
            placeholder="What will students learn in this course?"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Category</label>
            <select name="category" className="input-field" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Level</label>
            <select name="level" className="input-field capitalize" value={form.level} onChange={handleChange}>
              {LEVELS.map((l) => (
                <option key={l} value={l} className="capitalize">{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Thumbnail URL <span className="text-text-faint font-normal">(optional)</span>
          </label>
          <input
            type="url"
            name="thumbnail"
            className="input-field"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "Creating..." : "Create course & add lessons"}
        </button>
      </form>
    </div>
  );
}

export default function NewCoursePage() {
  return (
    <RequireAuth roles={["instructor", "admin"]}>
      <NewCourseForm />
    </RequireAuth>
  );
}