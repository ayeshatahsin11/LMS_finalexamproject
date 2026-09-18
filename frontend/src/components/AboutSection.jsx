import { Target, Heart, Users, Zap } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Outcome-focused",
    desc: "Every course is built around one question: will this actually help you do something you couldn't before?",
  },
  {
    icon: Heart,
    title: "Built for learners",
    desc: "Progress tracking, free previews, and a clean player experience - because finishing a course matters more than starting one.",
  },
  {
    icon: Users,
    title: "Instructor-first tools",
    desc: "Publishing, managing lessons, and seeing student progress should take minutes, not a manual.",
  },
  {
    icon: Zap,
    title: "Fast, no clutter",
    desc: "No bloated dashboards. Just courses, lessons, and progress - the things that actually move you forward.",
  },
];

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-14 max-w-2xl">
        <span className="inline-block text-xs font-medium tracking-wide uppercase text-pink px-3 py-1 rounded-full border border-pink/30 bg-pink/5 mb-4">
          Our story
        </span>
        <h1 className="text-4xl leading-tight mb-4">
          Learning shouldn't feel like <span className="gradient-text">homework.</span>
        </h1>
        <p className="text-text-muted text-lg">
          Pathway started as a simple idea: most people don't quit a course because the
          content is bad - they quit because there's no clear path, no sense of progress,
          and no reason to come back tomorrow. We built a platform that fixes exactly that.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {VALUES.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} className="card p-6 flex flex-col gap-3">
              <div className="h-11 w-11 rounded-lg bg-purple/15 flex items-center justify-center">
                <Icon size={20} className="text-purple" />
              </div>
              <h3 className="font-serif text-lg text-text">{v.title}</h3>
              <p className="text-sm text-text-muted">{v.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center mb-16">
        <div>
          <p className="text-3xl font-serif gradient-text">6+</p>
          <p className="text-xs text-text-faint mt-1">Course categories</p>
        </div>
        <div>
          <p className="text-3xl font-serif gradient-text">100%</p>
          <p className="text-xs text-text-faint mt-1">Progress tracked</p>
        </div>
        <div>
          <p className="text-3xl font-serif gradient-text">24/7</p>
          <p className="text-xs text-text-faint mt-1">Learn at your pace</p>
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl mb-3">Built by learners, for learners</h2>
        <p className="text-text-muted text-sm">
          We're a small team obsessed with the details that make a course actually get
          finished - clear lessons, honest progress bars, and instructors who can focus on
          teaching instead of fighting a dashboard.
        </p>
      </div>
    </div>
  );
}