import { BookOpen, GraduationCap, Briefcase } from "lucide-react";

const STEPS = [
  {
    icon: BookOpen,
    title: "01. Learn",
    desc: "Pick a course, watch lessons at your own pace, and build real skills step by step.",
  },
  {
    icon: GraduationCap,
    title: "02. Practice & track",
    desc: "Complete lessons, track your progress, and see exactly how far you've come.",
  },
  {
    icon: Briefcase,
    title: "03. Apply it",
    desc: "Finish strong with skills you can actually use — at work, in projects, anywhere.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo/10 via-purple/10 to-pink/10" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl">
            Why learn with <span className="gradient-text">Pathway</span>?
          </h2>
          <p className="text-text-muted mt-2">A simple loop that actually gets you to the finish line.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 rounded-xl flex items-center justify-center gradient-border">
                  <div className="h-full w-full flex items-center justify-center">
                    <Icon size={24} className="text-purple" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-text">{step.title}</h3>
                <p className="text-sm text-text-muted max-w-xs">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}