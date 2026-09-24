import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile, writeJsonFile } from "@/lib/github";
import { decryptData } from "@/lib/crypto";
import { csrfError } from "@/lib/csrf";

export async function GET(request) {
  if (!isAuthorized(request) || !canAccessResource(request, "applications")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const { data } = await readJsonFile("content/event-registrations.json");
    
    // Decrypt any encrypted PII fields for admin view
    const decrypted = (data || []).map((item) => {
      if (item.encrypted) {
        const payload = decryptData(item.encrypted);
        return typeof payload === "object" ? { ...item, ...payload } : item;
      }
      return item;
    });

    return NextResponse.json({ data: decrypted });
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
    const { data, sha } = await readJsonFile("content/event-registrations.json");
    let filtered;
    if (body.clearAll) {
      filtered = [];
    } else if (body.clearEvent && typeof body.clearEvent === "string") {
      filtered = (data || []).filter((r) => r.eventTitle !== body.clearEvent);
    } else if (body.id) {
      filtered = (data || []).filter((r) => r.id !== body.id);
    } else {
      return NextResponse.json({ error: "Specify id, clearEvent, or clearAll." }, { status: 400 });
    }
    const result = await writeJsonFile("content/event-registrations.json", filtered, sha, "Delete event registrations via admin panel");
    return NextResponse.json({ ok: true, remaining: filtered.length, sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
