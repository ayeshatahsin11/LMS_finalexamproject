"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

// Drop-in replacement for <input type="password">, with an eye icon to
// toggle visibility. Accepts the same props (name, value, onChange,
// placeholder, autoComplete, required, minLength, etc.) and forwards
// them straight to the underlying <input>.
const PasswordInput = forwardRef(function PasswordInput(
  { className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={`input-field !pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

export default PasswordInput;