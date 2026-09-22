"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventActions from "./EventActions";
import { displayImageUrl } from "@/lib/images";

export default function GalleryCard({ event, formattedDate }) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const images =
    event.images && event.images.length > 0
      ? event.images
      : ["/images/events/placeholder.svg"];

  useEffect(() => {
    if (!active || images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [active, images.length]);

  return (
    <div
      className="relative overflow-visible"
      onMouseEnter={() => {
        setActive(true);
        setIndex(0);
      }}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {/* Main event card */}
      <article
        tabIndex={0}
        className={`relative overflow-visible rounded-card border border-line bg-surface p-5 transition-all duration-300 ${
          active
            ? "z-40 border-accent shadow-[0_0_35px_rgba(139,92,246,0.18)]"
            : "z-10"
        }`}
      >
        {/* Event category */}
        {event.tag && (
          <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
            {event.tag}
          </span>
        )}

        {/* Event title */}
        <h3 className="mt-3 font-display text-lg font-semibold">
          {event.title}
        </h3>

        {/* Date */}
        <p className="mt-2 text-sm text-muted">
          {formattedDate || event.date}
        </p>

        {/* Description */}
        {event.summary && (
          <p className="mt-4 text-sm leading-6 text-muted">
            {event.summary}
          </p>
        )}
        <EventActions event={event} />
        <Link href={`/events/${event.slug}`} className="mt-3 inline-block text-sm text-accent hover:underline">View event details →</Link>
      </article>

      {/* Floating event gallery */}
      {active && (
        <div
          className="
            pointer-events-none
            absolute
            left-[calc(100%+18px)]
            top-1/2
            z-[100]
            w-[330px]
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

              {/* Purple decorative glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

              {/* Cyan decorative glow */}
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

              {/* Event image */}
              <div className="relative m-2 h-[230px] overflow-hidden rounded-[15px]">
                <Image
                  src={displayImageUrl(images[index])}
                  alt={`${event.title} gallery`}
                  fill
                  sizes="330px"
                  className="object-cover"
                />

                {/* Dark image gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-transparent to-transparent" />

                {/* Purple top glow */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-violet-500/25 to-transparent" />

                {/* Gallery counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] text-white/80 backdrop-blur-md">
                    {index + 1} / {images.length}
                  </div>
                )}

                {/* Event category floating badge */}
                {event.tag && (
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-violet-200 backdrop-blur-md">
                    {event.tag}
                  </div>
                )}
              </div>

              {/* Event information */}
              <div className="relative px-4 pb-4 pt-2">

                {/* Gradient accent line */}
                <div className="mb-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

                {/* Event title */}
                <h3 className="font-display text-base font-semibold text-white">
                  {event.title}
                </h3>

                {/* Date */}
                <p className="mt-1 text-xs text-violet-300">
                  {formattedDate || event.date}
                </p>

                {/* Club label */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />

                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    AgentBlazer Events
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
