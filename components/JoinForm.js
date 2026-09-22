"use client";

import { useState } from "react";
import Button from "./Button";

const initial = { name: "", email: "", year: "2nd Year", message: "", website: "" };

export default function JoinForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Try again in a moment.");
        return;
      }

      setStatus("sent");
      setValues(initial);
    } catch {
      setStatus("error");
      setError("Could not reach the server. Check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-card border border-line bg-bg-soft p-5">
        <p className="font-medium">Application received.</p>
        <p className="mt-1 text-sm text-muted">A club lead will email you before the next session.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm text-accent hover:underline">
          Send another
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" type="text" required maxLength={80} autoComplete="name"
          value={values.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">College email</label>
        <input id="email" name="email" type="email" required maxLength={120} autoComplete="email"
          value={values.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="year" className="text-sm font-medium">Year</label>
        <select id="year" name="year" value={values.year} onChange={(e) => update("year", e.target.value)} className={inputClass}>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">Why do you want to join?</label>
        <textarea id="message" name="message" rows={4} required maxLength={1000}
          value={values.message} onChange={(e) => update("message", e.target.value)} className={inputClass} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off"
          value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      {error ? <p role="alert" className="text-sm text-accent">{error}</p> : null}

      <div>
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send application"}
        </Button>
      </div>
    </form>
  );
}
