"use client";

import { useRef, useState } from "react";
import useResource from "./useResource";
import { normalizeEventForSave } from "./eventUtils";

const blank = () => ({
  slug: `event-${Date.now().toString(36)}`,
  title: "New Event",
  tag: "Workshop",
  date: new Date().toISOString().split("T")[0],
  status: "upcoming",
  registrationOpen: false,
  summary: "Brief event overview.",
  details: "",
  reportUrl: "",
  footLeft: "Hover to inspect gallery",
  footRight: "",
  images: [],
});

export default function EventsEditor() {
  const { data, setData, status, error, dirty, save } = useResource("events");
  const [uploading, setUploading] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const uploadInputs = useRef({});

  if (!data) return <p className="text-sm text-muted">Loading events…</p>;

  function update(i, field, value) {
    const next = data.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    setData(next);
  }

  function saveEvent(i) {
    const next = data.map((event, idx) => idx === i ? normalizeEventForSave(event, idx) : event);
    setData(next);
    save(next);
  }

  function remove(i) {
    setData(data.filter((_, idx) => idx !== i));
  }

  function add() {
    setData([blank(), ...data]);
  }

  async function uploadPhotos(i, files) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploading(i);
    setUploadError("");

    try {
      const paths = [];
      for (const file of selected) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "events");
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || `Could not upload ${file.name}.`);
        paths.push(body.path);
      }
      
      const nextData = data.map((event, idx) => 
        idx === i ? { ...event, images: [...(event.images || []), ...paths] } : event
      );
      
      setData(nextData);
      
      const saved = await save(nextData);
      if (!saved) throw new Error("Photos uploaded, but gallery list could not be auto-saved. Click 'Save this event' to confirm.");
    } catch (err) {
      setUploadError(err.message || "Photo upload failed.");
    } finally {
      setUploading(null);
      if (uploadInputs.current[i]) uploadInputs.current[i].value = "";
    }
  }

  function removePhoto(i, imageIndex) {
    setData(data.map((event, idx) => idx === i ? { ...event, images: event.images.filter((_, imageIdx) => imageIdx !== imageIndex) } : event));
  }

  const inputClass = "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{data.length} events</p>
        <button onClick={add} className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2 font-medium">
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
              <label className="flex items-center gap-2 self-end pb-2 text-xs text-muted">
                <input type="checkbox" checked={event.registrationOpen === true} onChange={(e) => update(i, "registrationOpen", e.target.checked)} />
                Registration open (turn this on only when ready)
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
            <label className="mt-3 block text-xs text-muted">
              Full event description (shown on the details page)
              <textarea className={inputClass} rows={4} value={event.details || ""} onChange={(e) => update(i, "details", e.target.value)} />
            </label>
            <label className="mt-3 block text-xs text-muted">
              Event report link (optional)
              <input type="url" className={inputClass} value={event.reportUrl || ""} onChange={(e) => update(i, "reportUrl", e.target.value)} placeholder="https://…" />
            </label>
            <div className="mt-4">
              <p className="text-xs text-muted">Event gallery photos — choose one or many files (JPG, PNG, WebP; up to 10 MB each).</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input ref={(node) => { uploadInputs.current[i] = node; }} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { uploadPhotos(i, e.target.files); e.target.value = ""; }} />
                <button type="button" onClick={() => uploadInputs.current[i]?.click()} disabled={uploading === i} className="rounded-card border border-line px-2.5 py-1.5 text-xs hover:bg-surface-2 disabled:opacity-60">{uploading === i ? "Uploading photos…" : "+ Add photos"}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(event.images || []).map((image, imageIndex) => (
                  <span key={`${image}-${imageIndex}`} className="flex max-w-full items-center gap-2 rounded-full border border-line px-2 py-1 text-xs text-muted">
                    <img src={image.startsWith("/images/events/") ? `/api/public-image?src=${encodeURIComponent(image)}` : image} alt={`Event photo ${imageIndex + 1}`} className="h-8 w-8 rounded object-cover" />
                    <span className="max-w-48 truncate">Photo {imageIndex + 1}</span>
                    <button type="button" onClick={() => removePhoto(i, imageIndex)} className="text-accent hover:underline">Remove</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => remove(i)} className="text-xs text-accent hover:underline">
                Remove this event
              </button>
              <button
                onClick={() => saveEvent(i)}
                disabled={status === "saving"}
                className="rounded-card border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "saving" ? "Saving…" : "Save this event"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {uploadError ? <p className="mt-4 text-sm text-accent">{uploadError}</p> : null}

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => save(data)}
          disabled={status === "saving" || !dirty}
          className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "var(--gradient)" }}
        >
          {status === "saving" ? "Saving…" : "Save all changes"}
        </button>
        {dirty ? <span className="text-sm text-muted">Unsaved changes</span> : null}
        {status === "saved" ? <span className="text-sm text-accent">Saved — site will update.</span> : null}
        {error ? <span className="text-sm text-accent">{error}</span> : null}
      </div>
    </div>
  );
}
