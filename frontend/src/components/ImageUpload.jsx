"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import api from "@/lib/axios";

// Reusable image upload field: shows a preview, uploads to the backend
// (which streams to Cloudinary) as soon as a file is picked, and calls
// onUploaded(url) with the resulting Cloudinary URL once it's done.
// `value` is the current image URL (if any) - controlled from the parent
// form, same pattern as a text input.
export default function ImageUpload({ value, onUploaded, label = "Image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
      // Reset so picking the same file again still fires onChange.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload-input"
      />

      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
            aria-label="Remove image"
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
          className="w-full h-40 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-text-faint hover:border-purple/50 hover:text-text-muted transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} />
              <span className="text-sm">Click to upload an image</span>
              <span className="text-xs">PNG or JPG, up to 5MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
    </div>
  );
}