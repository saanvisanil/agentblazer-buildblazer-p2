import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/session";

// One shared password for the club's admin (set as ADMIN_PASSWORD). Good
// enough for a single-team hackathon deliverable; a real multi-admin system
// would use per-person accounts instead.
export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured on the server." },
      { status: 500 }
    );
  }
  if (typeof password !== "string" || password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookie = createSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}

export const dynamic = "force-dynamic";
