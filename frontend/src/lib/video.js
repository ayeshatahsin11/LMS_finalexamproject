// YouTube links need an <iframe> embed; anything else is treated as a
// direct video file URL and played with a native <video> tag.
export function getYoutubeEmbedUrl(url) {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}