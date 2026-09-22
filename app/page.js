import Image from "next/image";
import Button from "@/components/Button";
import StatCard from "@/components/StatCard";
import { getSite } from "@/lib/content";
import IntroSequence from "@/components/IntroSequence";
import AnnouncementFeed from "@/components/AnnouncementFeed";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const site = getSite();

  return (
    <section className="starfield relative min-h-[calc(100vh-80px)] overflow-x-clip">
      <IntroSequence />
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        
        {/* =========================
            LEFT — HERO CONTENT
           ========================= */}
        <div className="relative z-20">
          <h1 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.3rem] xl:text-[3.6rem]">
            Pioneering Autonomous{" "}
            <br className="hidden sm:inline" />
            <span className="gradient-text pb-1 font-medium italic">
              &amp; Agentic AI Systems
            </span>
          </h1>

          <p className="mt-4 font-display text-sm italic text-muted">
            {site.department} &middot; {site.college}
          </p>

          <p className="mt-4 max-w-prose text-muted">
            {site.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/events">
              Explore Workshops & Events &rarr;
            </Button>

            <Button href="/about" variant="secondary">
              Read Club Charter
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {site.stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* =========================
            RIGHT — AGENTBLAZER CORE
           ========================= */}
        <div className="relative flex min-h-[500px] items-center justify-center">
          
          {/* Large ambient glow */}
          <div
            className="pointer-events-none absolute h-[390px] w-[390px] rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(34,211,238,0.08) 38%, transparent 70%)",
              filter: "blur(18px)",
              animation: "hero-core-pulse 4s ease-in-out infinite",
            }}
          />

          {/* Outer rotating ring */}
          <div
            className="absolute h-[390px] w-[390px] rounded-full border border-violet-400/20"
            style={{
              animation: "hero-ring-spin 18s linear infinite",
            }}
          >
            <span className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />

            <span className="absolute bottom-[-4px] left-[18%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,1)]" />
          </div>

          {/* Second rotating ring */}
          <div
            className="absolute h-[330px] w-[330px] rounded-full border border-cyan-300/15"
            style={{
              animation: "hero-ring-reverse 12s linear infinite",
            }}
          >
            <span className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />
          </div>

          {/* Circuit-style orbit lines */}
          <div className="absolute h-[350px] w-[350px] rounded-full border border-dashed border-violet-400/10" />

          {/* Main logo frame */}
          <div
            className="relative z-10 flex h-[290px] w-[290px] items-center justify-center rounded-[32%] border border-violet-400/40 bg-[#080a16]/70 backdrop-blur-xl sm:h-[330px] sm:w-[330px]"
            style={{
              boxShadow:
                "0 0 35px rgba(139,92,246,0.25), 0 0 100px rgba(139,92,246,0.16), inset 0 0 45px rgba(34,211,238,0.06)",
              animation: "hero-logo-float 5s ease-in-out infinite",
            }}
          >
            {/* Inner frame */}
            <div
              className="absolute inset-5 rounded-[28%] border border-cyan-300/15"
              style={{
                boxShadow:
                  "inset 0 0 30px rgba(34,211,238,0.06)",
              }}
            />

            {/* Logo */}
            <Image
              src="/images/brand/logo-transparent.png"
              alt="AgentBlazer Club emblem"
              width={270}
              height={270}
              className="relative z-10 object-contain drop-shadow-[0_0_25px_rgba(139,92,246,0.55)]"
              priority
            />

            {/* Top light */}
            <div className="pointer-events-none absolute inset-x-10 top-3 h-16 rounded-full bg-violet-400/10 blur-2xl" />

            {/* Bottom light */}
            <div className="pointer-events-none absolute inset-x-12 bottom-3 h-12 rounded-full bg-cyan-400/10 blur-2xl" />
          </div>

          {/* Floating particles */}
          <span
            className="absolute left-[10%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]"
            style={{
              animation: "hero-particle-one 4s ease-in-out infinite",
            }}
          />

          <span
            className="absolute right-[10%] top-[32%] h-1 w-1 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(139,92,246,1)]"
            style={{
              animation: "hero-particle-two 5s ease-in-out infinite",
            }}
          />

          <span
            className="absolute bottom-[22%] left-[17%] h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)]"
            style={{
              animation: "hero-particle-three 4.5s ease-in-out infinite",
            }}
          />

          {/* Club name */}
          <div className="absolute bottom-[-5px] z-20 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight">
              {site.shortName}
              <span className="gradient-text"> Club</span>
            </p>

            <div className="mx-auto mt-2 h-px w-20 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
          </div>
        </div>
      </div>
      <AnnouncementFeed />
    </section>
  );
}
