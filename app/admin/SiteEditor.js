"use client";

import useResource from "./useResource";

export default function SiteEditor() {
  const { data, setData, status, error, save } = useResource("site");

  if (!data) return <p className="text-sm text-muted">Loading site text\u2026</p>;

  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";

  function updateStat(i, field, value) {
    const stats = data.stats.map((s, idx) => (idx === i ? { ...s, [field]: value } : s));
    setData({ ...data, stats });
  }

  return (
    <div className="grid gap-4">
      <label className="text-xs text-muted">
        Homepage description
        <textarea
          className={inputClass}
          rows={3}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </label>

      <label className="text-xs text-muted">
        Club contact email
        <input className={inputClass} value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
      </label>

      <div>
        <p className="text-xs text-muted">Homepage stats</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {data.stats.map((s, i) => (
            <div key={i} className="rounded-card border border-line bg-surface p-3">
              <input className={inputClass} value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="Value" />
              <input className={inputClass} value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Label" />
            </div>
          ))}
        </div>
      </div>

      <label className="text-xs text-muted">
        Join & Connect intro
        <textarea
          className={inputClass}
          rows={2}
          value={data.join.body}
          onChange={(e) => setData({ ...data, join: { ...data.join, body: e.target.value } })}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          onClick={() => save(data)}
          disabled={status === "saving"}
          className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink"
          style={{ background: "var(--gradient)" }}
        >
          {status === "saving" ? "Saving\u2026" : "Save changes"}
        </button>
        {status === "saved" ? <span className="text-sm text-accent">Saved \u2014 site will update shortly.</span> : null}
        {error ? <span className="text-sm text-accent">{error}</span> : null}
      </div>
    </div>
  );
}
