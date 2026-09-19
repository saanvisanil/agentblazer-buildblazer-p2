import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/session";
import { readJsonFile } from "@/lib/github";

// Lists everyone who has applied through the Join & Connect form. The list
// itself lives in content/applications.json, appended to by app/api/contact.
export async function GET(request) {
  if (!isAuthorized(request)) {
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

export const dynamic = "force-dynamic";
