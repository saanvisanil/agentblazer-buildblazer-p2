export function displayImageUrl(source) {
  if (!source || typeof source !== "string") return "/images/events/placeholder.svg";
  if (source.includes("placeholder") || source.endsWith(".svg")) return source;
  return source.startsWith("/images/")
    ? `/api/public-image?src=${encodeURIComponent(source)}`
    : source;
}
