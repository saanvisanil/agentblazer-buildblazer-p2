import Eyebrow from "@/components/Eyebrow";
import AchievementTimeline from "@/components/AchievementTimeline";
import { getLiveAchievements } from "@/lib/content";

export const metadata = {
  title: "Achievements & Timeline",
  description: "Key milestones, inaugural keynotes, and technical achievements of AgentBlazer Club.",
};

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const achievements = await getLiveAchievements();

  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-5 pb-4 pt-14 text-center">
        <Eyebrow>OUR JOURNEY & MILESTONES</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Building the Future <span className="gradient-text italic">Step by Step</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Explore key milestones, inaugural technical sessions, hackathon achievements, and student-led initiatives.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-16">
        <AchievementTimeline achievements={achievements} />
      </section>
    </>
  );
}
