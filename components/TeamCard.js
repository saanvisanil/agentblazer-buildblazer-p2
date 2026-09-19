"use client";

import { useState } from "react";
import Image from "next/image";

// Team member card. On hover/focus it reveals a portrait, matching the
// flip-to-photo interaction in the reference video.
export default function TeamCard({ member }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-card border border-line bg-surface p-5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
    >
      {member.tag ? (
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
          {member.tag}
        </span>
      ) : null}
      <p className="mt-2 font-display font-semibold">{member.name}</p>
      {member.role ? <p className="mt-0.5 text-sm text-muted">{member.role}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {member.badge ? (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-accent">
            {member.badge}
          </span>
        ) : null}
        {member.badge2 ? (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
            {member.badge2}
          </span>
        ) : null}
      </div>

      {member.body ? <p className="mt-3 text-sm text-muted">{member.body}</p> : null}

      {hover && member.image ? (
        <div className="absolute inset-3 flex flex-col overflow-hidden rounded-card border border-line bg-bg shadow-2xl">
          <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-ink">
            Leadership
          </span>
          <div className="relative flex-1">
            <Image src={member.image} alt="" fill className="object-cover" sizes="240px" />
          </div>
          <div className="bg-surface px-3 py-2">
            <p className="text-sm font-medium">{member.name}</p>
            <p className="text-xs text-muted">{[member.tag, "AgentBlazer Club"].filter(Boolean).join(" \u00b7 ")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
