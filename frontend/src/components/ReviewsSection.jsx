import Link from "next/link";
import ReviewMarqueeColumn from "./ReviewMarqueeColumn";

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

// Split into 3 columns (2 stories each) - each column scrolls a
// different direction for a livelier "wall of testimonials" effect.
const COLUMN_1 = [STORIES[0], STORIES[1]];
const COLUMN_2 = [STORIES[2], STORIES[3]];
const COLUMN_3 = [STORIES[4], STORIES[5]];

export default function ReviewsSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
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
        <ReviewMarqueeColumn stories={COLUMN_1} reverse={false} />
        <ReviewMarqueeColumn stories={COLUMN_2} reverse={true} className="hidden sm:block" />
        <ReviewMarqueeColumn stories={COLUMN_3} reverse={false} className="hidden lg:block" />
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