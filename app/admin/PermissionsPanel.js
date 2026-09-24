"use client";

import { useEffect, useState } from "react";

const DEFAULT_FORM = { username: "", password: "", permissions: [] };
const PERMISSIONS = [
  ["events", "Events and registration"],
  ["team", "Team profiles"],
  ["site", "Site text"],
  ["announcements", "Announcements"],
  ["achievements", "Achievements and timeline"],
  ["applications", "Applications and registrations"],
];

export default function PermissionsPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setStatus("loading");
    const res = await fetch("/api/admin/users");
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || "Could not load access list.");
      setStatus("error");
      return;
    }
    setUsers(body.data || []);
    setError("");
    setStatus("ready");
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.error || "Could not create user.");
      return;
    }
    setForm(DEFAULT_FORM);
    await loadUsers();
  }

  async function disableUser(username, enabled) {
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, enabled }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || "Could not update this account.");
      return;
    }
    await loadUsers();
  }

  async function savePermissions(username, permissions) {
    const res = await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, permissions }) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) setError(body.error || "Could not update permissions.");
    else await loadUsers();
  }

  async function removeUser(username) {
    if (!confirm(`Permanently remove the account "${username}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || "Could not remove this account.");
      return;
    }
    await loadUsers();
  }

  function togglePermission(list, permission) {
    return list.includes(permission) ? list.filter((item) => item !== permission) : [...list, permission];
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-card border border-line bg-surface p-4">
        <h2 className="font-display text-xl font-semibold">Create access credentials</h2>
        <p className="mt-1 text-sm text-muted">
          Only the team leader can assign permissions and create additional admin accounts.
        </p>

        <form onSubmit={handleCreate} className="mt-4 grid gap-3">
          <label className="text-xs text-muted">
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm"
              placeholder="team-member"
            />
          </label>

          <label className="text-xs text-muted">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm"
              placeholder="At least 12 characters"
            />
          </label>

          <fieldset className="rounded-card border border-line bg-bg p-3"><legend className="px-1 text-xs text-muted">What this person can edit</legend><div className="mt-2 grid gap-2">{PERMISSIONS.map(([permission, label]) => <label key={permission} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.permissions.includes(permission)} onChange={() => setForm({ ...form, permissions: togglePermission(form.permissions, permission) })} />{label}</label>)}</div></fieldset>

          {error ? <p className="text-sm text-accent">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink"
            style={{ background: "var(--gradient)" }}
          >
            {saving ? "Creating…" : "Create account"}
          </button>
        </form>
      </section>

      <section className="rounded-card border border-line bg-surface p-4">
        <h2 className="font-display text-xl font-semibold">Permission roster</h2>

        {status === "loading" ? (
          <p className="mt-3 text-sm text-muted">Loading team access…</p>
        ) : (
          <div className="mt-4 space-y-3">
            {users.length === 0 ? (
              <p className="text-sm text-muted">No admin accounts yet.</p>
            ) : (
              users.map((user) => (
                <div key={user.username} className="rounded-card border border-line bg-bg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-muted">{user.role === "leader" ? "Leader — full access" : (user.permissions || []).length ? (user.permissions || []).join(", ") : "No editing access"}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${
                        user.enabled ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-500/10 text-slate-300"
                      }`}
                    >
                      {user.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => disableUser(user.username, !user.enabled)}
                      className="rounded-card border border-line px-2.5 py-1.5 text-xs hover:bg-surface-2"
                    >
                      {user.enabled ? "Disable" : "Enable"}
                    </button>
                    {user.role !== "leader" ? (
                      <button
                        type="button"
                        onClick={() => removeUser(user.username)}
                        className="rounded-card border border-red-500/40 bg-red-950/20 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-900/30"
                      >
                        ✕ Remove
                      </button>
                    ) : null}
                  </div>
                  {user.role !== "leader" ? <fieldset className="mt-3 grid gap-1 border-t border-line pt-3"><legend className="text-xs text-muted">Edit access</legend>{PERMISSIONS.map(([permission, label]) => <label key={permission} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={(user.permissions || []).includes(permission)} onChange={() => savePermissions(user.username, togglePermission(user.permissions || [], permission))} />{label}</label>)}</fieldset> : null}
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
