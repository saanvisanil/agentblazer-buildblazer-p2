"use client";

import { useState } from "react";
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

      // The upload commits the image file itself; this second save commits
      // the image path into team.json so it cannot disappear on refresh.
      const saved = await save(nextData);
      if (!saved) throw new Error("Photo uploaded, but the profile could not be saved. Try Save changes again.");
    } catch (err) {
      setUploadError(err.message || "Photo upload failed.");
    } finally {
      setUploading(null);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-card border border-line bg-bg px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{data.length} people</p>

        <button
          onClick={add}
          className="rounded-card border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
        >
          + Add person
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {data.map((member, i) => (
          <div
            key={i}
            className="rounded-card border border-line bg-surface p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted">
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

              <label className="text-xs text-muted">
                Name
                <input
                  className={inputClass}
                  value={member.name}
                  onChange={(e) =>
                    update(i, "name", e.target.value)
                  }
                />
              </label>

              <label className="text-xs text-muted">
                Role
                <input
                  className={inputClass}
                  value={member.role || ""}
                  onChange={(e) =>
                    update(i, "role", e.target.value)
                  }
                />
              </label>

              <label className="text-xs text-muted">
                Tag / badge
                <input
                  className={inputClass}
                  value={member.tag || ""}
                  onChange={(e) =>
                    update(i, "tag", e.target.value)
                  }
                />
              </label>
            </div>

            <label className="mt-3 block text-xs text-muted">
              Short description (officers only)
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
              <p className="text-xs text-muted">Profile photo</p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="text-xs"
                  onChange={(e) =>
                    uploadPhoto(i, e.target.files?.[0])
                  }
                />

                {uploading === i ? (
                  <span className="text-xs text-muted">
                    Uploading…
                  </span>
                ) : null}
              </div>

              {member.image ? (
                <p className="mt-2 break-all text-xs text-muted">
                  Current image: {member.image}
                </p>
              ) : null}
            </div>

            <button
              onClick={() => remove(i)}
              className="mt-3 text-xs text-accent hover:underline"
            >
              Remove this person
            </button>
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
          className="rounded-card px-4 py-2 text-sm font-medium text-accent-ink"
          style={{ background: "var(--gradient)" }}
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>

        {status === "saved" ? (
          <span className="text-sm text-accent">
            Saved — site will update shortly.
          </span>
        ) : null}

        {error ? (
          <span className="text-sm text-accent">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
