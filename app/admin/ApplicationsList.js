"use client";

import { useEffect, useState } from "react";

export default function ApplicationsList() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((body) => setApplications(body.data || []))
      .catch(() => setError("Could not load applications."));
  }, []);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  if (!applications) return <p className="text-sm text-muted">Loading applications\u2026</p>;
  if (!applications.length) return <p className="text-sm text-muted">No applications yet.</p>;

  return (
    <div className="grid gap-3">
      {[...applications].reverse().map((a, i) => (
        <div key={i} className="rounded-card border border-line bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">{a.name}</p>
            <span className="text-xs text-muted">{new Date(a.receivedAt).toLocaleString("en-IN")}</span>
          </div>
          <p className="text-sm text-muted">{a.email} \u00b7 {a.year}</p>
          <p className="mt-2 text-sm">{a.message}</p>
        </div>
      ))}
    </div>
  );
}
