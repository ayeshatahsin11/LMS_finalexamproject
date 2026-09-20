import ReviewCard from "./ReviewCard";

// A single vertically-scrolling column of testimonial cards. The list is
// rendered twice back-to-back and animated by exactly -50% so the loop
// is seamless regardless of the cards' actual rendered height.
export default function ReviewMarqueeColumn({ stories, reverse = false, className = "" }) {
  return (
    <div className={`h-[600px] overflow-hidden marquee-fade-mask ${className}`}>
      <div className={reverse ? "animate-marquee-vertical-reverse" : "animate-marquee-vertical"}>
        {stories.map((s, i) => (
          <ReviewCard key={`a-${i}`} story={s} />
        ))}
        {stories.map((s, i) => (
          <ReviewCard key={`b-${i}`} story={s} />
        ))}
      </div>
    </div>
  );
}