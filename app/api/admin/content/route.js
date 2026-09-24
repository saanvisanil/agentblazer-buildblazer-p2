import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile, writeJsonFile } from "@/lib/github";
import { csrfError } from "@/lib/csrf";
import site from "@/content/site.json";
import team from "@/content/team.json";
import events from "@/content/events.json";
import announcements from "@/content/announcements.json";
import achievements from "@/content/achievements.json";

const FILES = {
  site: "content/site.json",
  team: "content/team.json",
  events: "content/events.json",
  announcements: "content/announcements.json",
  achievements: "content/achievements.json",
};

const LOCAL_CONTENT = { site, team, events, announcements, achievements };

// GET /api/admin/content?resource=team|events|site
// Reads straight from GitHub (not the deployed bundle) so the admin panel
// always shows the latest saved version, even if this deployment predates it.
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const resource = new URL(request.url).searchParams.get("resource");
  const path = FILES[resource];
  if (!path) {
    return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
  }
  if (!canAccessResource(request, resource)) {
    return NextResponse.json({ error: "You do not have permission to manage this section." }, { status: 403 });
  }
  try {
    // Admin editors always need the freshest sha to avoid 409 conflicts on save
    const { data, sha } = await readJsonFile(path, { skipCache: true });
    return NextResponse.json({ data, sha });
  } catch (err) {
    // A new content file may not exist in the configured GitHub repository
    // during local development. Keep the editor usable; its first save will
    // create the missing file in that repository.
    if (process.env.NODE_ENV !== "production" && LOCAL_CONTENT[resource]) {
      return NextResponse.json({ data: LOCAL_CONTENT[resource], sha: undefined, localFallback: true });
    }
    return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  }
}

import fs from "fs/promises";
import pathModule from "path";

// PUT /api/admin/content  { resource, data, sha }
// Commits the full updated array/object back to the repo and syncs local disk.
export async function PUT(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !FILES[body.resource]) {
    return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
  }
  if (!canAccessResource(request, body.resource)) {
    return NextResponse.json({ error: "You do not have permission to update this section." }, { status: 403 });
  }
  const filePath = FILES[body.resource];

  // 1. Always update local disk copy for instant local availability
  try {
    const fullLocalPath = pathModule.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
    await fs.mkdir(pathModule.dirname(fullLocalPath), { recursive: true });
    await fs.writeFile(fullLocalPath, JSON.stringify(body.data, null, 2) + "\n", "utf-8");
  } catch (fsErr) {
    console.error("Local disk save warning:", fsErr);
  }

  // 2. Commit to GitHub repo
  try {
    let result = await writeJsonFile(
      filePath,
      body.data,
      body.sha,
      `Update ${body.resource} via admin panel`
    );
    if (!result?.sha) throw new Error("GitHub did not return a new file version.");
    return NextResponse.json({ ok: true, sha: result.sha });
  } catch (err) {
    if (String(err.message || err).includes("(409)")) {
      try {
        const { sha: latestSha } = await readJsonFile(filePath);
        const { sha } = await writeJsonFile(
          filePath,
          body.data,
          latestSha,
          `Retry update ${body.resource} via admin panel`
        );
        return NextResponse.json({ ok: true, sha, retried: true });
      } catch (retryError) {
        // Fall back gracefully in dev mode if GitHub token is invalid/expired
        if (process.env.NODE_ENV !== "production") {
          return NextResponse.json({ ok: true, sha: "local-dev", localFallback: true });
        }
        return NextResponse.json({ error: String(retryError.message || retryError) }, { status: 502 });
      }
    }
    // In local dev, return success if disk write succeeded even if GitHub API errored
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, sha: "local-dev", localFallback: true });
    }
    return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
