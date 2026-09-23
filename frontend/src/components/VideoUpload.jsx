"use client";

import { useRef, useState } from "react";
import { FileVideo, X, Loader2 } from "lucide-react";
import api from "@/lib/axios";

// Reusable video upload field: shows a preview player, uploads to the
// backend (which streams to Cloudinary) as soon as a file is picked,
// and calls onUploaded(url, duration) once it's done - duration (in
// seconds) comes straight from Cloudinary reading the file, so the
// lesson form can auto-fill it instead of the instructor guessing.
// `value` is the current video URL (if any) - controlled from the
// parent form, same pattern as a text input.
export default function VideoUpload({ value, onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url, res.data.duration);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try a smaller file (max 100MB).");
    } finally {
      setUploading(false);
      // Reset so picking the same file again still fires onChange.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
        id="video-upload-input"
      />

      {value ? (
        <div className="relative w-full rounded-lg overflow-hidden border border-border bg-black group">
          <video src={value} controls className="w-full max-h-56" />
          <button
            type="button"
            onClick={() => onUploaded("", 0)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
            aria-label="Remove video"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-3 py-1.5 rounded-md hover:bg-black/80 transition"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-text-faint hover:border-purple/50 hover:text-text-muted transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">Uploading... this can take a moment</span>
            </>
          ) : (
            <>
              <FileVideo size={22} />
              <span className="text-sm">Click to upload a video</span>
              <span className="text-xs">MP4, MOV or WebM, up to 100MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  );
}