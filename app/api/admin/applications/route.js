import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile, writeJsonFile } from "@/lib/github";
import { csrfError } from "@/lib/csrf";

// Lists everyone who has applied through the Join & Connect form. The list
// itself lives in content/applications.json, appended to by app/api/contact.
export async function GET(request) {
  if (!isAuthorized(request) || !canAccessResource(request, "applications")) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  try {
    const { data } = await readJsonFile("content/applications.json");
    return NextResponse.json({ data });
  } catch {
    // File may not exist yet if nobody has applied.
    return NextResponse.json({ data: [] });
  }
}

export async function DELETE(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  if (!isAuthorized(request) || !canAccessResource(request, "applications")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Request body is required." }, { status: 400 });
  }

  try {
    const { data, sha } = await readJsonFile("content/applications.json");
    let filtered;
    if (body.clearAll) {
      filtered = [];
    } else if (typeof body.index === "number") {
      filtered = (data || []).filter((_, i) => i !== body.index);
    } else {
      return NextResponse.json({ error: "Specify index or clearAll." }, { status: 400 });
    }
    const result = await writeJsonFile("content/applications.json", filtered, sha, "Delete applications via admin panel");
    return NextResponse.json({ ok: true, remaining: filtered.length, sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
