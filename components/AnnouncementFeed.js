import Link from "next/link";
import { getLiveAnnouncements, formatDate } from "@/lib/content";

export default async function AnnouncementFeed() {
  const announcements = (await getLiveAnnouncements()).slice(0, 3);
  if (!announcements.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-8" aria-label="Latest announcements">
      <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Live updates</p>
            <h2 className="mt-1 font-display text-xl font-semibold">Announcements</h2>
          </div>
          <Link href="/announcements" className="text-sm text-accent hover:underline">View all updates →</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-card border border-line bg-bg-soft p-4">
              <p className="text-xs text-accent">{formatDate(announcement.date)}</p>
              <h3 className="mt-1 font-medium">{announcement.title}</h3>
              <p className="mt-2 text-sm text-muted">{announcement.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
