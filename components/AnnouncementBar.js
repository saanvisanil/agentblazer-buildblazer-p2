"use client";

import Link from "next/link";
import { useState } from "react";

export default function AnnouncementBar({ announcements = [] }) {
  const [closed, setClosed] = useState(false);

  if (closed || !announcements || !announcements.length) return null;

  // Find active announcement within valid date range
  const today = new Date().toISOString().split("T")[0];
  const item = announcements.find((a) => {
    if (a.active === false) return false;
    if (a.startDate && a.startDate > today) return false;
    if (a.endDate && a.endDate < today) return false;
    return true;
  }) || announcements[0];

  if (!item || item.active === false) return null;

  return (
    <div className="relative z-40 border-b border-line bg-gradient-to-r from-violet-950/80 via-surface to-cyan-950/80 px-4 py-2.5 text-xs text-ink backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 font-bold uppercase tracking-wider text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            {item.label || "ANNOUNCEMENT"}
          </span>
          <span className="font-semibold">{item.title}</span>
          <span className="hidden text-muted md:inline">&mdash; {item.message || item.body}</span>
        </div>

        <div className="flex items-center gap-3">
          {item.link ? (
            <Link
              href={item.link}
              className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent-soft px-3 py-1 font-medium text-accent-ink transition-colors hover:bg-accent hover:text-white"
            >
              Register &rarr;
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setClosed(true)}
            className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Dismiss announcement"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
