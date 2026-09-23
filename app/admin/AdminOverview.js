"use client";

import { useEffect, useState } from "react";

export default function AdminOverview({ session, onNavigate }) {
  const [stats, setStats] = useState({ team: 0, events: 0, registrations: 0, achievements: 0, applications: 0, messages: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [teamRes, eventsRes, regRes, achRes, appRes, msgRes, actRes] = await Promise.all([
          fetch("/api/admin/content?resource=team").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/content?resource=events").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/event-registrations").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/content?resource=achievements").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/applications").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/contact-messages").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/activity").then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        setStats({
          team: teamRes.data?.length || 0,
          events: eventsRes.data?.length || 0,
          registrations: regRes.data?.length || 0,
          achievements: achRes.data?.length || 0,
          applications: appRes.data?.length || 0,
          messages: msgRes.data?.length || 0,
        });

        setActivities(actRes.data || []);
      } catch (err) {
        console.error("Could not load admin overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted">Loading overview dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-line bg-gradient-to-r from-violet-950/40 via-surface to-cyan-950/40 p-6">
        <h2 className="font-display text-2xl font-semibold">
          Welcome back, <span className="gradient-text capitalize">{session?.username || "Leader"}</span> 👋
        </h2>
        <p className="mt-1 text-sm text-muted">
          Here is your AgentBlazer Club status overview and recent system activity.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => onNavigate("events")}
          className="group cursor-pointer rounded-card border border-line bg-surface p-5 transition-all hover:border-accent"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Events</p>
          <p className="mt-2 font-display text-3xl font-bold gradient-text">{stats.events}</p>
          <p className="mt-1 text-xs text-accent group-hover:underline">Manage Events &rarr;</p>
        </div>

        <div
          onClick={() => onNavigate("applications")}
          className="group cursor-pointer rounded-card border border-line bg-surface p-5 transition-all hover:border-accent"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Event Registrations</p>
          <p className="mt-2 font-display text-3xl font-bold gradient-text">{stats.registrations}</p>
          <p className="mt-1 text-xs text-accent group-hover:underline">View Submissions &rarr;</p>
        </div>

        <div
          onClick={() => onNavigate("team")}
          className="group cursor-pointer rounded-card border border-line bg-surface p-5 transition-all hover:border-accent"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Team Members</p>
          <p className="mt-2 font-display text-3xl font-bold gradient-text">{stats.team}</p>
          <p className="mt-1 text-xs text-accent group-hover:underline">Manage Team &rarr;</p>
        </div>

        <div
          onClick={() => onNavigate("achievements")}
          className="group cursor-pointer rounded-card border border-line bg-surface p-5 transition-all hover:border-accent"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Timeline Milestones</p>
          <p className="mt-2 font-display text-3xl font-bold gradient-text">{stats.achievements}</p>
          <p className="mt-1 text-xs text-accent group-hover:underline">Edit Timeline &rarr;</p>
        </div>
      </div>

      {/* Notifications & Action Alerts */}
      <section className="rounded-card border border-line bg-surface p-6">
        <h3 className="font-display text-lg font-semibold">Dashboard Notifications</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div
            onClick={() => onNavigate("applications")}
            className="cursor-pointer rounded-card border border-violet-500/30 bg-violet-950/20 p-4 transition-colors hover:bg-violet-900/30"
          >
            <span className="text-xs font-bold text-violet-400">🔵 {stats.registrations} Registrations</span>
            <p className="mt-1 text-xs text-muted">Total student registrations recorded for events.</p>
          </div>

          <div
            onClick={() => onNavigate("applications")}
            className="cursor-pointer rounded-card border border-cyan-500/30 bg-cyan-950/20 p-4 transition-colors hover:bg-cyan-900/30"
          >
            <span className="text-xs font-bold text-cyan-400">🟣 {stats.applications} Applications</span>
            <p className="mt-1 text-xs text-muted">New club membership intake applications.</p>
          </div>

          <div
            onClick={() => onNavigate("applications")}
            className="cursor-pointer rounded-card border border-amber-500/30 bg-amber-950/20 p-4 transition-colors hover:bg-amber-900/30"
          >
            <span className="text-xs font-bold text-amber-400">🟡 {stats.messages} Messages</span>
            <p className="mt-1 text-xs text-muted">Visitor inquiries sent via the assistant.</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Stream */}
      <section className="rounded-card border border-line bg-surface p-6">
        <h3 className="font-display text-lg font-semibold">Recent Admin Activity</h3>
        {activities.length ? (
          <div className="mt-4 space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex flex-wrap items-center justify-between gap-2 rounded-card border border-line bg-bg-soft p-3 text-xs">
                <div>
                  <span className="font-semibold text-ink">{act.user}</span>
                  <span className="text-muted"> &middot; {act.action}: </span>
                  <span className="font-medium text-accent">{act.target}</span>
                </div>
                <span className="text-muted">{new Date(act.timestamp).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No recent activity logged yet.</p>
        )}
      </section>
    </div>
  );
}
