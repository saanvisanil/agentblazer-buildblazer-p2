export function normalizeEventForSave(event, index = 0) {
  const title = (event?.title || "").trim();
  const slugSource = (event?.slug || title || `event-${index + 1}`).trim();
  const slug = slugSource
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `event-${index + 1}`;
  const date = (event?.date || "").trim();
  const nextDate = date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    ...event,
    title: title || "Untitled event",
    slug,
    date: nextDate,
    status: event?.status === "past" ? "past" : "upcoming",
    registrationOpen: Boolean(event?.registrationOpen),
  };
}
