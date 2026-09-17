import { BookOpen, GraduationCap, PenTool, Lightbulb, NotebookText } from "lucide-react";

const FLOATING_ICONS = [
  { Icon: BookOpen, color: "#818CF8", style: { top: "12%", left: "22%" }, delay: "0s" },
  { Icon: GraduationCap, color: "#F472B6", style: { top: "18%", right: "18%" }, delay: "0.4s" },
  { Icon: PenTool, color: "#C084FC", style: { bottom: "22%", left: "18%" }, delay: "0.8s" },
  { Icon: Lightbulb, color: "#FBBF24", style: { bottom: "16%", right: "22%" }, delay: "1.2s" },
  { Icon: NotebookText, color: "#34D399", style: { top: "48%", left: "8%" }, delay: "0.6s" },
];

// A full "page-level" loading state - used where nothing meaningful can
// render until data arrives (a single course/lesson/profile), as opposed
// to skeletons, which are used where the layout shape is already known
// (grids, lists) and we can show placeholders in that exact shape.
export default function LoadingScreen({ label = "Loading" }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 min-h-[50vh] overflow-hidden">
      {FLOATING_ICONS.map(({ Icon, color, style, delay }, i) => (
        <div
          key={i}
          className="absolute animate-float hidden sm:block"
          style={{ ...style, color, animationDelay: delay }}
        >
          <Icon size={30} strokeWidth={1.75} />
        </div>
      ))}

      <div className="gradient-border h-16 w-16 relative z-10 mb-5">
        <div className="h-full w-full flex items-center justify-center text-2xl">📚</div>
      </div>

      <p className="text-text font-serif text-lg relative z-10">
        {label}
        <span className="inline-flex ml-1">
          <span className="animate-bounce-dot" style={{ animationDelay: "0s" }}>.</span>
          <span className="animate-bounce-dot" style={{ animationDelay: "0.15s" }}>.</span>
          <span className="animate-bounce-dot" style={{ animationDelay: "0.3s" }}>.</span>
        </span>
      </p>
    </div>
  );
}