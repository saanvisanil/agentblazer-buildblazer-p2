"use client";

import { useEffect, useState } from "react";

export default function ActivityLog() {
  const [activities, setActivities] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/activity")
      .then((res) => res.json())
      .then((body) => setActivities(body.data || []))
      .catch(() => setError("Could not load activity log."));
  }, []);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  if (!activities) return <p className="text-sm text-muted">Loading audit log…</p>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold">Admin Activity Audit Log</h2>
        <p className="mt-1 text-xs text-muted">
          Timestamped record of all admin mutations, content updates, and image uploads.
        </p>
      </div>

      {activities.length ? (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <div className="divide-y divide-line">
            {activities.map((act) => (
              <div key={act.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs">
                <div>
                  <span className="font-semibold text-accent">{act.user}</span>
                  <span className="text-muted"> &middot; {act.action}: </span>
                  <span className="font-medium text-ink">{act.target}</span>
                </div>
                <span className="font-mono text-muted">
                  {new Date(act.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">No activity recorded yet.</p>
      )}
    </div>
  );
}
