"use client";

import { useEffect, useState } from "react";

export default function ApplicationsList() {
  const [applications, setApplications] = useState(null);
  const [registrations, setRegistrations] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((body) => setApplications(body.data || []))
      .catch(() => setError("Could not load applications."));
    fetch("/api/admin/event-registrations")
      .then((res) => res.json())
      .then((body) => setRegistrations(body.data || []))
      .catch(() => setError("Could not load registrations."));
    fetch("/api/admin/contact-messages")
      .then((res) => res.json())
      .then((body) => setMessages(body.data || []))
      .catch(() => setError("Could not load visitor messages."));
  }, []);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  if (!applications || !registrations || !messages) return <p className="text-sm text-muted">Loading submissions…</p>;

  return <div className="space-y-8">
    <section>
      <h2 className="font-display text-lg font-semibold">Messages for the leadership team</h2>
      <p className="mt-1 text-sm text-muted">Visitors who use the chatbot appear here. Reply only when a message needs follow-up.</p>
      {messages.length ? <div className="mt-3 grid gap-3">{[...messages].reverse().map((message, index) => <div key={`${message.receivedAt}-${index}`} className="rounded-card border border-line bg-surface p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-medium">{message.name}</p><span className="text-xs text-muted">{new Date(message.receivedAt).toLocaleString("en-IN")}</span></div><p className="mt-1 text-sm text-muted">{message.email}</p><p className="mt-3 whitespace-pre-line text-sm">{message.text}</p><a href={`mailto:${message.email}?subject=${encodeURIComponent("AgentBlazer Club — following up on your message")}`} className="mt-4 inline-block rounded-card border border-line px-3 py-1.5 text-xs text-accent hover:bg-surface-2">Reply by email</a></div>)}</div> : <p className="mt-2 text-sm text-muted">No visitor messages yet.</p>}
    </section>
    <section>
      <h2 className="font-display text-lg font-semibold">Membership applications</h2>
      {applications.length ? <div className="mt-3 grid gap-3">{[...applications].reverse().map((application, index) => <div key={index} className="rounded-card border border-line bg-surface p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-medium">{application.name}</p><span className="text-xs text-muted">{new Date(application.receivedAt).toLocaleString("en-IN")}</span></div><p className="text-sm text-muted">{application.email} · {application.year}</p><p className="mt-2 text-sm">{application.message}</p></div>)}</div> : <p className="mt-2 text-sm text-muted">No applications yet.</p>}
    </section>
    <section>
      <h2 className="font-display text-lg font-semibold">Event registrations</h2>
      {registrations.length ? <div className="mt-3 grid gap-3">{[...registrations].reverse().map((registration, index) => <div key={index} className="rounded-card border border-line bg-surface p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="font-medium">{registration.name}</p><span className="text-xs text-muted">{new Date(registration.receivedAt).toLocaleString("en-IN")}</span></div><p className="mt-1 text-sm text-accent">{registration.eventTitle}</p><p className="mt-1 text-sm text-muted">{registration.email} · {registration.year} · {registration.phone}</p></div>)}</div> : <p className="mt-2 text-sm text-muted">No event registrations yet.</p>}
    </section>
  </div>;
}
