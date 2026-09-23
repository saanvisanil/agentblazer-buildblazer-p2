"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminOverview from "./AdminOverview";
import EventsEditor from "./EventsEditor";
import TeamEditor from "./TeamEditor";
import SiteEditor from "./SiteEditor";
import ApplicationsList from "./ApplicationsList";
import PermissionsPanel from "./PermissionsPanel";
import AnnouncementsEditor from "./AnnouncementsEditor";
import AchievementsEditor from "./AchievementsEditor";
import ActivityLog from "./ActivityLog";

const TABS = [
  { id: "overview", label: "Overview", resource: "events", Component: AdminOverview },
  { id: "events", label: "Events", resource: "events", Component: EventsEditor },
  { id: "announcements", label: "Announcements", resource: "announcements", Component: AnnouncementsEditor },
  { id: "achievements", label: "Timeline", resource: "achievements", Component: AchievementsEditor },
  { id: "team", label: "Team", resource: "team", Component: TeamEditor },
  { id: "site", label: "Site Content", resource: "site", Component: SiteEditor },
  { id: "applications", label: "Registrations & Submissions", resource: "applications", Component: ApplicationsList },
  { id: "activity", label: "Activity Log", resource: "events", Component: ActivityLog },
  { id: "access", label: "Access & Roles", leaderOnly: true, Component: PermissionsPanel },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking, true/false after
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("overview");

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

  const tabs = TABS.filter((item) => {
    if (session.role === "leader") return true;
    if (item.leaderOnly) return false;
    return session.permissions.includes(item.resource);
  });
  const activeTab = tabs.find((item) => item.id === tab) || tabs[0];
  const Active = activeTab?.Component;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">AgentBlazer Admin Dashboard</h1>
          <p className="text-sm text-muted">
            Manage events, team members, announcements, milestone timeline, and student registrations.
          </p>
        </div>
        <button onClick={logout} className="rounded-card border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-surface-2 hover:text-ink">
          Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5 rounded-2xl border border-line bg-surface p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              activeTab.id === t.id ? "bg-accent text-accent-ink shadow-md" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {Active ? (
          <Active session={session} onNavigate={(targetTab) => setTab(targetTab)} />
        ) : (
          <p className="text-sm text-muted">Your account has no editing access yet. Ask a leader to assign permissions.</p>
        )}
      </div>
    </div>
  );
}
