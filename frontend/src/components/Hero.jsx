"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { getYoutubeEmbedUrl } from "@/lib/video";

// Default hero content - shown until an admin activates a custom banner
// from /admin/banners, and used as a safe fallback if that request
// fails. This keeps the homepage looking right even with zero setup.
const DEFAULT_BANNER = {
  badge: "Learn without limits",
  title: "Build real skills,",
  highlight: "one lesson at a time.",
  description:
    "Pathway connects instructors and students in one place — courses, video lessons, and progress tracking that actually keeps you moving forward.",
  mediaType: "none",
  mediaUrl: "",
  primaryButtonText: "Browse courses",
  primaryButtonLink: "/courses",
  secondaryButtonText: "Become an instructor",
  secondaryButtonLink: "/register",
};

const AUTOPLAY_MS = 4000;

export default function Hero() {
  const [banners, setBanners] = useState([DEFAULT_BANNER]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api
      .get("/banners/active")
      .then((res) => {
        if (res.data.banners?.length) setBanners(res.data.banners);
      })
      .catch(() => {
        // No active banners (or the request failed) - the default set
        // above already covers this, nothing else to do.
      });
  }, []);

  const canSlide = banners.length > 1;

  // Auto-play: advance to the next banner every few seconds. Pauses
  // whenever the mouse is over the hero, and does nothing at all if
  // there's only one banner to show.
  useEffect(() => {
    if (!canSlide || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [canSlide, isPaused, banners.length]);

  // Clamp in case the banner list shrinks (e.g. re-fetch) while a later
  // index was active.
  const banner = banners[current] || banners[0];

  const youtubeUrl = banner.mediaType === "video" ? getYoutubeEmbedUrl(banner.mediaUrl) : null;

  return (
    <section
      className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* `key` remounts this block on every banner change, replaying the
          existing fade-in-up animation as a lightweight crossfade -
          no extra CSS needed, reuses what's already in globals.css. */}
      <div key={current} className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
        <div className="relative z-10">
          {banner.badge && (
            <span className="inline-block text-xs font-medium tracking-wide uppercase text-pink px-3 py-1 rounded-full border border-pink/30 bg-pink/5">
              {banner.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl leading-tight mt-4">
            {banner.title}
            {banner.highlight && (
              <>
                <br />
                <span className="gradient-text">{banner.highlight}</span>
              </>
            )}
          </h1>
          {banner.description && (
            <p className="mt-5 text-text-muted text-lg max-w-md">{banner.description}</p>
          )}
          <div className="mt-8 flex gap-4">
            {banner.primaryButtonText && (
              <Link href={banner.primaryButtonLink || "/courses"} className="btn-primary">
                {banner.primaryButtonText}
              </Link>
            )}
            {banner.secondaryButtonText && (
              <Link href={banner.secondaryButtonLink || "/register"} className="btn-outline">
                {banner.secondaryButtonText}
              </Link>
            )}
          </div>

          {/* Slider dots - only shown when there's actually more than
              one active banner to rotate through. */}
          {canSlide && (
            <div className="flex items-center gap-2 mt-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-7 bg-purple" : "w-2 bg-border hover:bg-purple/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center justify-center relative">
          <div className="absolute w-72 h-72 rounded-full bg-purple/30 blur-3xl animate-glow" />
          <div className="absolute w-56 h-56 rounded-full bg-pink/20 blur-3xl translate-x-16 -translate-y-10 animate-glow" />

          {banner.mediaType === "image" && banner.mediaUrl ? (
            <div className="gradient-border w-full max-w-sm aspect-square relative z-10">
              <div className="w-full h-full overflow-hidden rounded-[calc(0.9rem-1px)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.mediaUrl} alt={banner.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ) : banner.mediaType === "video" && banner.mediaUrl ? (
            <div className="gradient-border w-full max-w-sm aspect-square relative z-10">
              <div className="w-full h-full overflow-hidden rounded-[calc(0.9rem-1px)] bg-black">
                {youtubeUrl ? (
                  <iframe
                    src={youtubeUrl}
                    title={banner.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={banner.mediaUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          ) : (
            <div className="gradient-border w-full max-w-sm aspect-square relative z-10">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-7xl gradient-text">P</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}