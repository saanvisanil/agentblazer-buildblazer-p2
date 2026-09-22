import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/session";
import { authenticateBootstrap, authenticateUser, findUser } from "@/lib/users";
import { csrfError } from "@/lib/csrf";

const loginHits = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX = 10; // 10 attempts per 15 min
let lastLoginCleanup = Date.now();

function loginLimited(ip) {
  const now = Date.now();
  if (now - lastLoginCleanup > LOGIN_WINDOW_MS) {
    for (const [key, timestamps] of loginHits) {
      const fresh = timestamps.filter((t) => now - t < LOGIN_WINDOW_MS);
      if (fresh.length === 0) loginHits.delete(key);
      else loginHits.set(key, fresh);
    }
    lastLoginCleanup = now;
  }
  const recent = (loginHits.get(ip) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  recent.push(now);
  loginHits.set(ip, recent);
  return recent.length > LOGIN_MAX;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (loginLimited(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429 }
    );
  }
  const csrf = csrfError(request);
  if (csrf) return csrf;
  const { username, password } = await request.json().catch(() => ({}));

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const bootstrap = authenticateBootstrap(username, password);
  if (bootstrap) {
    const cookie = createSessionCookie(bootstrap);
    const res = NextResponse.json({ ok: true, role: bootstrap.role });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  }

  const user = await findUser(username);
  const session = authenticateUser(username, password, user);
  if (!session) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const cookie = createSessionCookie(session);
  const res = NextResponse.json({ ok: true, role: session.role });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}

export const dynamic = "force-dynamic";
