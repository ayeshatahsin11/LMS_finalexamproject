"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import RowSkeleton from "@/components/RowSkeleton";
import { useAutoDismiss } from "@/lib/useAutoDismiss";
import { CATEGORY_ICON_NAMES, CATEGORY_COLORS, getCategoryIcon } from "@/lib/categoryIcons";

const EMPTY_FORM = {
  name: "",
  icon: CATEGORY_ICON_NAMES[0],
  color: CATEGORY_COLORS[0],
  isActive: true,
  order: 0,
};

export default function ManageCategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useAutoDismiss(success, setSuccess);

  const loadCategories = useCallback(() => {
    setLoading(true);
    api
      .get("/categories/all")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => setError(err.response?.data?.message || "Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      icon: cat.icon || CATEGORY_ICON_NAMES[0],
      color: cat.color || CATEGORY_COLORS[0],
      isActive: !!cat.isActive,
      order: cat.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/categories/${editingId}`, form);
        setSuccess("Category updated.");
        setCategories((prev) => prev.map((c) => (c._id === editingId ? { ...c, ...res.data.category } : c)));
      } else {
        const res = await api.post("/categories", form);
        setSuccess("Category created.");
        setCategories((prev) => [...prev, { ...res.data.category, courseCount: 0 }]);
      }
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (cat) => {
    setBusyId(cat._id);
    setError("");
    try {
      const res = await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? { ...c, ...res.data.category } : c)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this category.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (cat) => {
    const extra = cat.courseCount > 0 ? ` ${cat.courseCount} existing course(s) will keep this category's text, they just won't be findable through it anymore.` : "";
    if (!confirm(`Delete "${cat.name}"?${extra}`)) return;
    setBusyId(cat._id);
    setError("");
    try {
      await api.delete(`/categories/${cat._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      if (editingId === cat._id) cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete category.");
    } finally {
      setBusyId(null);
    }
  };

  const PreviewIcon = getCategoryIcon(form.icon);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Manage categories" }]} />
      <h1 className="text-3xl mb-1">Categories</h1>
      <p className="text-text-muted mb-8">
        These power the homepage category grid, the course filter dropdown, and what
        instructors pick from when creating a course. Hide a category to pull it from the
        site without affecting courses that already use it.
      </p>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {/* Create / edit form */}
      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif text-text">
            {editingId ? "Edit category" : "Create a new category"}
          </h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-text-faint hover:text-text flex items-center gap-1">
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 shrink-0 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${form.color}22` }}
          >
            <PreviewIcon size={24} color={form.color} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-1.5">Category name</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Web Development"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Icon</label>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {CATEGORY_ICON_NAMES.map((name) => {
              const IconOption = getCategoryIcon(name);
              const selected = form.icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => setForm({ ...form, icon: name })}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center border transition ${
                    selected
                      ? "border-purple bg-purple/15 text-purple"
                      : "border-border text-text-faint hover:text-text hover:border-purple/50"
                  }`}
                >
                  <IconOption size={17} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((color) => {
              const selected = form.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => setForm({ ...form, color })}
                  className={`h-9 w-9 rounded-full transition ${selected ? "ring-2 ring-offset-2 ring-offset-surface ring-white/80" : ""}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Display order <span className="text-text-faint font-normal">(lowest shows first)</span>
            </label>
            <input
              type="number"
              name="order"
              className="input-field"
              value={form.order}
              onChange={handleChange}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-text cursor-pointer w-fit pb-3">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-purple h-4 w-4" />
            Show on the homepage &amp; course filters
          </label>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-fit">
          {submitting ? "Saving..." : editingId ? "Save changes" : "Create category"}
        </button>
      </form>

      {/* Existing categories */}
      <h2 className="text-lg font-serif text-text mb-4">All categories</h2>

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-text-muted text-sm">
          No categories yet — create one above. Ran the backend seed script? See{" "}
          <code className="text-xs bg-surface-hover px-1.5 py-0.5 rounded">npm run seed:categories</code>{" "}
          in the backend folder to restore the original 6.
        </p>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            const isBusy = busyId === cat._id;
            return (
              <div key={cat._id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}22` }}
                >
                  <Icon size={18} color={cat.color} />
                </div>

                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm text-text">{cat.name}</p>
                  <p className="text-xs text-text-faint">
                    {cat.courseCount} course{cat.courseCount === 1 ? "" : "s"} · order {cat.order ?? 0}
                  </p>
                </div>

                <button
                  disabled={isBusy}
                  onClick={() => toggleActive(cat)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded transition disabled:opacity-50 ${
                    cat.isActive ? "bg-success/10 text-success" : "bg-surface-hover text-text-faint hover:text-text"
                  }`}
                >
                  {cat.isActive ? "Visible" : "Hidden"}
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => startEdit(cat)}
                  className="text-xs text-text-faint hover:text-text transition disabled:opacity-50 flex items-center gap-1"
                >
                  <Pencil size={13} /> Edit
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => handleDelete(cat)}
                  className="text-xs text-text-faint hover:text-danger transition disabled:opacity-50 flex items-center gap-1"
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