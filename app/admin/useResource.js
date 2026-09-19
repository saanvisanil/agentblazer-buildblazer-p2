"use client";

import { useCallback, useEffect, useState } from "react";

// Loads one admin-editable resource (site / team / events) from GitHub via
// our API, and exposes a save() that commits changes back with the right
// sha. Shared by every tab in the admin dashboard.
export default function useResource(resource) {
  const [data, setData] = useState(null);
  const [sha, setSha] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | saving | saved | error
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    const res = await fetch(`/api/admin/content?resource=${resource}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not load content.");
      setStatus("error");
      return;
    }
    const body = await res.json();
    setData(body.data);
    setSha(body.sha);
    setStatus("ready");
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(nextData) {
    setStatus("saving");
    setError("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource, data: nextData, sha }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not save changes.");
      setStatus("error");
      return false;
    }
    const body = await res.json();
    setData(nextData);
    setSha(body.sha);
    setStatus("saved");
    setTimeout(() => setStatus("ready"), 2000);
    return true;
  }

  return { data, setData, status, error, save, reload: load };
}
