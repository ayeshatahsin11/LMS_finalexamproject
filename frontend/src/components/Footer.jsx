import Link from "next/link";
import { Facebook, Twitter, Linkedin, Github, MapPin, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Courses", href: "/courses" },
  { label: "Success stories", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand + info */}
        <div>
          <Link href="/" className="font-serif text-xl gradient-text tracking-tight">
            Pathway
          </Link>
          <p className="text-sm text-text-muted mt-3 max-w-xs">
            A learning management platform built to help students actually finish what they start.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-faint mt-4">
            <MapPin size={14} />
            Dhaka, Bangladesh
          </div>
          <div className="flex items-center gap-2 text-xs text-text-faint mt-2">
            <Mail size={14} />
            hello@pathway.dev
          </div>
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-text-faint hover:text-text hover:border-purple/50 transition"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h3 className="text-sm font-semibold text-text mb-4">Quick links</h3>
          <ul className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-text-muted hover:text-text transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Teach / Business */}
        <div>
          <h3 className="text-sm font-semibold text-text mb-4">For teams & instructors</h3>
          <p className="text-sm text-text-muted mb-4">
            Have expertise to share? Publish a course and reach students looking to learn exactly what you know.
          </p>
          <Link href="/register" className="text-sm text-purple hover:text-pink transition font-medium">
            Become an instructor →
          </Link>
          <p className="text-sm text-text-muted mt-5 mb-2">Looking to sponsor or partner with us?</p>
          <Link href="/#contact" className="text-sm text-purple hover:text-pink transition font-medium">
            Get in touch →
          </Link>
        </div>

        {/* Column 4: CTA */}
        <div>
          <h3 className="text-sm font-semibold text-text mb-4">Start learning today</h3>
          <p className="text-sm text-text-muted mb-4">
            Create a free account and enroll in your first course in minutes.
          </p>
          <Link href="/register" className="btn-primary w-full justify-center">
            Enroll now
          </Link>
          <Link href="/courses" className="btn-outline w-full justify-center mt-3">
            Browse courses
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-faint">
          <p>© {new Date().getFullYear()} Pathway. All rights reserved.</p>
          <p>Built by Ayesha Tahsin — MERN Stack Final Project</p>
        </div>
      </div>
    </footer>
  );
}