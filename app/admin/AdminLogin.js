"use client";

import { useState } from "react";

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
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
      body: JSON.stringify({ username, password }),
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
      <p className="mt-1 text-sm text-muted">Sign in with your username and password.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-card border border-line bg-bg px-3 py-2 text-sm"
          autoComplete="username"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-card border border-line bg-bg px-3 py-2 text-sm"
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink"
          style={{ background: "var(--gradient)" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
