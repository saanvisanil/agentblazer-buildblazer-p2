"use client";

import useResource from "./useResource";

const blank = () => ({ id: "", title: "", body: "", date: new Date().toISOString().slice(0, 10), priority: "normal" });

export default function AnnouncementsEditor() {
  const { data, setData, status, error, save, reload } = useResource("announcements");
  if (!data) return status === "error" ? <div className="rounded-card border border-line bg-surface p-4 text-sm"><p className="text-accent">Could not load announcements: {error}</p><button type="button" onClick={reload} className="mt-3 rounded-card border border-line px-3 py-1.5 text-xs hover:bg-surface-2">Try again</button></div> : <p className="text-sm text-muted">Loading announcements…</p>;
  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";
  function update(index, field, value) { setData(data.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)); }
  return <div>
    <div className="flex items-center justify-between"><p className="text-sm text-muted">These updates appear immediately on the home page.</p><button type="button" onClick={() => setData([blank(), ...data])} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2">+ Add announcement</button></div>
    <div className="mt-4 grid gap-4">{data.map((item, index) => <article key={`${item.id}-${index}`} className="rounded-card border border-line bg-surface p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted">Title<input value={item.title} onChange={(e) => update(index, "title", e.target.value)} className={inputClass} /></label><label className="text-xs text-muted">Date<input type="date" value={item.date} onChange={(e) => update(index, "date", e.target.value)} className={inputClass} /></label><label className="text-xs text-muted">ID (unique)<input value={item.id} onChange={(e) => update(index, "id", e.target.value)} className={inputClass} /></label></div><label className="mt-3 block text-xs text-muted">Update<textarea rows={3} value={item.body} onChange={(e) => update(index, "body", e.target.value)} className={inputClass} /></label><button type="button" onClick={() => setData(data.filter((_, itemIndex) => itemIndex !== index))} className="mt-3 text-xs text-accent hover:underline">Remove update</button></article>)}</div>
    <div className="mt-5 flex items-center gap-3"><button type="button" onClick={() => save(data)} disabled={status === "saving"} className="rounded-card px-4 py-2 text-sm font-medium text-white" style={{ background: "var(--gradient)" }}>{status === "saving" ? "Publishing…" : "Publish updates"}</button>{status === "saved" ? <span className="text-sm text-accent">Published.</span> : null}{error ? <span className="text-sm text-accent">{error}</span> : null}</div>
  </div>;
}
