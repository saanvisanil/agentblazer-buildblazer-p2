"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import EventsEditor from "./EventsEditor";
import TeamEditor from "./TeamEditor";
import SiteEditor from "./SiteEditor";
import ApplicationsList from "./ApplicationsList";
import PermissionsPanel from "./PermissionsPanel";
import AnnouncementsEditor from "./AnnouncementsEditor";
import AchievementsEditor from "./AchievementsEditor";

const TABS = [
  { id: "events", label: "Events", resource: "events", Component: EventsEditor },
  { id: "announcements", label: "Announcements", resource: "announcements", Component: AnnouncementsEditor },
  { id: "achievements", label: "Timeline", resource: "achievements", Component: AchievementsEditor },
  { id: "team", label: "Team", resource: "team", Component: TeamEditor },
  { id: "site", label: "Site text", resource: "site", Component: SiteEditor },
  { id: "applications", label: "Registrations & Submissions", resource: "applications", Component: ApplicationsList },
  { id: "access", label: "Access", leaderOnly: true, Component: PermissionsPanel },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking, true/false after
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("events");

  const loadSession = useCallback(async () => {
    setAuthed(null);
    try {
      const res = await fetch("/api/admin/session");
      if (!res.ok) { setSession(null); setAuthed(false); return; }
      setSession(await res.json());
      setAuthed(true);
    } catch {
      setSession(null);
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession(null);
    setAuthed(false);
  }

  if (authed === null) {
    return <p className="mx-auto max-w-6xl px-5 py-16 text-sm text-muted">Checking session…</p>;
  }

  if (!authed) {
    return <AdminLogin onSuccess={loadSession} />;
  }

  if (!session) return <p className="mx-auto max-w-6xl px-5 py-16 text-sm text-muted">Refreshing your admin access…</p>;

  // A leader may have a pre-existing cookie from before a new content area
  // was introduced. Leaders always receive the current full tab list.
  const tabs = TABS.filter((item) => {
    if (session.role === "leader") return true; // Leaders see every tab
    if (item.leaderOnly) return false;
    return session.permissions.includes(item.resource);
  });
  const activeTab = tabs.find((item) => item.id === tab) || tabs[0];
  const Active = activeTab?.Component;

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
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              activeTab.id === t.id ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">{Active ? <Active /> : <p className="text-sm text-muted">Your account has no editing access yet. Ask a leader to assign permissions.</p>}</div>
    </div>
  );
}
