import { createRateLimiter } from "@/lib/rateLimit";
import { readJsonFile, writeJsonFile } from "@/lib/github";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max) => typeof value === "string" ? value.replace(/[<>]/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
const hits = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
let lastCleanup = Date.now();

function limited(ip) {
  const now = Date.now();
  if (now - lastCleanup > RATE_WINDOW_MS) {
    for (const [key, timestamps] of hits) {
      const fresh = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
    lastCleanup = now;
  }
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Please try again." }, { status: 400 });
  if (body.website) return Response.json({ ok: true });
  const message = { name: clean(body.name, 80), email: clean(body.email, 120), text: clean(body.message, 1000), receivedAt: new Date().toISOString() };
  if (message.name.length < 2 || !EMAIL.test(message.email) || message.text.length < 5) return Response.json({ error: "Enter your name, a valid email, and a short message." }, { status: 400 });
  try {
    let data = [];
    let sha;
    try { ({ data, sha } = await readJsonFile("content/contact-messages.json")); } catch {}
    await writeJsonFile("content/contact-messages.json", [...data, message], sha, `New leadership message from ${message.name}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Could not store leadership message", error);
    return Response.json({ error: "Could not save your message. Please try again later." }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
