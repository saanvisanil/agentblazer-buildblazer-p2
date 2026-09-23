import { readJsonFile, writeJsonFile } from "@/lib/github";
import fs from "fs/promises";
import pathModule from "path";

const FILE = "content/activity.json";

export async function logActivity(user, action, target) {
  const entry = {
    id: `act-${Date.now()}`,
    user: user || "Admin",
    action,
    target,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. Local disk update
    const diskPath = pathModule.join(/*turbopackIgnore: true*/ process.cwd(), FILE);
    let activities = [];
    try {
      const existing = await fs.readFile(diskPath, "utf-8");
      activities = JSON.parse(existing);
    } catch {}
    activities = [entry, ...activities].slice(0, 100);
    await fs.mkdir(pathModule.dirname(diskPath), { recursive: true });
    await fs.writeFile(diskPath, JSON.stringify(activities, null, 2) + "\n", "utf-8");

    // 2. Commit to GitHub repo if configured
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      let data = [];
      let sha;
      try {
        ({ data, sha } = await readJsonFile(FILE));
      } catch {}
      const updated = [entry, ...(data || [])].slice(0, 100);
      await writeJsonFile(FILE, updated, sha, `Log activity: ${action} by ${user}`);
    }
  } catch (error) {
    console.error("Activity logging error:", error);
  }
}

export async function getActivityLogs() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const diskPath = pathModule.join(/*turbopackIgnore: true*/ process.cwd(), FILE);
      const content = await fs.readFile(diskPath, "utf-8");
      return JSON.parse(content);
    }
    const { data } = await readJsonFile(FILE);
    return data || [];
  } catch {
    return [];
  }
}
