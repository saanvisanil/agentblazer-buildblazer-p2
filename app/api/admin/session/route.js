import { NextResponse } from "next/server";
import { getRequestSession } from "@/lib/session";

export async function GET(request) {
  const session = getRequestSession(request);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ username: session.username, role: session.role, permissions: session.permissions });
}

export const dynamic = "force-dynamic";
