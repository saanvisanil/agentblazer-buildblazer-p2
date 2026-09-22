export function isEventRegistrationOpen(event) {
  if (!event || typeof event !== "object") return false;
  const isUpcoming = event.status === "upcoming" || !event.status;
  if (!isUpcoming || event.registrationOpen !== true) return false;
  if (!event.date) return true;
  return new Date(`${event.date}T23:59:59`) >= new Date();
}
