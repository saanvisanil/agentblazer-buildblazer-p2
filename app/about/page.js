import Eyebrow from "@/components/Eyebrow";
import TeamCard from "@/components/TeamCard";
import { getSite, getTeamByGroup } from "@/lib/content";

export const metadata = {
  title: "About Us",
  description: "How the AgentBlazer Club started, its leadership, and its student core team.",
};

export default function AboutPage() {
  const site = getSite();
  const about = site.about;
  const guests = getTeamByGroup("guest");
  const faculty = getTeamByGroup("faculty");
  const officers = getTeamByGroup("officer");
  const committee = getTeamByGroup("committee");

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 py-14">
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Inauguration & <span className="gradient-text italic">{about.titleEmphasis}</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">{about.lead}</p>

        <div className="mt-8 grid gap-6 rounded-card border border-line bg-surface p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
              {about.launch.tag}
            </span>
            <h2 className="mt-3 font-display text-xl font-semibold">
              {about.launch.title.replace(about.launch.titleEmphasis, "")}
              <span className="gradient-text italic">{about.launch.titleEmphasis}</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{about.launch.body}</p>
          </div>
          <div className="rounded-card border border-line bg-bg-soft p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-accent">Inaugurated On</p>
            <p className="mt-1 font-display text-xl font-semibold italic">{about.launch.date}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {about.launch.meta.map((m) => (
                <span key={m} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <h2 className="font-display text-2xl font-semibold">
          Honored Guests <span className="italic text-muted">& College Leadership</span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guests.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="border-l-2 border-accent pl-3 font-display text-lg font-semibold">
            Faculty Advisory Council
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {faculty.map((m) => (
              <TeamCard key={m.name} member={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="flex items-baseline justify-between">
          <h2 className="border-l-2 border-accent pl-3 font-display text-lg font-semibold">
            Student Core Team <span className="italic text-muted">& Officers</span>
          </h2>
          <span className="text-xs text-muted">Academic Year 2025-2026</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officers.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Core Working Committee
          </p>
          <span className="text-xs text-muted">Departmental Representatives</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {committee.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </section>
    </>
  );
}
