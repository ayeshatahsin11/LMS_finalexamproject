"use client";

import { useState } from "react";
import { GripVertical, Pencil, Trash2, Plus, X } from "lucide-react";
import api from "@/lib/axios";
import ErrorMessage from "@/components/ErrorMessage";

const emptyForm = { title: "", description: "", videoUrl: "", duration: "", isFreePreview: false };

export default function LessonManager({ courseId, lessons, onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openAddForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (lesson) => {
    setForm({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl,
      duration: lesson.duration || "",
      isFreePreview: lesson.isFreePreview,
    });
    setEditingId(lesson._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form, duration: form.duration ? Number(form.duration) : 0 };
      if (editingId) {
        await api.put(`/lessons/${editingId}`, payload);
      } else {
        await api.post(`/lessons/course/${courseId}`, { ...payload, order: lessons.length });
      }
      setShowForm(false);
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm("Delete this lesson? This cannot be undone.")) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete lesson.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Lessons</h2>
        {!showForm && (
          <button onClick={openAddForm} className="btn-outline">
            <Plus size={16} className="mr-1" /> Add lesson
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4 mb-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg">{editingId ? "Edit lesson" : "New lesson"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-text-faint hover:text-text">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              required
              className="input-field"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Setting up your environment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Description <span className="text-text-faint font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              rows={2}
              className="input-field resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              required
              className="input-field"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="YouTube link or direct video URL"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Duration (seconds) <span className="text-text-faint font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="duration"
                min="0"
                className="input-field"
                value={form.duration}
                onChange={handleChange}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text pb-2.5">
              <input
                type="checkbox"
                name="isFreePreview"
                checked={form.isFreePreview}
                onChange={handleChange}
                className="h-4 w-4 accent-purple"
              />
              Free preview (visible without enrolling)
            </label>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Saving..." : editingId ? "Save changes" : "Add lesson"}
          </button>
        </form>
      )}

      <div className="card divide-y divide-border overflow-hidden">
        {lessons.length === 0 ? (
          <p className="p-5 text-text-muted text-sm">No lessons yet. Add your first one above.</p>
        ) : (
          lessons.map((lesson, i) => (
            <div key={lesson._id} className="flex items-center gap-3 px-5 py-3.5">
              <GripVertical size={16} className="text-text-faint shrink-0" />
              <span className="text-sm text-text-faint w-5">{i + 1}.</span>
              <span className="flex-1 text-sm text-text truncate">{lesson.title}</span>
              {lesson.isFreePreview && (
                <span className="text-xs text-pink border border-pink/30 rounded px-2 py-0.5 shrink-0">
                  Free preview
                </span>
              )}
              <button onClick={() => openEditForm(lesson)} className="text-text-faint hover:text-text shrink-0">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(lesson._id)} className="text-text-faint hover:text-danger shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}