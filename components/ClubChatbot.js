"use client";

import { useState } from "react";

const starters = ["How do I join?", "What events are coming up?", "Talk to the club leader"];

function replyFor(question) {
  const query = question.toLowerCase();

  if (/(join|member|membership|apply|register)/.test(query)) {
    return { text: "You can become part of AgentBlazer through our membership form. It is the best place to share your interests and get connected with the team.", href: "/join", label: "Open Join & Connect" };
  }
  if (/(event|workshop|contest|session|coming)/.test(query)) {
    return { text: "Our workshops, contests, and masterclasses are listed on the Events page. Check there for the latest details and registrations.", href: "/events", label: "View Events & Workshops" };
  }
  if (/(leader|president|person|direct|talk)/.test(query)) {
    return { text: "I can send your message directly to the AgentBlazer leadership team. Please use the form below.", contactForm: true };
  }
  if (/(about|agentblazer|club|what)/.test(query)) {
    return { text: "AgentBlazer is the student-led AI community at SJEC CSE. We explore autonomous agents, open-source AI tooling, hands-on workshops, and collaborative projects.", href: "/about", label: "Read our charter" };
  }
  if (/(contact|email|reach|hello)/.test(query)) {
    return { text: "You can reach the team at agentblazer@sjec.ac.in. We would be glad to hear from you.", href: "mailto:agentblazer@sjec.ac.in", label: "Email AgentBlazer" };
  }
  return { text: "I can help with joining the club, upcoming events, what AgentBlazer does, or contacting the team. Try one of the suggestions below." };
}

export default function ClubChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", message: "", website: "" });
  const [contactStatus, setContactStatus] = useState("idle");
  const [contactError, setContactError] = useState("");

  function ask(rawQuestion) {
    const question = rawQuestion.trim();
    if (!question) return;
    setMessages((current) => [...current, { role: "user", text: question }, { role: "bot", ...replyFor(question) }]);
    setInput("");
  }

  function submit(event) {
    event.preventDefault();
    ask(input);
  }

  async function sendLeadershipMessage(event) {
    event.preventDefault();
    setContactStatus("sending"); setContactError("");
    try {
      const response = await fetch("/api/contact-leader", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contact) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not send your message.");
      setContactStatus("sent"); setContact({ name: "", email: "", message: "", website: "" });
    } catch (error) { setContactStatus("error"); setContactError(error.message || "Could not send your message."); }
  }

  return (
    <aside className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3" aria-label="AgentBlazer chat assistant">
      {open ? (
        <section className="w-[min(23rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/30">
          <header className="flex items-center justify-between border-b border-line bg-bg-soft px-4 py-3">
            <div>
              <p className="text-sm font-semibold">AgentBlazer Assistant</p>
              <p className="text-xs text-muted">Club guide · usually instant</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Close chat">×</button>
          </header>

          <div className="max-h-80 min-h-52 space-y-3 overflow-y-auto p-4 text-sm">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-accent-soft px-3 py-2.5 text-ink">
              Hi! I’m the AgentBlazer guide. What would you like to know?
            </div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[var(--accent)] px-3 py-2.5 text-white" : "max-w-[90%] rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2.5 text-ink"}>
                <p>{message.text}</p>
                {message.href ? <a href={message.href} className="mt-2 inline-block text-xs font-medium text-[var(--accent-2)] underline underline-offset-2">{message.label} →</a> : null}
                {message.contactForm ? <form onSubmit={sendLeadershipMessage} className="mt-3 grid gap-2"><input required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} placeholder="Your name" className="rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-ink" /><input required type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="Your email" className="rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-ink" /><textarea required rows={3} maxLength={1000} value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="Your message" className="rounded-lg border border-line bg-bg px-2.5 py-2 text-xs text-ink" /><input tabIndex={-1} autoComplete="off" value={contact.website} onChange={(event) => setContact({ ...contact, website: event.target.value })} className="hidden" /><button disabled={contactStatus === "sending"} className="rounded-lg px-3 py-2 text-xs font-medium text-white" style={{ background: "var(--gradient)" }}>{contactStatus === "sending" ? "Sending…" : "Send to leadership"}</button>{contactStatus === "sent" ? <p className="text-xs text-emerald-400">Your message has been saved for the leadership team.</p> : null}{contactError ? <p className="text-xs text-accent">{contactError}</p> : null}</form> : null}
              </div>
            ))}
          </div>

          <div className="border-t border-line p-3">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {starters.map((starter) => <button key={starter} type="button" onClick={() => ask(starter)} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-[var(--accent)] hover:text-ink">{starter}</button>)}
            </div>
            <form onSubmit={submit} className="flex gap-2">
              <label className="sr-only" htmlFor="club-chat-question">Ask AgentBlazer</label>
              <input id="club-chat-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-[var(--accent)] focus:outline-none" />
              <button type="submit" className="rounded-xl px-3 py-2 text-sm font-medium text-white" style={{ background: "var(--gradient)" }}>Send</button>
            </form>
          </div>
        </section>
      ) : null}

      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40" style={{ background: "var(--gradient)" }}>
        <span aria-hidden="true">✦</span>{open ? "Close chat" : "Ask AgentBlazer"}
      </button>
    </aside>
  );
}
