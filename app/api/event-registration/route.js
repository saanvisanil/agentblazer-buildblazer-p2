import { readJsonFile, writeJsonFile } from "@/lib/github";
import { getLiveEvents } from "@/lib/content";
import { isEventRegistrationOpen } from "@/lib/eventAccess";
import { createRateLimiter } from "@/lib/rateLimit";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\- ]{7,15}$/;

function clean(value, max) {
  return typeof value === "string" ? value.replace(/[<>]/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
}

const tooManyRequests = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

async function saveRegistration(registration) {
  if (!process.env.GITHUB_TOKEN) return;
  try {
    let data = []; let sha;
    try { ({ data, sha } = await readJsonFile("content/event-registrations.json")); } catch {}
    data.push(registration);
    await writeJsonFile("content/event-registrations.json", data, sha, `Event registration: ${registration.eventTitle} — ${registration.name}`);
  } catch (error) { console.error("Could not save event registration", error); }
}

async function sendRegistrationEmails(registration) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return;
  const from = process.env.CONTACT_FROM_EMAIL || "AgentBlazer Club <onboarding@resend.dev>";
  const send = (payload) => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  await Promise.allSettled([
    send({ from, to, subject: `Event registration: ${registration.eventTitle}`, text: `${registration.name} (${registration.email}, ${registration.year}, ${registration.phone}) registered for ${registration.eventTitle}.` }),
    send({ from, to: registration.email, subject: `Registration received: ${registration.eventTitle}`, text: `Hi ${registration.name},\n\nYour registration for ${registration.eventTitle} has been received. The AgentBlazer team will share important updates by email.\n\nAgentBlazer Club` }),
  ]);
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyRequests(ip)) return Response.json({ error: "Too many submissions. Please wait a few minutes." }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Please submit the form again." }, { status: 400 });
  if (body.website) return Response.json({ ok: true });
  const registration = { eventSlug: clean(body.eventSlug, 100), eventTitle: clean(body.eventTitle, 150), name: clean(body.name, 80), email: clean(body.email, 120), year: YEARS.includes(body.year) ? body.year : "", phone: clean(body.phone, 15), receivedAt: new Date().toISOString() };
  const events = await getLiveEvents();
  const event = events.find((item) => item.slug === registration.eventSlug && isEventRegistrationOpen(item));
  if (!event || registration.eventTitle !== event.title) return Response.json({ error: "This event is unavailable." }, { status: 400 });
  if (registration.name.length < 2) return Response.json({ error: "Enter your name." }, { status: 400 });
  if (!EMAIL.test(registration.email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!registration.year) return Response.json({ error: "Choose your year." }, { status: 400 });
  if (!PHONE.test(registration.phone)) return Response.json({ error: "Enter a valid phone number." }, { status: 400 });
  await Promise.all([saveRegistration(registration), sendRegistrationEmails(registration)]);
  return Response.json({ ok: true });
}

export const dynamic = "force-dynamic";
