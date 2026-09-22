"use client";

import Link from "next/link";
import { useCategories } from "@/lib/useCategories";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function CategoryShowcase() {
  const { categories, loading } = useCategories();

  // Nothing to show yet (no categories created, or the request failed) -
  // rather than fabricate placeholder data, just skip the section.
  if (!loading && categories.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl">
          Top <span className="gradient-text">categories</span>
        </h2>
        <p className="text-text-muted mt-2">Pick a path and start learning today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 flex flex-col gap-3 animate-pulse">
                <div className="h-11 w-11 rounded-lg bg-surface-hover" />
                <div className="h-4 w-2/3 rounded bg-surface-hover" />
                <div className="h-3 w-1/3 rounded bg-surface-hover" />
              </div>
            ))
          : categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <Link
                  key={cat._id}
                  href={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className="card card-hover p-5 flex flex-col gap-3"
                >
                  <div
                    className="h-11 w-11 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}22` }}
                  >
                    <Icon size={20} color={cat.color} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-text">{cat.name}</h3>
                    <p className="text-xs text-text-faint mt-0.5">
                      {cat.courseCount} course{cat.courseCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}