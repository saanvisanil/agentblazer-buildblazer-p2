"use client";

import Link from "next/link";
import { useState } from "react";

export default function EventActions({ event }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/events/${event.slug}/register`;
    const shareData = { title: event.title, text: `Join ${event.title} with AgentBlazer.`, url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch (error) {
      if (error?.name !== "AbortError") console.error("Could not share event", error);
    }
  }

  const registrationOpen = event.status === "upcoming" && event.registrationOpen === true;
  return <div className="mt-5 flex flex-wrap gap-2">
    {registrationOpen ? <Link href={`/events/${event.slug}/register`} className="rounded-card px-3.5 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90" style={{ background: "var(--gradient)" }}>Register Now →</Link> : null}
    <button type="button" onClick={share} className="rounded-card border border-line px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-ink">{copied ? "Link copied" : "Share event"}</button>
  </div>;
}
