import { notFound } from "next/navigation";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import { formatDate, getLiveEvents } from "@/lib/content";
import { isEventRegistrationOpen } from "@/lib/eventAccess";

export const dynamic = "force-dynamic";

export default async function EventRegistrationPage({ params }) {
  const { slug } = await params;
  const events = await getLiveEvents();
  const event = events.find((item) => item.slug === slug && isEventRegistrationOpen(item));
  if (!event) notFound();
  return <section className="mx-auto w-full max-w-xl px-5 py-14"><p className="text-xs font-semibold uppercase tracking-wider text-accent">Event registration</p><h1 className="mt-3 font-display text-3xl font-semibold">{event.title}</h1><p className="mt-2 text-sm text-muted">{formatDate(event.date)} · {event.tag}</p><p className="mt-4 text-sm leading-6 text-muted">{event.summary}</p><div className="mt-7 rounded-card border border-line bg-surface p-6"><h2 className="font-display text-xl font-semibold">Reserve your place</h2><p className="mt-1 text-sm text-muted">Use your college email so the event team can reach you.</p><EventRegistrationForm event={event} /></div></section>;
}
