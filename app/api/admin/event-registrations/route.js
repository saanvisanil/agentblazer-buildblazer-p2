import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile } from "@/lib/github";

export async function GET(request) {
  if (!isAuthorized(request) || !canAccessResource(request, "applications")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  try {
    const { data } = await readJsonFile("content/event-registrations.json");
    return NextResponse.json({ data });
  } catch { return NextResponse.json({ data: [] }); }
}

export const dynamic = "force-dynamic";
