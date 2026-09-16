"use client";

import { AlertTriangle, X } from "lucide-react";

// Simple reusable centered modal/popup. Pass an icon, title, message, and
// a primary action button. Used for things more important than an inline
// ErrorMessage - confirmations, security warnings, etc.
export default function Modal({ open, onClose, title, message, actionLabel, onAction, variant = "warning" }) {
  if (!open) return null;

  const iconColor = variant === "danger" ? "text-danger" : "text-amber-400";
  const iconBg = variant === "danger" ? "bg-danger/15" : "bg-amber-400/15";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative card p-6 w-full max-w-sm animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-faint hover:text-text">
          <X size={18} />
        </button>

        <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
          <AlertTriangle size={22} className={iconColor} />
        </div>

        <h3 className="text-lg font-serif text-text mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">{message}</p>

        <button onClick={onAction || onClose} className="btn-primary w-full">
          {actionLabel || "Okay"}
        </button>
      </div>
    </div>
  );
}