import crypto from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/github";
import { RESOURCES, ROLES } from "@/lib/session";

const FILE = "content/users.json";
const USERNAME = /^[a-z0-9_-]{3,32}$/;

function normalizeUsername(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string") return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function assertUserInput({ username, password, role, permissions = [] }) {
  if (!USERNAME.test(normalizeUsername(username))) throw new Error("Username must be 3–32 lowercase letters, numbers, hyphens, or underscores.");
  if (typeof password !== "string" || password.length < 12) throw new Error("Password must contain at least 12 characters.");
  if (!ROLES.includes(role)) throw new Error("Choose a valid role.");
  if (!Array.isArray(permissions) || permissions.some((item) => !RESOURCES.includes(item))) throw new Error("Choose valid permissions.");
}

export async function readUsers() {
  try {
    return await readJsonFile(FILE);
  } catch (error) {
    if (String(error.message || error).includes("(404)")) return { data: [], sha: undefined };
    throw error;
  }
}

export async function findUser(username) {
  const { data } = await readUsers();
  return data.find((user) => user.username === normalizeUsername(username));
}

export function authenticateBootstrap(username, password) {
  const leaderName = normalizeUsername(process.env.ADMIN_USERNAME || "leader");
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || username !== leaderName) return null;
  const expected = Buffer.from(expectedPassword);
  const provided = Buffer.from(String(password));
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) return null;
  return { username: leaderName, role: "leader" };
}

export function authenticateUser(username, password, user) {
  if (!user || !user.enabled || !verifyPassword(password, user.passwordHash)) return null;
  return { username: user.username, role: user.role, permissions: user.permissions };
}

export async function createUser(input) {
  assertUserInput(input);
  const { data, sha } = await readUsers();
  const username = normalizeUsername(input.username);
  if (data.some((user) => user.username === username)) throw new Error("That username is already in use.");
  const users = [...data, { username, role: input.role, permissions: input.permissions || [], enabled: true, passwordHash: hashPassword(input.password), createdAt: new Date().toISOString() }];
  await writeJsonFile(FILE, users, sha, `Create ${input.role} account for ${username}`);
}

export async function updateUser(username, input) {
  const { data, sha } = await readUsers();
  const target = normalizeUsername(username);
  const index = data.findIndex((user) => user.username === target);
  if (index < 0) throw new Error("Account not found.");
  if (input.role && !ROLES.includes(input.role)) throw new Error("Choose a valid role.");
  if (input.permissions && (!Array.isArray(input.permissions) || input.permissions.some((item) => !RESOURCES.includes(item)))) throw new Error("Choose valid permissions.");
  if (input.password && input.password.length < 12) throw new Error("Password must contain at least 12 characters.");
  const users = data.map((user, i) => i === index ? { ...user, ...(input.role ? { role: input.role } : {}), ...(Array.isArray(input.permissions) ? { permissions: input.permissions } : {}), ...(typeof input.enabled === "boolean" ? { enabled: input.enabled } : {}), ...(input.password ? { passwordHash: hashPassword(input.password) } : {}), updatedAt: new Date().toISOString() } : user);
  await writeJsonFile(FILE, users, sha, `Update account for ${target}`);
}

export async function deleteUser(username) {
  const target = normalizeUsername(username);
  const leaderName = normalizeUsername(process.env.ADMIN_USERNAME || "leader");
  if (target === leaderName) throw new Error("The primary leader account cannot be removed.");
  const { data, sha } = await readUsers();
  const index = data.findIndex((user) => user.username === target);
  if (index < 0) throw new Error("Account not found.");
  const users = data.filter((_, i) => i !== index);
  await writeJsonFile(FILE, users, sha, `Remove account ${target}`);
}

export async function publicUsers() {
  const { data } = await readUsers();
  return data.map(({ passwordHash, ...user }) => ({
    ...user,
    // Existing accounts created before custom permissions retain the access
    // they had until a leader edits their checkboxes.
    permissions: Array.isArray(user.permissions)
      ? user.permissions
      : user.role === "event_editor"
        ? ["events"]
        : user.role === "content_editor"
          ? ["team", "site", "announcements", "achievements"]
          : user.role === "leader"
            ? RESOURCES
            : [],
  }));
}
