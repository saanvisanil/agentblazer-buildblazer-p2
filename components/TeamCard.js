"use client";

import { useState } from "react";

export default function TeamCard({ member }) {
  const [active, setActive] = useState(false);

  const hasImage =
    member.image &&
    member.image !== "/images/team/placeholder.svg";
  const photoSource = hasImage
    ? `/api/public-image?src=${encodeURIComponent(member.image)}`
    : null;

  return (
    <div
      className="relative overflow-visible"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {/* Main team card */}
      <article
        tabIndex={0}
        className={`relative overflow-visible rounded-card border border-line bg-surface p-5 transition-all duration-300 ${
          active
            ? "z-40 border-accent shadow-[0_0_35px_rgba(139,92,246,0.18)]"
            : "z-10"
        }`}
      >
        {/* Role badge */}
        {member.role && (
          <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
            {member.role}
          </span>
        )}

        {/* Name */}
        <h3 className="mt-3 font-display text-lg font-semibold">
          {member.name}
        </h3>

        {/* Position */}
        {member.tag && (
          <p className="mt-1 text-sm text-muted">
            {member.tag}
          </p>
        )}

        {/* Description */}
        {member.body && (
          <p className="mt-6 text-sm leading-6 text-muted">
            {member.body}
          </p>
        )}
      </article>

      {/* Beautiful hover photo */}
      {hasImage && active && (
        <div
          className="
            pointer-events-none
            absolute
            left-[calc(100%+18px)]
            top-1/2
            z-[100]
            w-[220px]
            -translate-y-1/2
            overflow-hidden
            rounded-[22px]
            border border-white/10
            bg-[#090b18]/95
            p-[3px]
            shadow-[0_0_25px_rgba(139,92,246,0.35),0_0_70px_rgba(34,211,238,0.15),0_25px_70px_rgba(0,0,0,0.7)]
            backdrop-blur-xl
            animate-in
            fade-in
            zoom-in-95
            duration-300
          "
        >
          {/* Gradient border */}
          <div className="relative overflow-hidden rounded-[19px] bg-gradient-to-br from-violet-500 via-fuchsia-500/60 to-cyan-400 p-[1px]">
            <div className="relative overflow-hidden rounded-[18px] bg-[#090b18]">

              {/* Purple glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

              {/* Cyan glow */}
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

              {/* Photo */}
              <div className="relative m-2 h-[240px] overflow-hidden rounded-[15px]">
                <img
                  src={photoSource}
                  alt={member.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* Image gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-transparent to-transparent" />

                {/* Top purple glow */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-violet-500/25 to-transparent" />
              </div>

              {/* Information */}
              <div className="relative px-4 pb-4 pt-2">

                {/* Accent line */}
                <div className="mb-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

                {/* Name */}
                <h3 className="font-display text-base font-semibold text-white">
                  {member.name}
                </h3>

                {/* Title */}
                {member.tag && (
                  <p className="mt-1 text-xs text-violet-300">
                    {member.tag}
                  </p>
                )}

                {/* Club label */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />

                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    AgentBlazer Club
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
