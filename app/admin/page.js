"use client";

import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import EventsEditor from "./EventsEditor";
import TeamEditor from "./TeamEditor";
import SiteEditor from "./SiteEditor";
import ApplicationsList from "./ApplicationsList";

const TABS = [
  { id: "events", label: "Events", Component: EventsEditor },
  { id: "team", label: "Team", Component: TeamEditor },
  { id: "site", label: "Site text", Component: SiteEditor },
  { id: "applications", label: "Applications", Component: ApplicationsList },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking, true/false after
  const [tab, setTab] = useState("events");

  useEffect(() => {
    fetch("/api/admin/content?resource=site").then((res) => {
      setAuthed(res.status !== 401);
    });
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  if (authed === null) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-sm text-muted">Checking session\u2026</p>;
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  const Active = TABS.find((t) => t.id === tab).Component;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Club admin</h1>
          <p className="text-sm text-muted">
            Changes here commit straight to GitHub; the live site updates automatically within a minute.
          </p>
        </div>
        <button onClick={logout} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2">
          Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              tab === t.id ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Active />
      </div>
    </div>
  );
}
