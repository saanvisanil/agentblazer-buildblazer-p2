// Signed admin session with user identity and role assignment. The cluster of
// roles prevents a single shared password from being treated as full admin access.
import crypto from "crypto";

const COOKIE_NAME = "agentblazer_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours
export const ROLES = ["leader", "custom", "event_editor", "content_editor", "viewer"];
export const RESOURCES = ["events", "team", "site", "announcements", "achievements", "applications", "users"];

export const ROLE_ACCESS = {
  leader: { resources: ["events", "team", "site", "announcements", "achievements", "applications", "users"], grants: ROLES },
  event_editor: { resources: ["events"], grants: [] },
  content_editor: { resources: ["team", "site", "announcements", "achievements"], grants: [] },
  viewer: { resources: [], grants: [] },
};

function permissionsFor(user) {
  if (user.role === "leader") return RESOURCES;
  if (Array.isArray(user.permissions)) return user.permissions.filter((item) => RESOURCES.includes(item));
  return ROLE_ACCESS[user.role]?.resources || [];
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET must be set for admin login to work.");
  return s;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function canGrantRole(currentRole, targetRole) {
  if (!currentRole || !targetRole) return false;
  if (currentRole !== "leader") return false;
  return ROLES.includes(targetRole);
}

export function createSessionCookie(user) {
  const expiry = Date.now() + MAX_AGE_MS;
  const permissions = permissionsFor(user).join(",") || "-";
  const value = `${expiry}.${user.username}.${user.role}.${permissions}`;
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
  return Boolean(getSession(cookieValue));
}

export function getSession(cookieValue) {
  if (!cookieValue) return null;
  const [expiry, username, role, permissions, signature] = cookieValue.split(".");
  if (!expiry || !username || !role || !permissions || !signature || !ROLES.includes(role)) return null;
  const expected = sign(`${expiry}.${username}.${role}.${permissions}`);
  const provided = Buffer.from(signature, "hex");
  const signed = Buffer.from(expected, "hex");
  if (provided.length !== signed.length || !crypto.timingSafeEqual(provided, signed)) return null;
  if (!Number.isFinite(Number(expiry)) || Date.now() >= Number(expiry)) return null;
  const access = role === "leader" ? RESOURCES : permissions === "-" ? [] : permissions.split(",").filter((item) => RESOURCES.includes(item));
  return { username, role, permissions: access };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// Checks the incoming request's cookie against the session rules above.
// Used by every protected admin API route.
export function isAuthorized(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return isValidSession(cookie?.value);
}

export function getRequestSession(request) {
  return getSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export function hasRole(request, ...roles) {
  const session = getRequestSession(request);
  return Boolean(session && roles.includes(session.role));
}

export function canAccessResource(request, resource) {
  const session = getRequestSession(request);
  if (!session) return false;
  return session.permissions.includes(resource);
}
