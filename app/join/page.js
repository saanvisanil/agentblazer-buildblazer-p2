import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import JoinForm from "@/components/JoinForm";
import { getSite } from "@/lib/content";

export const metadata = {
  title: "Join & Connect",
  description: "Apply to join the AgentBlazer Club or reach the CSE department directly.",
};

export default function JoinPage() {
  const site = getSite();
  const join = site.join;

  return (
    <>
      <section className="starfield px-5 pb-10 pt-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface-2">
            <Image
              src="/images/brand/logo-transparent.png"
              alt="AgentBlazer Club emblem"
              width={44}
              height={44}
              className="object-contain"
            />
          </div>
          <div className="mt-5">
            <Eyebrow>{join.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Ready to Build with <span className="gradient-text italic">{join.titleEmphasis}</span>
          </h1>
          <p className="mt-3 text-sm text-muted">{join.body}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="#apply">Become a Member</Button>
            <Button href="#contact" variant="secondary">
              Contact CSE Department
            </Button>
          </div>
        </div>
      </section>

      <section id="apply" className="mx-auto w-full max-w-xl px-5 py-10">
        <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Membership application</h2>
          <p className="mt-1 text-sm text-muted">
            Tell us a little about yourself and a club lead will follow up before the next session.
          </p>
          <JoinForm />
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-xl px-5 pb-16">
        <div className="rounded-card border border-line bg-bg-soft p-6">
          <p className="font-display font-semibold">{site.department}</p>
          <p className="mt-1 text-sm text-muted">{site.address.line2}</p>
          <p className="text-sm text-muted">{site.address.line3}</p>
          <p className="mt-3 text-sm">
            Direct inquiries:{" "}
            <a href={`mailto:${site.email}`} className="text-accent hover:underline">
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
