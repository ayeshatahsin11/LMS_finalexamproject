// Base shimmer block. Compose with Tailwind width/height classes to
// match whatever shape of content is loading.
export default function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}