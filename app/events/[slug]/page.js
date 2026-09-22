import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventActions from "@/components/EventActions";
import { formatDate, getLiveEvents } from "@/lib/content";
import { displayImageUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function EventDetailsPage({ params }) {
  const { slug } = await params;
  const events = await getLiveEvents();
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();
  const images = event.images?.length ? event.images : ["/images/events/placeholder.svg"];
  return <section className="mx-auto w-full max-w-4xl px-5 py-14">
    <Link href="/events" className="text-sm text-accent hover:underline">← All events</Link>
    <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">{event.tag}</p>
    <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{event.title}</h1>
    <p className="mt-2 text-sm text-muted">{formatDate(event.date)}</p>
    <EventActions event={event} />
    <div className="mt-8 grid gap-4 sm:grid-cols-2">{images.map((image, index) => <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface"><Image src={displayImageUrl(image)} alt={`${event.title} photo ${index + 1}`} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" /></div>)}</div>
    <article className="mt-8 rounded-card border border-line bg-surface p-6"><h2 className="font-display text-2xl font-semibold">About this event</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{event.details || event.summary}</p>{event.reportUrl ? <a href={event.reportUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-card border border-line px-4 py-2 text-sm text-accent hover:bg-surface-2">Open event report →</a> : null}</article>
  </section>;
}
