import Eyebrow from "@/components/Eyebrow";
import { formatDate, getLiveAnnouncements } from "@/lib/content";

export const metadata = { title: "Announcements", description: "Latest updates from AgentBlazer Club." };

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const announcements = await getLiveAnnouncements();
  return <section className="mx-auto w-full max-w-4xl px-5 py-14">
    <Eyebrow>Club news & updates</Eyebrow>
    <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Announcements</h1>
    <div className="mt-8 grid gap-4">
      {announcements.map((announcement) => <article key={announcement.id} className="rounded-card border border-line bg-surface p-5">
        <p className="text-xs text-accent">{formatDate(announcement.date)}</p>
        <h2 className="mt-2 font-display text-xl font-semibold">{announcement.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{announcement.body}</p>
      </article>)}
    </div>
  </section>;
}
