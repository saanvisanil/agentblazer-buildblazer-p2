"use client";

import { useState } from "react";

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not sign in.");
      return;
    }
    onSuccess();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <h1 className="font-display text-2xl font-semibold">Club admin</h1>
      <p className="mt-1 text-sm text-muted">Sign in to edit events, team members, and site text.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-card border border-line bg-bg px-3 py-2 text-sm"
          autoFocus
        />
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink"
          style={{ background: "var(--gradient)" }}
        >
          {loading ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
