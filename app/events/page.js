import Eyebrow from "@/components/Eyebrow";
import GalleryCard from "@/components/GalleryCard";
import { getSite, getEvents, formatDate } from "@/lib/content";

export const metadata = {
  title: "Events & Workshops",
  description: "Workshops, contests and masterclasses run by the AgentBlazer Club.",
};

export default function EventsPage() {
  const site = getSite();
  const config = site.events;
  const events = getEvents();

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pb-4 pt-14 text-center">
        <Eyebrow>{config.eyebrow}</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Workshops, Contests <span className="gradient-text italic">& Masterclasses</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{config.lead}</p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <GalleryCard key={event.slug} event={event} formattedDate={formatDate(event.date)} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="rounded-card border border-line bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {config.curriculum.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold">{config.curriculum.title}</h2>
          <p className="mt-1 text-sm text-muted">{config.curriculum.lead}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {config.curriculum.items.map((item) => (
              <div key={item.tag} className="rounded-card border border-line bg-bg-soft p-4">
                <p className="text-xs font-medium text-accent">{item.tag}</p>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
