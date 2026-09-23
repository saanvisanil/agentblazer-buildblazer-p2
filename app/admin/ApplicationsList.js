"use client";

import { useEffect, useState } from "react";

export default function ApplicationsList() {
  const [subTab, setSubTab] = useState("registrations"); // registrations | applications | messages
  const [applications, setApplications] = useState(null);
  const [registrations, setRegistrations] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((body) => setApplications(body.data || []))
      .catch(() => setError("Could not load applications."));

    fetch("/api/admin/event-registrations")
      .then((res) => res.json())
      .then((body) => setRegistrations(body.data || []))
      .catch(() => setError("Could not load registrations."));

    fetch("/api/admin/contact-messages")
      .then((res) => res.json())
      .then((body) => setMessages(body.data || []))
      .catch(() => setError("Could not load visitor messages."));
  }, []);

  if (error) return <p className="text-sm text-accent">{error}</p>;
  if (!applications || !registrations || !messages) return <p className="text-sm text-muted">Loading submissions…</p>;

  // Unique event titles for filter dropdown
  const eventOptions = Array.from(new Set(registrations.map((r) => r.eventTitle).filter(Boolean)));

  // Filtered registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesEvent = eventFilter === "all" || reg.eventTitle === eventFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (reg.name && reg.name.toLowerCase().includes(q)) ||
      (reg.usn && reg.usn.toLowerCase().includes(q)) ||
      (reg.email && reg.email.toLowerCase().includes(q)) ||
      (reg.department && reg.department.toLowerCase().includes(q));
    return matchesEvent && matchesSearch;
  });

  // Export CSV generator
  function exportCSV() {
    if (!filteredRegistrations.length) return;
    const headers = ["Name", "USN", "Department", "Year", "Email", "Phone", "Event", "Status", "Received Date"];
    const rows = filteredRegistrations.map((r) => [
      `"${r.name || ""}"`,
      `"${r.usn || ""}"`,
      `"${r.department || ""}"`,
      `"${r.year || ""}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.eventTitle || ""}"`,
      `"${r.status || "Registered"}"`,
      `"${new Date(r.receivedAt).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgentBlazer_Registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const inputClass = "rounded-card border border-line bg-bg px-3 py-1.5 text-xs text-ink placeholder:text-muted";

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab("registrations")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              subTab === "registrations" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            Event Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setSubTab("applications")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              subTab === "applications" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            Join Applications ({applications.length})
          </button>
          <button
            onClick={() => setSubTab("messages")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              subTab === "messages" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
            }`}
          >
            Contact Messages ({messages.length})
          </button>
        </div>

        {subTab === "registrations" ? (
          <button
            onClick={exportCSV}
            disabled={!filteredRegistrations.length}
            className="flex items-center gap-1.5 rounded-card border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/40 disabled:opacity-50"
          >
            <span>📥</span> Export CSV
          </button>
        ) : null}
      </div>

      {/* 1. EVENT REGISTRATIONS */}
      {subTab === "registrations" ? (
        <section className="space-y-4">
          {/* Controls: Search & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-3">
            <input
              type="text"
              placeholder="Search by Name, USN, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} min-w-[220px] flex-1`}
            />

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className={inputClass}
            >
              <option value="all">All Events ({registrations.length})</option>
              {eventOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {filteredRegistrations.length ? (
            <div className="overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-bg-soft text-muted">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">USN</th>
                    <th className="px-4 py-3">Department & Year</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredRegistrations.map((reg, idx) => (
                    <tr key={reg.id || idx} className="hover:bg-surface-2">
                      <td className="px-4 py-3 font-medium text-ink">{reg.name}</td>
                      <td className="px-4 py-3 font-mono text-accent">{reg.usn || "N/A"}</td>
                      <td className="px-4 py-3 text-muted">
                        {reg.department || "CSE"} &middot; {reg.year}
                      </td>
                      <td className="px-4 py-3 font-medium text-cyan-300">{reg.eventTitle}</td>
                      <td className="px-4 py-3 text-muted">
                        <div>{reg.email}</div>
                        <div>{reg.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(reg.receivedAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-card border border-line bg-surface p-8 text-center text-muted">
              <p>No event registrations match your filter.</p>
            </div>
          )}
        </section>
      ) : null}

      {/* 2. JOIN APPLICATIONS */}
      {subTab === "applications" ? (
        <section className="space-y-3">
          {applications.length ? (
            <div className="grid gap-3">
              {[...applications].reverse().map((application, index) => (
                <div key={index} className="rounded-card border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-ink">{application.name}</p>
                    <span className="text-xs text-muted">
                      {new Date(application.receivedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-accent">
                    {application.email} &middot; {application.year}
                  </p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{application.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No applications received yet.</p>
          )}
        </section>
      ) : null}

      {/* 3. CONTACT MESSAGES */}
      {subTab === "messages" ? (
        <section className="space-y-3">
          {messages.length ? (
            <div className="grid gap-3">
              {[...messages].reverse().map((message, index) => (
                <div key={`${message.receivedAt}-${index}`} className="rounded-card border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-ink">{message.name}</p>
                    <span className="text-xs text-muted">
                      {new Date(message.receivedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{message.email}</p>
                  <p className="mt-3 whitespace-pre-line text-xs text-muted">{message.text}</p>
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent("AgentBlazer Club — reply")}`}
                    className="mt-3 inline-block rounded-card border border-line px-3 py-1.5 text-xs text-accent hover:bg-surface-2"
                  >
                    Reply by email &rarr;
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No visitor messages received yet.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
