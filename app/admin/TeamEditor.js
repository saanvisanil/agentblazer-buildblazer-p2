"use client";

import useResource from "./useResource";

const blank = () => ({
  group: "officer",
  name: "",
  role: "",
  tag: "",
  body: "",
  image: "/images/team/placeholder.svg",
});

const GROUPS = ["guest", "faculty", "officer", "committee"];

export default function TeamEditor() {
  const { data, setData, status, error, save } = useResource("team");

  if (!data) return <p className="text-sm text-muted">Loading team\u2026</p>;

  function update(i, field, value) {
    setData(data.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
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
        <p className="text-sm text-muted">{data.length} people</p>
        <button onClick={add} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2">
          + Add person
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {data.map((member, i) => (
          <div key={i} className="rounded-card border border-line bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted">
                Section
                <select className={inputClass} value={member.group} onChange={(e) => update(i, "group", e.target.value)}>
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted">
                Name
                <input className={inputClass} value={member.name} onChange={(e) => update(i, "name", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Role
                <input className={inputClass} value={member.role || ""} onChange={(e) => update(i, "role", e.target.value)} />
              </label>
              <label className="text-xs text-muted">
                Tag / badge
                <input className={inputClass} value={member.tag || ""} onChange={(e) => update(i, "tag", e.target.value)} />
              </label>
            </div>
            <label className="mt-3 block text-xs text-muted">
              Short description (officers only)
              <textarea className={inputClass} rows={2} value={member.body || ""} onChange={(e) => update(i, "body", e.target.value)} />
            </label>
            <button onClick={() => remove(i)} className="mt-3 text-xs text-accent hover:underline">
              Remove this person
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
