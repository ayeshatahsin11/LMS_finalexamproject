"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import CourseCard from "@/components/CourseCard";
import CourseGridSkeleton from "@/components/CourseGridSkeleton";

const DOTS_PER_PAGE = 10; // how many numbered dots to show before paginating the dots themselves

// How many cards are visible at once, per breakpoint - matches Tailwind's
// sm (640px) / lg (1024px) so the carousel lines up with how the rest of
// the site reflows.
function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(3); // default matches SSR/first paint, corrected on mount

  const [trackIndex, setTrackIndex] = useState(visible);
  const [isSliding, setIsSliding] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    api
      .get("/courses?featured=true&limit=20")
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Track viewport width and update how many cards are visible.
  useEffect(() => {
    const updateVisible = () => setVisible(getVisibleCount());
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const total = courses.length;
  const canSlide = total > visible;

  // Reset the track whenever the course count OR the visible count
  // changes (window resized across a breakpoint) - both change the
  // cloned-padding math below, so the track position must realign.
  useEffect(() => {
    setEnableTransition(false);
    setTrackIndex(canSlide ? visible : 0);
    requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)));
  }, [canSlide, total, visible]);

  const trackCourses = useMemo(() => {
    if (!canSlide) return courses;
    // [ ...last `visible` cloned, ...all real courses, ...first `visible` cloned ]
    return [...courses.slice(-visible), ...courses, ...courses.slice(0, visible)];
  }, [courses, canSlide, visible]);

  // "Real" index (0..total-1), derived from trackIndex - this is what
  // the dots should highlight/paginate against.
  const activeIndex = canSlide ? (((trackIndex - visible) % total) + total) % total : 0;

  // Auto-play: advance one card every 4 seconds. Pauses whenever the
  // mouse is over the carousel, and stops entirely if there aren't
  // enough courses to slide.
  useEffect(() => {
    if (!canSlide || isPaused) return;
    const timer = setInterval(() => {
      slide(1);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSlide, isPaused]);

  const slide = (direction) => {
    if (isSliding) return; // ignore clicks mid-animation so trackIndex never overshoots the cloned padding
    setIsSliding(true);
    setTrackIndex((prev) => prev + direction);
  };

  // Dots jump straight to a real index - no wraparound needed since
  // every real index already sits inside the safe (non-cloned) range.
  const goToIndex = (realIndex) => {
    if (isSliding) return;
    setIsSliding(true);
    setTrackIndex(visible + realIndex);
  };

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;

    const coreStart = visible;
    const coreEnd = visible + total - 1;

    if (trackIndex < coreStart || trackIndex > coreEnd) {
      // Snapped into cloned padding - jump back to the equivalent real
      // position with the transition disabled so it's invisible.
      const real = (((trackIndex - coreStart) % total) + total) % total;
      setEnableTransition(false);
      setTrackIndex(coreStart + real);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setIsSliding(false);
        });
      });
    } else {
      setIsSliding(false);
    }
  };

  // One dot per course (not per "window position") - simpler to reason
  // about, and matches what's expected: 7 courses = 7 dots, 20 courses =
  // 20 dots (paginated below), etc.
  const totalDots = total;
  const dotBlock = Math.floor(activeIndex / DOTS_PER_PAGE);
  const dotStart = dotBlock * DOTS_PER_PAGE;
  const dotEnd = Math.min(dotStart + DOTS_PER_PAGE, totalDots);
  const visibleDotIndexes = Array.from({ length: dotEnd - dotStart }, (_, i) => dotStart + i);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Popular courses</h2>
        <Link href="/courses" className="text-sm text-purple hover:text-pink transition">
          View all →
        </Link>
      </div>

      {loading ? (
        <CourseGridSkeleton count={3} />
      ) : total === 0 ? (
        <p className="text-text-muted">No published courses yet. Check back soon.</p>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {canSlide && (
            <>
              <button
                onClick={() => slide(-1)}
                aria-label="Previous course"
                className="absolute -left-2 sm:-left-4 top-1/3 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-purple/50 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => slide(1)}
                aria-label="Next course"
                className="absolute -right-2 sm:-right-4 top-1/3 -translate-y-1/2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-purple/50 transition"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Track - padded with cloned cards front/back so it can
              always slide by exactly one card's width without ever
              running short of cards to show. */}
          <div className="overflow-hidden">
            <div
              className={`flex ${enableTransition ? "transition-transform duration-400 ease-out" : ""}`}
              style={{ transform: `translateX(-${trackIndex * (100 / visible)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {trackCourses.map((course, i) => (
                <div key={`${course._id}-${i}`} style={{ flex: `0 0 ${100 / visible}%` }} className="px-2 sm:px-3">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>

          {/* Numbered dots, paginated in blocks of 10 */}
          {canSlide && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
              {visibleDotIndexes.map((i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  aria-label={`Go to course ${i + 1}`}
                  className={`h-6 w-6 rounded-full text-[11px] font-medium flex items-center justify-center transition ${
                    i === activeIndex
                      ? "text-white"
                      : "text-text-faint border border-border hover:border-purple/50"
                  }`}
                  style={
                    i === activeIndex
                      ? { backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)" }
                      : {}
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}