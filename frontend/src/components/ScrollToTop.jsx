"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show the button once the user has scrolled down a bit,
      // so it doesn't clutter short pages.
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full flex items-center justify-center cursor-pointer text-white shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)",
        boxShadow: "0 4px 20px rgba(168, 85, 247, 0.4)",
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
}