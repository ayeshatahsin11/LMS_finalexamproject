"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageIcon, Pencil, Trash2, X } from "lucide-react";
import api from "@/lib/axios";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import RowSkeleton from "@/components/RowSkeleton";
import { useAutoDismiss } from "@/lib/useAutoDismiss";

const EMPTY_FORM = {
  badge: "",
  title: "",
  highlight: "",
  description: "",
  mediaType: "none",
  mediaUrl: "",
  primaryButtonText: "Browse courses",
  primaryButtonLink: "/courses",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  isActive: false,
  order: 0,
};

export default function ManageBannersContent() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useAutoDismiss(success, setSuccess);

  const loadBanners = useCallback(() => {
    setLoading(true);
    api
      .get("/banners")
      .then((res) => setBanners(res.data.banners))
      .catch((err) => setError(err.response?.data?.message || "Could not load banners."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const startEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      badge: banner.badge || "",
      title: banner.title || "",
      highlight: banner.highlight || "",
      description: banner.description || "",
      mediaType: banner.mediaType || "none",
      mediaUrl: banner.mediaUrl || "",
      primaryButtonText: banner.primaryButtonText || "",
      primaryButtonLink: banner.primaryButtonLink || "",
      secondaryButtonText: banner.secondaryButtonText || "",
      secondaryButtonLink: banner.secondaryButtonLink || "",
      isActive: !!banner.isActive,
      order: banner.order ?? 0,
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
        const res = await api.put(`/banners/${editingId}`, form);
        setSuccess("Banner updated.");
        setBanners((prev) => prev.map((b) => (b._id === editingId ? res.data.banner : b)));
      } else {
        const res = await api.post("/banners", form);
        setSuccess("Banner created.");
        setBanners((prev) => [...prev, res.data.banner]);
      }
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save banner.");
    } finally {
      setSubmitting(false);
    }
  };

  // Multiple banners can be active at once - toggling one on/off never
  // touches any other banner, unlike a single-select "set live" action.
  const toggleActive = async (banner) => {
    setBusyId(banner._id);
    setError("");
    try {
      const res = await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      setBanners((prev) => prev.map((b) => (b._id === banner._id ? res.data.banner : b)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this banner.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await api.delete(`/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete banner.");
    } finally {
      setBusyId(null);
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Manage banner" }]} />
      <h1 className="text-3xl mb-1">Homepage banner</h1>
      <p className="text-text-muted mb-8">
        Control the hero section on the homepage. Activate one banner for a static hero, or
        activate several to rotate them as an auto-playing slider — lowest{" "}
        <span className="text-text">order</span> shows first, and hovering the hero pauses it.
        {activeCount > 1 && (
          <span className="text-text">
            {" "}
            {activeCount} banners are currently active and rotating.
          </span>
        )}
      </p>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {/* Create / edit form */}
      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif text-text">
            {editingId ? "Edit banner" : "Create a new banner"}
          </h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-text-faint hover:text-text flex items-center gap-1">
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Badge <span className="text-text-faint font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="badge"
              className="input-field"
              value={form.badge}
              onChange={handleChange}
              placeholder="e.g. Limited-time offer"
            />
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
              placeholder="e.g. Build real skills,"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Highlighted line <span className="text-text-faint font-normal">(gradient text, optional)</span>
          </label>
          <input
            type="text"
            name="highlight"
            className="input-field"
            value={form.highlight}
            onChange={handleChange}
            placeholder="e.g. one lesson at a time."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Description</label>
          <textarea
            name="description"
            rows={3}
            className="input-field resize-none"
            value={form.description}
            onChange={handleChange}
            placeholder="A short line under the headline."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Media type</label>
            <select name="mediaType" className="input-field capitalize" value={form.mediaType} onChange={handleChange}>
              <option value="none">None (default graphic)</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          {form.mediaType !== "none" && (
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {form.mediaType === "image" ? "Image URL" : "Video URL (YouTube or direct file)"}
              </label>
              <input
                type="url"
                name="mediaUrl"
                className="input-field"
                value={form.mediaUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Primary button text</label>
            <input
              type="text"
              name="primaryButtonText"
              className="input-field"
              value={form.primaryButtonText}
              onChange={handleChange}
              placeholder="Browse courses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Primary button link</label>
            <input
              type="text"
              name="primaryButtonLink"
              className="input-field"
              value={form.primaryButtonLink}
              onChange={handleChange}
              placeholder="/courses"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Secondary button text <span className="text-text-faint font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="secondaryButtonText"
              className="input-field"
              value={form.secondaryButtonText}
              onChange={handleChange}
              placeholder="Become an instructor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Secondary button link</label>
            <input
              type="text"
              name="secondaryButtonLink"
              className="input-field"
              value={form.secondaryButtonLink}
              onChange={handleChange}
              placeholder="/register"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Slider order <span className="text-text-faint font-normal">(lowest shows first)</span>
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
            Include in the homepage rotation
          </label>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-fit">
          {submitting ? "Saving..." : editingId ? "Save changes" : "Create banner"}
        </button>
      </form>

      {/* Existing banners */}
      <h2 className="text-lg font-serif text-text mb-4">All banners</h2>

      {loading ? (
        <div className="card divide-y divide-border overflow-hidden">
          <RowSkeleton />
          <RowSkeleton />
        </div>
      ) : banners.length === 0 ? (
        <p className="text-text-muted text-sm">
          No banners yet — create one above to replace the default hero content.
        </p>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {banners.map((b) => {
            const isBusy = busyId === b._id;
            return (
              <div key={b._id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-hover flex items-center justify-center">
                  <ImageIcon size={18} className="text-text-faint" />
                </div>

                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm text-text">{b.title}</p>
                  <p className="text-xs text-text-faint capitalize">
                    {b.mediaType === "none" ? "No media" : `${b.mediaType} media`} · order {b.order ?? 0}
                  </p>
                </div>

                <button
                  disabled={isBusy}
                  onClick={() => toggleActive(b)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded transition disabled:opacity-50 ${
                    b.isActive ? "bg-success/10 text-success" : "bg-surface-hover text-text-faint hover:text-text"
                  }`}
                >
                  {b.isActive ? "In rotation" : "Inactive"}
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => startEdit(b)}
                  className="text-xs text-text-faint hover:text-text transition disabled:opacity-50 flex items-center gap-1"
                >
                  <Pencil size={13} /> Edit
                </button>

                <button
                  disabled={isBusy}
                  onClick={() => handleDelete(b._id)}
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