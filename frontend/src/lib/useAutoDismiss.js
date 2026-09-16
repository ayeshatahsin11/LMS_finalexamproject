"use client";

import { useEffect } from "react";

// Auto-clears a message (success/error) after `delay` ms. Pass the
// current value and its setter - resets the timer whenever the value
// changes, and does nothing while the value is empty.
// Usage: useAutoDismiss(successMsg, setSuccessMsg);
export function useAutoDismiss(value, setValue, delay = 4000) {
  useEffect(() => {
    if (!value) return;
    const timer = setTimeout(() => setValue(""), delay);
    return () => clearTimeout(timer);
  }, [value, setValue, delay]);
}