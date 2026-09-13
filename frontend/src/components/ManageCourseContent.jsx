"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { CATEGORIES, LEVELS } from "@/lib/constants";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import SuccessMessage from "@/components/SuccessMessage";
import LessonManager from "@/components/LessonManager";
import EnrolledStudents from "@/components/EnrolledStudents";

export default function ManageCourseContent() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [courseRes, lessonsRes, enrollRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/lessons/course/${id}`),
        api.get(`/enrollments/course/${id}`),
      ]);
      setCourse(courseRes.data.course);
      setForm({
        title: courseRes.data.course.title,
        description: courseRes.data.course.description,
        category: courseRes.data.course.category,
        level: courseRes.data.course.level,
        thumbnail: courseRes.data.course.thumbnail || "",
      });
      setLessons(lessonsRes.data.lessons);
      setEnrollments(enrollRes.data.enrollments);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this course.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await api.put(`/courses/${id}`, form);
      setCourse(res.data.course);
      setSuccess("Course details saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    setError("");
    try {
      const res = await api.put(`/courses/${id}`, { isPublished: !course.isPublished });
      setCourse(res.data.course);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update publish status.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm("Delete this course permanently? All lessons and enrollments will be removed too.")) return;
    try {
      await api.delete(`/courses/${id}`);
      router.push("/instructor");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete course.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading course..." />;
  if (error && !course) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }
  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Breadcrumbs items={[{ label: "Instructor", href: "/instructor" }, { label: course.title }]} />

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl">{course.title}</h1>
        <div className="flex items-center gap-3">
          <button onClick={togglePublish} className={course.isPublished ? "btn-outline" : "btn-primary"}>
            {course.isPublished ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-1" />}
            {course.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button onClick={handleDeleteCourse} className="btn-outline hover:!border-danger hover:!text-danger">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Course details form */}
      <form onSubmit={handleSaveDetails} className="card p-6 flex flex-col gap-4 mb-12">
        <h2 className="text-xl mb-1">Course details</h2>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Title</label>
          <input type="text" name="title" required className="input-field" value={form.title} onChange={handleFormChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Description</label>
          <textarea name="description" required rows={4} className="input-field resize-none" value={form.description} onChange={handleFormChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Category</label>
            <select name="category" className="input-field" value={form.category} onChange={handleFormChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Level</label>
            <select name="level" className="input-field capitalize" value={form.level} onChange={handleFormChange}>
              {LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Thumbnail URL</label>
          <input type="url" name="thumbnail" className="input-field" value={form.thumbnail} onChange={handleFormChange} placeholder="https://..." />
        </div>

        <button type="submit" disabled={saving} className="btn-primary self-start mt-2">
          {saving ? "Saving..." : "Save details"}
        </button>
      </form>

      <div className="mb-12">
        <LessonManager courseId={id} lessons={lessons} onChange={loadAll} />
      </div>

      <EnrolledStudents enrollments={enrollments} />
    </div>
  );
}