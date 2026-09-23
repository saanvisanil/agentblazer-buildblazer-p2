"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { displayImageUrl } from "@/lib/images";

export default function AchievementTimeline({ achievements = [] }) {
  const [selected, setSelected] = useState(null);

  if (!achievements.length) {
    return (
      <div className="rounded-card border border-line bg-surface p-8 text-center text-muted">
        <p>No milestone achievements published yet.</p>
      </div>
    );
  }

  // Group achievements by year
  const grouped = achievements.reduce((acc, item) => {
    const year = item.year || (item.date ? item.date.slice(0, 4) : "2026");
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="relative py-8">
      {/* Central futuristic timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-400 to-violet-500/20 md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-12">
        {years.map((year) => (
          <div key={year} className="relative">
            {/* Year Badge */}
            <div className="sticky top-20 z-20 mb-8 flex justify-start md:justify-center">
              <span className="inline-block rounded-full border border-cyan-400/40 bg-[#090b18] px-5 py-1.5 font-display text-sm font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                {year}
              </span>
            </div>

            {/* Milestones in this year */}
            <div className="space-y-8">
              {grouped[year].map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id || `${year}-${index}`}
                    className="relative flex flex-col md:flex-row md:items-center"
                  >
                    {/* Glowing node dot */}
                    <div className="absolute left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-cyan-300 bg-violet-600 shadow-[0_0_12px_rgba(34,211,238,1)] md:left-1/2" />

                    {/* Content Box */}
                    <div
                      className={`ml-10 md:ml-0 md:w-1/2 ${
                        isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                      }`}
                    >
                      <div
                        onClick={() => setSelected(item)}
                        className="group cursor-pointer rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:border-accent hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]"
                      >
                        <div
                          className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <span className="rounded-full bg-accent-soft px-2.5 py-0.5">
                            {item.tag || "Milestone"}
                          </span>
                          <span className="text-muted">{item.date}</span>
                        </div>

                        <h3 className="mt-2 font-display text-lg font-semibold text-ink group-hover:text-accent">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                          {item.body}
                        </p>

                        <div
                          className={`mt-4 flex items-center gap-1 text-xs font-medium text-accent ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <span>Inspect milestone</span> &rarr;
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Milestone Modal */}
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            {selected.image ? (
              <div className="relative h-56 w-full">
                <Image
                  src={displayImageUrl(selected.image)}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
            ) : null}

            <div className="p-6">
              <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {selected.tag || "Milestone"} &middot; {selected.date}
              </span>

              <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
                {selected.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted whitespace-pre-line">
                {selected.body}
              </p>

              <div className="mt-6 flex items-center justify-between">
                {selected.link ? (
                  <Link
                    href={selected.link}
                    className="rounded-card border border-accent/40 bg-accent-soft px-4 py-2 text-xs font-semibold text-accent-ink hover:bg-accent hover:text-white"
                  >
                    View Related Event &rarr;
                  </Link>
                ) : <span />}

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-card border border-line px-4 py-2 text-xs text-muted hover:bg-surface-2 hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
