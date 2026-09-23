import ReviewCard from "./ReviewCard";

// A single vertically-scrolling column of testimonial cards. The list is
// rendered twice back-to-back and animated by exactly -50% so the loop
// is seamless regardless of the cards' actual rendered height - this
// works the same whether there are 2 reviews or 50, no clone-padding
// tricks needed (unlike a fixed-width horizontal carousel).
//
// The animation duration scales with how many cards are in the column
// (~5s per card, 10s minimum) so the scroll speed stays visually
// consistent as the review count grows - without this, a column with a
// lot more cards than another would visibly whip past much faster for
// covering the same -50% in a fixed duration.
export default function ReviewMarqueeColumn({ stories, reverse = false, className = "" }) {
  const durationSeconds = Math.max(stories.length * 5, 10);

  return (
    <div className={`h-[600px] overflow-hidden marquee-fade-mask ${className}`}>
      <div
        className={reverse ? "animate-marquee-vertical-reverse" : "animate-marquee-vertical"}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {stories.map((s, i) => (
          <ReviewCard key={`a-${s._id || i}`} story={s} />
        ))}
        {stories.map((s, i) => (
          <ReviewCard key={`b-${s._id || i}`} story={s} />
        ))}
      </div>
    </div>
  );
}