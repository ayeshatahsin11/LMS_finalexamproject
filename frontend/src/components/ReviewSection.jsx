import Link from "next/link";
import { Star, Quote } from "lucide-react";

const STORIES = [
  {
    name: "Farhana Rahman",
    role: "Switched careers into web development",
    course: "Complete Web Development Bootcamp",
    quote:
      "I went from zero coding experience to landing a junior developer role in four months. The progress tracker kept me honest on the days I wanted to quit.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Freelance graphic designer",
    course: "Graphic Design Fundamentals",
    quote:
      "The lessons were short enough to fit into a lunch break but detailed enough that I actually built a real portfolio by the end.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Marketing coordinator",
    course: "Digital Marketing 2024",
    quote:
      "Free previews let me check the teaching style before committing. Ended up finishing the whole course in two weeks.",
    rating: 4,
  },
  {
    name: "Rafi Islam",
    role: "Computer science student",
    course: "IT and Software basics",
    quote:
      "Being able to see exactly how much of the course I'd completed made a huge difference. I finally finished something instead of abandoning it halfway.",
    rating: 5,
  },
  {
    name: "Ayesha Tahsin",
    role: "Self-taught developer",
    course: "MERN Stack Fundamentals",
    quote:
      "Clear lessons, no fluff. The instructor actually responded to questions and updated content based on feedback.",
    rating: 5,
  },
  {
    name: "Sabbir Hossain",
    role: "Small business owner",
    course: "Personal Development for Entrepreneurs",
    quote:
      "Not just theory - every lesson had something I could apply to my business the same day.",
    rating: 4,
  },
];

export default function ReviewsSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="inline-block text-xs font-medium tracking-wide uppercase text-pink px-3 py-1 rounded-full border border-pink/30 bg-pink/5 mb-4">
          Success stories
        </span>
        <h1 className="text-4xl leading-tight mb-3">
          What our <span className="gradient-text">students</span> say
        </h1>
        <p className="text-text-muted text-lg">
          Real people, real courses, real progress. Here's what learning on Pathway looks like.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {STORIES.map((s, i) => (
          <div key={i} className="card p-6 flex flex-col gap-4">
            <Quote size={22} className="text-purple/50" />
            <p className="text-sm text-text-muted flex-1">"{s.quote}"</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  className={idx < s.rating ? "text-amber-400 fill-amber-400" : "text-border"}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo via-purple to-pink flex items-center justify-center text-white font-serif text-sm shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text truncate">{s.name}</p>
                <p className="text-xs text-text-faint truncate">{s.role}</p>
              </div>
            </div>
            <p className="text-xs text-purple">{s.course}</p>
          </div>
        ))}
      </div>

      <div className="card p-10 text-center">
        <h2 className="text-2xl mb-2">Ready to write your own success story?</h2>
        <p className="text-text-muted mb-6">Join and start your first course today.</p>
        <Link href="/courses" className="btn-primary">
          Browse courses
        </Link>
      </div>
    </div>
  );
}