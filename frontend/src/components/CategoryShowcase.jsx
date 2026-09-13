"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Code2, Palette, TrendingUp, Cpu, Brush } from "lucide-react";
import api from "@/lib/axios";

const CATEGORY_META = {
  "Digital Marketing": { icon: Megaphone, color: "#EC4899" },
  "Web Development": { icon: Code2, color: "#6366F1" },
  "Art & Humanities": { icon: Brush, color: "#A855F7" },
  "Personal Development": { icon: TrendingUp, color: "#F59E0B" },
  "IT and Software": { icon: Cpu, color: "#34D399" },
  "Graphic Design": { icon: Palette, color: "#F472B6" },
};

const CATEGORIES = Object.keys(CATEGORY_META);

export default function CategoryShowcase() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Lightweight approach: pull a decent batch of published courses and
    // tally them per category client-side, rather than adding a whole new
    // backend aggregate endpoint just for a homepage count.
    api
      .get("/courses", { params: { limit: 100 } })
      .then((res) => {
        const tally = {};
        (res.data.courses || []).forEach((c) => {
          tally[c.category] = (tally[c.category] || 0) + 1;
        });
        setCounts(tally);
      })
      .catch(() => setCounts({}));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl">
          Top <span className="gradient-text">categories</span>
        </h2>
        <p className="text-text-muted mt-2">Pick a path and start learning today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          return (
            <Link
              key={cat}
              href={`/courses?category=${encodeURIComponent(cat)}`}
              className="card card-hover p-5 flex flex-col gap-3"
            >
              <div
                className="h-11 w-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${meta.color}22` }}
              >
                <Icon size={20} color={meta.color} />
              </div>
              <div>
                <h3 className="font-serif text-base text-text">{cat}</h3>
                <p className="text-xs text-text-faint mt-0.5">
                  {counts[cat] || 0} course{counts[cat] === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}