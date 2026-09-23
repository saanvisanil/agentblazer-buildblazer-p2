import { readJsonFile, writeJsonFile } from "@/lib/github";
import { getLiveEvents } from "@/lib/content";
import { isEventRegistrationOpen } from "@/lib/eventAccess";
import { createRateLimiter } from "@/lib/rateLimit";
import { encryptData } from "@/lib/crypto";
import fs from "fs/promises";
import pathModule from "path";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\- ]{7,15}$/;
const USN = /^[a-zA-Z0-9-]{5,20}$/;

function clean(value, max) {
  return typeof value === "string" ? value.replace(/[<>]/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
}

const tooManyRequests = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

async function saveRegistration(record) {
  const filePath = "content/event-registrations.json";

  // AES-256 Encrypt PII fields for public repository safety
  const encryptedPayload = encryptData({
    name: record.name,
    email: record.email,
    usn: record.usn,
    phone: record.phone,
    department: record.department,
  });

  const recordToSave = {
    id: record.id,
    eventSlug: record.eventSlug,
    eventTitle: record.eventTitle,
    year: record.year,
    status: record.status || "Registered",
    receivedAt: record.receivedAt,
    encrypted: encryptedPayload,
  };

  // 1. Local disk save
  try {
    const diskPath = pathModule.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
    let list = [];
    try {
      const existing = await fs.readFile(diskPath, "utf-8");
      list = JSON.parse(existing);
    } catch {}
    list.push(recordToSave);
    await fs.mkdir(pathModule.dirname(diskPath), { recursive: true });
    await fs.writeFile(diskPath, JSON.stringify(list, null, 2) + "\n", "utf-8");
  } catch (fsErr) {
    console.error("Local disk registration save error:", fsErr);
  }

  // 2. GitHub repo commit if token is set
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    try {
      let data = [];
      let sha;
      try {
        ({ data, sha } = await readJsonFile(filePath));
      } catch {}
      data.push(recordToSave);
      await writeJsonFile(filePath, data, sha, `Event registration: ${record.eventTitle}`);
    } catch (error) {
      console.error("Could not save event registration to GitHub:", error);
    }
  }
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyRequests(ip)) return Response.json({ error: "Too many submissions. Please wait a few minutes." }, { status: 429 });

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Please submit the form again." }, { status: 400 });
  if (body.website) return Response.json({ ok: true }); // Honeypot trap

  const record = {
    id: `reg-${Date.now()}`,
    eventSlug: clean(body.eventSlug, 100),
    eventTitle: clean(body.eventTitle, 150),
    name: clean(body.name, 80),
    email: clean(body.email, 120),
    usn: clean(body.usn, 20).toUpperCase(),
    department: clean(body.department, 80) || "Computer Science & Engineering",
    year: YEARS.includes(body.year) ? body.year : "",
    phone: clean(body.phone, 15),
    status: "Registered",
    receivedAt: new Date().toISOString(),
  };

  const events = await getLiveEvents();
  const event = events.find((item) => item.slug === record.eventSlug && isEventRegistrationOpen(item));
  if (!event || record.eventTitle !== event.title) return Response.json({ error: "This event is currently unavailable for registration." }, { status: 400 });

  if (record.name.length < 2) return Response.json({ error: "Enter your full name." }, { status: 400 });
  if (!EMAIL.test(record.email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!USN.test(record.usn)) return Response.json({ error: "Enter a valid USN (e.g. 4SO23CS001)." }, { status: 400 });
  if (!record.year) return Response.json({ error: "Choose your year of study." }, { status: 400 });
  if (!PHONE.test(record.phone)) return Response.json({ error: "Enter a valid phone number." }, { status: 400 });

  await saveRegistration(record);
  return Response.json({ ok: true, record: { eventTitle: record.eventTitle, name: record.name } });
}

export const dynamic = "force-dynamic";
