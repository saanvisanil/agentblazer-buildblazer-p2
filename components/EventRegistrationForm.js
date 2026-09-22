"use client";

import { useState } from "react";

const initial = { name: "", email: "", year: "1st Year", phone: "", website: "" };

export default function EventRegistrationForm({ event }) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const update = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  async function submit(eventSubmit) {
    eventSubmit.preventDefault();
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/event-registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, eventSlug: event.slug, eventTitle: event.title }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not register right now.");
      setStatus("sent"); setValues(initial);
    } catch (err) { setStatus("error"); setError(err.message || "Could not register right now."); }
  }

  if (status === "sent") return <div className="mt-6 rounded-card border border-line bg-bg-soft p-5"><p className="font-medium">You’re registered.</p><p className="mt-1 text-sm text-muted">We’ll email you if there are any important event updates.</p></div>;
  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm text-ink";
  return <form onSubmit={submit} className="mt-6 grid gap-4">
    <label className="text-sm font-medium">Name<input required maxLength={80} value={values.name} onChange={(e) => update("name", e.target.value)} className={inputClass} autoComplete="name" /></label>
    <label className="text-sm font-medium">College email<input required type="email" maxLength={120} value={values.email} onChange={(e) => update("email", e.target.value)} className={inputClass} autoComplete="email" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Year<select value={values.year} onChange={(e) => update("year", e.target.value)} className={inputClass}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label><label className="text-sm font-medium">Phone<input required type="tel" inputMode="numeric" maxLength={15} value={values.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} autoComplete="tel" /></label></div>
    <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} /></div>
    {error ? <p role="alert" className="text-sm text-accent">{error}</p> : null}
    <button disabled={status === "sending"} className="rounded-card px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60" style={{ background: "var(--gradient)" }}>{status === "sending" ? "Registering…" : "Confirm registration"}</button>
  </form>;
}
