// Minimal signed-cookie session for the single-admin login. No database, no
// extra dependency: the cookie's value is "<expiry>.<hmac>", and the HMAC is
// computed with a server-only secret, so a visitor cannot forge or extend a
// session without knowing SESSION_SECRET.
import crypto from "crypto";

const COOKIE_NAME = "agentblazer_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET must be set for admin login to work.");
  return s;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionCookie() {
  const expiry = Date.now() + MAX_AGE_MS;
  const value = `${expiry}`;
  const signature = sign(value);
  return {
    name: COOKIE_NAME,
    value: `${value}.${signature}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_MS / 1000,
    },
  };
}

export function isValidSession(cookieValue) {
  if (!cookieValue) return false;
  const [expiry, signature] = cookieValue.split(".");
  if (!expiry || !signature) return false;
  if (sign(expiry) !== signature) return false;
  return Date.now() < Number(expiry);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// Checks the incoming request's cookie against the session rules above.
// Used by every protected admin API route.
export function isAuthorized(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return isValidSession(cookie?.value);
}
