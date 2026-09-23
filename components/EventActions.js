"use client";

import Link from "next/link";
import { useState } from "react";

export default function EventActions({ event }) {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const eventUrl = typeof window !== "undefined"
    ? `${window.location.origin}/events/${event.slug}`
    : `https://agentblazer.vercel.app/events/${event.slug}`;

  const shareText = `Join ${event.title} with AgentBlazer Club at SJEC CSE!`;

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text: shareText, url: eventUrl });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    setShowShareModal(true);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${eventUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`AgentBlazer Event: ${event.title}`)}&body=${encodeURIComponent(`${shareText}\n\nRegister here: ${eventUrl}`)}`;

  const registrationOpen = event.status === "upcoming" && event.registrationOpen === true;

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {registrationOpen ? (
          <Link
            href={`/events/${event.slug}/register`}
            className="rounded-card px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 hover:opacity-90"
            style={{ background: "var(--gradient)" }}
          >
            REGISTER NOW &rarr;
          </Link>
        ) : null}

        <button
          type="button"
          onClick={handleNativeShare}
          className="flex items-center gap-2 rounded-card border border-line bg-surface px-4 py-2.5 text-sm text-ink hover:bg-surface-2"
        >
          <span>🔗</span> Share Event
        </button>
      </div>

      {showShareModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Share {event.title}</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-muted">Spread the word with fellow engineering students!</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-card border border-emerald-500/30 bg-emerald-950/20 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-900/30"
              >
                💬 WhatsApp
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-card border border-blue-500/30 bg-blue-950/20 py-2.5 text-xs font-medium text-blue-400 hover:bg-blue-900/30"
              >
                💼 LinkedIn
              </a>

              <a
                href={emailUrl}
                className="flex items-center justify-center gap-2 rounded-card border border-line bg-bg-soft py-2.5 text-xs font-medium text-muted hover:text-ink"
              >
                ✉️ Email
              </a>

              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 rounded-card border border-accent/30 bg-accent-soft py-2.5 text-xs font-medium text-accent-ink"
              >
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
