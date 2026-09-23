import { Star, Quote } from "lucide-react";

export default function ReviewCard({ story }) {
  return (
    <div className="card p-6 flex flex-col gap-4 mb-6">
      <Quote size={22} className="text-purple/50" />
      <p className="text-sm text-text-muted flex-1">&quot;{story.quote}&quot;</p>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={14}
            className={idx < story.rating ? "text-amber-400 fill-amber-400" : "text-border"}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo via-purple to-pink flex items-center justify-center text-white font-serif text-sm shrink-0">
          {story.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text truncate">{story.name}</p>
          <p className="text-xs text-text-faint truncate">{story.role}</p>
        </div>
      </div>
    </div>
  );
}