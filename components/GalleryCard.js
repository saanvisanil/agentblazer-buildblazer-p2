"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// An event card that reveals a photo gallery on hover, auto-advancing while
// hovered/focused (matches "Hover to inspect gallery" from the Figma).
export default function GalleryCard({ event, formattedDate }) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const images = event.images && event.images.length ? event.images : ["/images/events/placeholder.svg"];

  useEffect(() => {
    if (active && images.length > 1) {
      timer.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, 1400);
    }
    return () => clearInterval(timer.current);
  }, [active, images.length]);

  return (
    <div
      className="group relative overflow-hidden rounded-card border border-line bg-surface p-5"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setIndex(0);
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{formattedDate}</span>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-accent">{event.tag}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{event.title}</h3>

      {event.tracks ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {event.tracks.map((t) => (
            <span key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-2 text-sm text-muted">{event.summary}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          {event.footLeft}
        </span>
        <span>{event.footRight}</span>
      </div>

      {active ? (
        <div className="absolute inset-x-3 bottom-3 top-16 overflow-hidden rounded-card border border-line bg-bg shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted">
            <span className="truncate">
              {event.speaker ? `Guest Speaker: ${event.speaker}` : event.title}
            </span>
            <span>
              {index + 1}/{images.length}
            </span>
          </div>
          <div className="relative h-[calc(100%-2.75rem)] w-full">
            <Image src={images[index]} alt="" fill className="object-cover" sizes="320px" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
