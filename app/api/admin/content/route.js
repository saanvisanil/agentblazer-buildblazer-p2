import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/session";
import { readJsonFile, writeJsonFile } from "@/lib/github";

const FILES = {
  site: "content/site.json",
  team: "content/team.json",
  events: "content/events.json",
};

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
  try {
    const { data, sha } = await readJsonFile(path);
    return NextResponse.json({ data, sha });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  }
}

// PUT /api/admin/content  { resource, data, sha }
// Commits the full updated array/object back to the repo.
export async function PUT(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !FILES[body.resource]) {
    return NextResponse.json({ error: "Unknown resource." }, { status: 400 });
  }
  const path = FILES[body.resource];
  try {
    const { sha } = await writeJsonFile(
      path,
      body.data,
      body.sha,
      `Update ${body.resource} via admin panel`
    );
    return NextResponse.json({ ok: true, sha });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
