// Every page reads its content from the JSON files in /content. The admin
// panel (see app/admin) edits these same files by committing to GitHub, so
// nothing on the site is ever typed directly into a page file.
import site from "@/content/site.json";
import events from "@/content/events.json";
import team from "@/content/team.json";
import announcements from "@/content/announcements.json";
import achievements from "@/content/achievements.json";

export function getSite() {
  return site;
}

export function getTeam() {
  return team;
}

export function getTeamByGroup(group) {
  return team.filter((m) => m.group === group);
}

export function getEvents() {
  return [...events]
    .filter((event) => event && typeof event === "object" && event.slug)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function getLiveEvents() {
  if (process.env.NODE_ENV !== "production") return getEvents();
  try {
    const { readJsonFile } = await import("@/lib/github");
    const { data } = await readJsonFile("content/events.json");
    return [...data]
      .filter((event) => event && typeof event === "object" && event.slug)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } catch {
    return getEvents();
  }
}

export function getAnnouncements() {
  return [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getLiveAnnouncements() {
  try {
    const { readJsonFile } = await import("@/lib/github");
    const { data } = await readJsonFile("content/announcements.json");
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    // A deployment can temporarily run before its content commit is visible.
    // Keep the public page available with the bundled announcements.
    return getAnnouncements();
  }
}

export function getAchievements() {
  return [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getLiveAchievements() {
  try {
    const { readJsonFile } = await import("@/lib/github");
    const { data } = await readJsonFile("content/achievements.json");
    return [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return getAchievements();
  }
}

export function getUpcomingEvents() {
  return getEvents()
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getPastEvents() {
  return getEvents().filter((e) => e.status !== "upcoming");
}

export async function getLiveUpcomingEvents() {
  const events = await getLiveEvents();
  return events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function getLivePastEvents() {
  const events = await getLiveEvents();
  return events.filter((e) => e.status !== "upcoming");
}

export { isEventRegistrationOpen } from "./eventAccess";

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getLiveTeam() {
  try {
    const { readJsonFile } = await import("@/lib/github");
    const { data } = await readJsonFile("content/team.json");
    return data;
  } catch (error) {
    // The public page should still render during local development or a
    // temporary GitHub outage; the checked-in content is the fallback.
    console.error("Could not load live team content:", error);
    return getTeam();
  }
}

export async function getLiveTeamByGroup(group) {
  const team = await getLiveTeam();
  return team.filter((m) => m.group === group);
}
