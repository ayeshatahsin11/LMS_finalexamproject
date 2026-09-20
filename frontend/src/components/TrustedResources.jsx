"use client";

const RESOURCES = [
  { name: "MDN Web Docs", href: "https://developer.mozilla.org", logo: null },
  { name: "freeCodeCamp", href: "https://www.freecodecamp.org", logo: null },
  { name: "GitHub", href: "https://github.com", logo: null },
  { name: "Stack Overflow", href: "https://stackoverflow.com", logo: null },
  { name: "W3Schools", href: "https://www.w3schools.com", logo: null },
  { name: "MongoDB", href: "https://www.mongodb.com", logo: null },
  { name: "React", href: "https://react.dev", logo: null },
  { name: "Node.js", href: "https://nodejs.org", logo: null },
  { name: "Next.js", href: "https://nextjs.org", logo: null },
  { name: "Tailwind CSS", href: "https://tailwindcss.com", logo: null },
  { name: "Coursera", href: "https://www.coursera.org", logo: null },
  { name: "MIT OpenCourseWare", href: "https://ocw.mit.edu", logo: null },
];

function ResourceItem({ resource }) {
  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 shrink-0 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition mx-2.5"
    >
      {resource.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resource.logo} alt={resource.name} className="h-5 w-5 object-contain" />
      ) : (
        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo via-purple to-pink shrink-0" />
      )}
      <span className="text-sm font-medium text-white whitespace-nowrap">{resource.name}</span>
    </a>
  );
}

export default function TrustedResources() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Lighter gradient strip to set this section apart from the dark page background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo/40 via-purple/35 to-pink/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-10 text-center">
        <span className="inline-block text-xs font-medium tracking-wide uppercase text-white/70 px-3 py-1 rounded-full border border-white/20 mb-4">
          Recommended resources
        </span>
        <h2 className="text-2xl md:text-3xl text-white">
          Enhance your learning alongside our guidance
        </h2>
        <p className="text-white/70 mt-2 max-w-lg mx-auto">
          The best courses are backed by great references. Here are a few we point our own students to.
        </p>
      </div>

      {/* Marquee row - the list is duplicated so the loop is seamless */}
      <div className="relative z-10 flex overflow-hidden">
        <div className="flex animate-marquee">
          {RESOURCES.map((r, i) => (
            <ResourceItem key={`a-${i}`} resource={r} />
          ))}
          {RESOURCES.map((r, i) => (
            <ResourceItem key={`b-${i}`} resource={r} />
          ))}
        </div>
      </div>
    </section>
  );
}