"use client";

import { useState } from "react";

const initial = {
  name: "",
  email: "",
  usn: "",
  department: "Computer Science & Engineering",
  year: "1st Year",
  phone: "",
  website: "",
};

export default function EventRegistrationForm({ event }) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field, value) =>
    setValues((current) => ({ ...current, [field]: value }));

  async function submit(eventSubmit) {
    eventSubmit.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          eventSlug: event.slug,
          eventTitle: event.title,
        }),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not register right now.");

      setStatus("sent");
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not register right now.");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-card border border-emerald-500/30 bg-emerald-950/20 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          ✓
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-emerald-300">
          Registration Successful!
        </h3>
        <p className="mt-1 text-sm text-muted">
          You have successfully registered for <span className="font-semibold text-ink">{event.title}</span>.
        </p>
        <p className="mt-3 text-xs text-muted">
          Our team will email updates and session materials directly to your inbox.
        </p>
      </div>
    );
  }

  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <label className="text-sm font-medium text-ink">
        Full Name <span className="text-accent">*</span>
        <input
          required
          maxLength={80}
          placeholder="e.g. Rahul Dsouza"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          College Email <span className="text-accent">*</span>
          <input
            required
            type="email"
            maxLength={120}
            placeholder="student@sjec.ac.in"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </label>

        <label className="text-sm font-medium text-ink">
          USN <span className="text-accent">*</span>
          <input
            required
            maxLength={20}
            placeholder="4SO23CS001"
            value={values.usn}
            onChange={(e) => update("usn", e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-ink">
          Department <span className="text-accent">*</span>
          <input
            required
            maxLength={80}
            value={values.department}
            onChange={(e) => update("department", e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="text-sm font-medium text-ink">
          Year <span className="text-accent">*</span>
          <select
            value={values.year}
            onChange={(e) => update("year", e.target.value)}
            className={inputClass}
          >
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
        </label>

        <label className="text-sm font-medium text-ink">
          Phone Number <span className="text-accent">*</span>
          <input
            required
            type="tel"
            inputMode="numeric"
            maxLength={15}
            placeholder="9876543210"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
            autoComplete="tel"
          />
        </label>
      </div>

      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      ) : null}

      <button
        disabled={status === "sending"}
        className="mt-2 rounded-card px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60"
        style={{ background: "var(--gradient)" }}
      >
        {status === "sending" ? "Processing Registration…" : "CONFIRM REGISTRATION →"}
      </button>
    </form>
  );
}
