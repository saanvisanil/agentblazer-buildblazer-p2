import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile } from "@/lib/github";

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

export const dynamic = "force-dynamic";
