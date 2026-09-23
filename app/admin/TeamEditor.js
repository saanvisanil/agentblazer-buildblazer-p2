"use client";

import { useState } from "react";
import useResource from "./useResource";

const blank = () => ({
  group: "officer",
  name: "",
  role: "",
  tag: "",
  order: 10,
  archived: false,
  body: "",
  image: "/images/team/placeholder.svg",
});

const GROUPS = ["guest", "faculty", "officer", "committee"];

export default function TeamEditor() {
  const { data, setData, status, error, save } = useResource("team");
  const [uploading, setUploading] = useState(null);
  const [uploadError, setUploadError] = useState("");

  if (!data) return <p className="text-sm text-muted">Loading team…</p>;

  function update(i, field, value) {
    setData(
      data.map((m, idx) =>
        idx === i ? { ...m, [field]: value } : m
      )
    );
  }

  function remove(i) {
    setData(data.filter((_, idx) => idx !== i));
  }

  function add() {
    setData([blank(), ...data]);
  }

  async function uploadPhoto(i, file) {
    if (!file) return;

    setUploading(i);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "team");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Photo upload failed.");
      }

      const nextData = data.map((member, idx) =>
        idx === i ? { ...member, image: body.path } : member
      );
      setData(nextData);

      const saved = await save(nextData);
      if (!saved) throw new Error("Photo uploaded, but the profile could not be saved. Try Save changes again.");
    } catch (err) {
      setUploadError(err.message || "Photo upload failed.");
    } finally {
      setUploading(null);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{data.length} team members total</p>

        <button
          onClick={add}
          className="rounded-card border border-line px-3.5 py-1.5 text-xs font-semibold hover:bg-surface-2"
        >
          + Add Person
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {data.map((member, i) => (
          <div
            key={i}
            className={`rounded-card border border-line bg-surface p-4 ${member.archived ? "opacity-60" : ""}`}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-medium text-muted">
                Section
                <select
                  className={inputClass}
                  value={member.group}
                  onChange={(e) =>
                    update(i, "group", e.target.value)
                  }
                >
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-medium text-muted">
                Name
                <input
                  className={inputClass}
                  value={member.name}
                  onChange={(e) =>
                    update(i, "name", e.target.value)
                  }
                />
              </label>

              <label className="text-xs font-medium text-muted">
                Display Priority / Order (e.g. 1 for President)
                <input
                  type="number"
                  className={inputClass}
                  value={member.order || 10}
                  onChange={(e) =>
                    update(i, "order", parseInt(e.target.value, 10) || 10)
                  }
                />
              </label>

              <label className="text-xs font-medium text-muted">
                Role / Title
                <input
                  className={inputClass}
                  value={member.role || ""}
                  onChange={(e) =>
                    update(i, "role", e.target.value)
                  }
                />
              </label>

              <label className="text-xs font-medium text-muted">
                Tag / Badge
                <input
                  className={inputClass}
                  value={member.tag || ""}
                  onChange={(e) =>
                    update(i, "tag", e.target.value)
                  }
                />
              </label>

              <label className="flex items-center gap-2 self-end pb-2 text-xs font-medium text-muted">
                <input
                  type="checkbox"
                  checked={member.archived === true}
                  onChange={(e) =>
                    update(i, "archived", e.target.checked)
                  }
                />
                Archive Member (keep in record without displaying on site)
              </label>
            </div>

            <label className="mt-3 block text-xs font-medium text-muted">
              Short Description / Bio
              <textarea
                className={inputClass}
                rows={2}
                value={member.body || ""}
                onChange={(e) =>
                  update(i, "body", e.target.value)
                }
              />
            </label>

            <div className="mt-4">
              <p className="text-xs font-medium text-muted">Profile Photo</p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="text-xs text-muted"
                  onChange={(e) =>
                    uploadPhoto(i, e.target.files?.[0])
                  }
                />

                {uploading === i ? (
                  <span className="text-xs text-muted">
                    Uploading photo…
                  </span>
                ) : null}
              </div>

              {member.image ? (
                <p className="mt-2 break-all text-xs text-muted">
                  Current image: {member.image}
                </p>
              ) : null}
            </div>

            <div className="mt-4 border-t border-line pt-3 flex items-center justify-between">
              <button
                onClick={() => remove(i)}
                className="text-xs text-accent hover:underline"
              >
                Delete Record
              </button>

              {member.archived ? (
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] text-amber-400">
                  ARCHIVED
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {uploadError ? (
        <p className="mt-4 text-sm text-accent">
          {uploadError}
        </p>
      ) : null}

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => save(data)}
          disabled={status === "saving"}
          className="rounded-card px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-60"
          style={{ background: "var(--gradient)" }}
        >
          {status === "saving" ? "Saving…" : "Save Team Changes"}
        </button>

        {status === "saved" ? (
          <span className="text-sm text-accent">
            Saved successfully.
          </span>
        ) : null}

        {error ? (
          <span className="text-sm text-accent">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
