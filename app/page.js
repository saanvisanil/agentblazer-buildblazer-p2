import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import StatCard from "@/components/StatCard";
import { getSite } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  return (
    <section className="starfield relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <Eyebrow>{site.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Pioneering Autonomous
            <br />
            <span className="gradient-text font-medium italic">& Agentic AI Systems</span>
          </h1>
          <p className="mt-4 font-display text-sm italic text-muted">
            {site.department} &middot; {site.college}
          </p>
          <p className="mt-4 max-w-prose text-muted">{site.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/events">Explore Workshops & Events &rarr;</Button>
            <Button href="/about" variant="secondary">
              Read Club Charter
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {site.stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex flex-col items-center">
            <div
              className="relative flex h-72 w-72 items-center justify-center rounded-[28%] border-2 border-accent sm:h-80 sm:w-80"
              style={{ boxShadow: "0 0 90px -10px var(--accent)" }}
            >
              <Image
                src="/images/brand/logo-transparent.png"
                alt="AgentBlazer Club emblem"
                width={260}
                height={260}
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-6 font-display text-2xl font-semibold">
              {site.shortName}
              <span className="gradient-text"> Club</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
