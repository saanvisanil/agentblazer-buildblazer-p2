"use client";

import useResource from "./useResource";

const blank = () => ({
  slug: "",
  title: "",
  tag: "",
  date: "",
  status: "upcoming",
  summary: "",
  footLeft: "Hover to inspect gallery",
  footRight: "",
  images: ["/images/events/placeholder.svg"],
});

export default function EventsEditor() {
  const { data, setData, status, error, save } = useResource("events");

  if (!data) return <p className="text-sm text-muted">Loading events\u2026</p>;

  function update(i, field, value) {
    const next = data.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    setData(next);
  }

  function remove(i) {
    setData(data.filter((_, idx) => idx !== i));
  }

  function add() {
    setData([blank(), ...data]);
  }

  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{data.length} events</p>
        <button onClick={add} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2">
          + Add event
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {data.map((event, i) => (
          <div key={i} className="rounded-card border border-line bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted">
                Title
                <input className={inputClass} value={event.title} onChange={(e) => update(i, "title", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Slug (unique, no spaces)
                <input className={inputClass} value={event.slug} onChange={(e) => update(i, "slug", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Tag
                <input className={inputClass} value={event.tag} onChange={(e) => update(i, "tag", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Date
                <input type="date" className={inputClass} value={event.date} onChange={(e) => update(i, "date", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Status
                <select className={inputClass} value={event.status} onChange={(e) => update(i, "status", e.target.value)}>
                  <option value="upcoming">upcoming</option>
                  <option value="past">past</option>
                </select>
              </label>
              <label className="text-xs text-muted">
                Right-side footer note
                <input className={inputClass} value={event.footRight || ""} onChange={(e) => update(i, "footRight", e.target.value)} />
              </label>
            </div>
            <label className="mt-3 block text-xs text-muted">
              Summary
              <textarea className={inputClass} rows={2} value={event.summary} onChange={(e) => update(i, "summary", e.target.value)} />
            </label>
            <button onClick={() => remove(i)} className="mt-3 text-xs text-accent hover:underline">
              Remove this event
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
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
