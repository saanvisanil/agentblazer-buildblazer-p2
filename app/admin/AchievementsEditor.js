"use client";

import useResource from "./useResource";

const blank = () => ({ date: new Date().toISOString().slice(0, 10), title: "", body: "", tag: "Achievement" });

export default function AchievementsEditor() {
  const { data, setData, status, error, save, reload } = useResource("achievements");
  if (!data) return status === "error" ? <div className="rounded-card border border-line bg-surface p-4 text-sm"><p className="text-accent">Could not load timeline: {error}</p><button type="button" onClick={reload} className="mt-3 rounded-card border border-line px-3 py-1.5 text-xs hover:bg-surface-2">Try again</button></div> : <p className="text-sm text-muted">Loading timeline…</p>;
  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";
  const update = (index, field, value) => setData(data.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  return <div>
    <div className="flex items-center justify-between"><p className="text-sm text-muted">These entries appear in date order on the About page.</p><button type="button" onClick={() => setData([blank(), ...data])} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2">+ Add timeline entry</button></div>
    <div className="mt-4 grid gap-4">{data.map((item, index) => <article key={`${item.date}-${index}`} className="rounded-card border border-line bg-surface p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-muted">Date<input type="date" value={item.date} onChange={(e) => update(index, "date", e.target.value)} className={inputClass} /></label><label className="text-xs text-muted">Category<input value={item.tag} onChange={(e) => update(index, "tag", e.target.value)} className={inputClass} /></label></div><label className="mt-3 block text-xs text-muted">Title<input value={item.title} onChange={(e) => update(index, "title", e.target.value)} className={inputClass} /></label><label className="mt-3 block text-xs text-muted">Description<textarea rows={3} value={item.body} onChange={(e) => update(index, "body", e.target.value)} className={inputClass} /></label><button type="button" onClick={() => setData(data.filter((_, itemIndex) => itemIndex !== index))} className="mt-3 text-xs text-accent hover:underline">Remove entry</button></article>)}</div>
    <div className="mt-5 flex items-center gap-3"><button type="button" onClick={() => save(data)} disabled={status === "saving"} className="rounded-card px-4 py-2 text-sm font-medium text-white" style={{ background: "var(--gradient)" }}>{status === "saving" ? "Saving…" : "Save timeline"}</button>{status === "saved" ? <span className="text-sm text-accent">Saved — site will update shortly.</span> : null}{error ? <span className="text-sm text-accent">{error}</span> : null}</div>
  </div>;
}
