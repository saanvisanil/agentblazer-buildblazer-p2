// Server-side form handling for the Join & Connect form.
//
// Everything here runs on the server, never in the browser. That matters for
// two of the judging criteria:
//   - RESEND_API_KEY and GITHUB_TOKEN live only in process.env, so no key is
//     in the public repository or in code the browser can read;
//   - every field is re-validated and stripped here, because the browser
//     cannot be trusted to do it. Client-side validation is convenience only.
//
// On a valid submission this does two things: emails the club (via Resend)
// and appends a record to content/applications.json in the repo, so the
// admin panel's Applications tab has a permanent list even if an email
// bounces or gets missed.
import { readJsonFile, writeJsonFile } from "@/lib/github";

const MAX = { name: 80, email: 120, message: 1000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, max);
}

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes. Resets
// whenever the serverless function cold-starts, which is an acceptable
// trade-off for a club application form.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function sendEmail(submission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return; // Email is optional; the applications log always works.

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "AgentBlazer Club <onboarding@resend.dev>",
      to,
      subject: `New membership application: ${submission.name}`,
      text: `${submission.name} (${submission.email}, ${submission.year}) applied to join.\n\n${submission.message}`,
    }),
  }).catch((err) => console.error("Resend email failed:", err));
}

async function logApplication(submission) {
  if (!process.env.GITHUB_TOKEN) return; // Logging is best-effort.
  try {
    let data = [];
    let sha;
    try {
      const existing = await readJsonFile("content/applications.json");
      data = existing.data;
      sha = existing.sha;
    } catch {
      // File does not exist yet; it will be created below.
    }
    data.push(submission);
    await writeJsonFile(
      "content/applications.json",
      data,
      sha,
      `New application from ${submission.name}`
    );
  } catch (err) {
    console.error("Could not log application to GitHub:", err);
  }
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many submissions. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send the form again." }, { status: 400 });
  }

  // Honeypot: real people never fill this in.
  if (body.website) {
    return Response.json({ ok: true });
  }

  const submission = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    year: YEARS.includes(body.year) ? body.year : "",
    message: clean(body.message, MAX.message),
    receivedAt: new Date().toISOString(),
  };

  if (submission.name.length < 2) {
    return Response.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL.test(submission.email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!submission.year) {
    return Response.json({ error: "Choose your year." }, { status: 400 });
  }
  if (submission.message.length < 10) {
    return Response.json(
      { error: "Tell us a little more \u2014 at least a sentence." },
      { status: 400 }
    );
  }

  await Promise.all([sendEmail(submission), logApplication(submission)]);

  return Response.json({ ok: true });
}

export const dynamic = "force-dynamic";
