"use client";

import { useEffect, useState } from "react";

// Three named themes. The chosen one is written to <html data-theme="...">
// and remembered in localStorage. See app/globals.css for the palettes.
const THEMES = [
  { id: "violet", label: "Violet" },
  { id: "inferno", label: "Inferno" },
  { id: "frost", label: "Frost" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState("violet");

  useEffect(() => {
    const saved = window.localStorage.getItem("agentblazer-theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  function choose(id) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    window.localStorage.setItem("agentblazer-theme", id);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => choose(t.id)}
          aria-pressed={theme === t.id}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            theme === t.id ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
