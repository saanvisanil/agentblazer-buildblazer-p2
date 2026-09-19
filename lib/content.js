// Every page reads its content from the JSON files in /content. The admin
// panel (see app/admin) edits these same files by committing to GitHub, so
// nothing on the site is ever typed directly into a page file.
import site from "@/content/site.json";
import events from "@/content/events.json";
import team from "@/content/team.json";

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
  return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getUpcomingEvents() {
  return getEvents()
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getPastEvents() {
  return getEvents().filter((e) => e.status !== "upcoming");
}

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
