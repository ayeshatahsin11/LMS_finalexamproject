"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// Generic breadcrumb trail. Pass an ordered array of { label, href }.
// The last item is rendered as plain text (current page, not clickable).
// Usage:
//   <Breadcrumbs items={[
//     { label: "Courses", href: "/courses" },
//     { label: "Digital Marketing", href: "/courses?category=Digital Marketing" },
//     { label: "Intro to SEO" }, // current page - no href
//   ]} />
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-faint">
        <li className="flex items-center gap-1.5">
          <Link href="/" className="flex items-center gap-1 hover:text-text transition">
            <Home size={14} />
            Home
          </Link>
        </li>

        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-text-faint/60" />
              {isLast || !item.href ? (
                <span className="text-text truncate max-w-[220px]">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-text transition truncate max-w-[220px]">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}