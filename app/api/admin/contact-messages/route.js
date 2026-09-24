import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile, writeJsonFile } from "@/lib/github";
import { csrfError } from "@/lib/csrf";

// Private visitor messages from the chatbot. They are intentionally only
// available to administrators who can view applications and registrations.
export async function GET(request) {
  if (!isAuthorized(request) || !canAccessResource(request, "applications")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  try {
    const { data } = await readJsonFile("content/contact-messages.json");
    return NextResponse.json({ data: Array.isArray(data) ? data : [] });
  } catch {
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
    const { data, sha } = await readJsonFile("content/contact-messages.json");
    let filtered;
    if (body.clearAll) {
      filtered = [];
    } else if (typeof body.index === "number") {
      filtered = (data || []).filter((_, i) => i !== body.index);
    } else {
      return NextResponse.json({ error: "Specify index or clearAll." }, { status: 400 });
    }
    const result = await writeJsonFile("content/contact-messages.json", filtered, sha, "Delete contact messages via admin panel");
    return NextResponse.json({ ok: true, remaining: filtered.length, sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
