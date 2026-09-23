import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/session";
import { getActivityLogs } from "@/lib/activity";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const logs = await getActivityLogs();
  return NextResponse.json({ data: logs });
}

export const dynamic = "force-dynamic";
