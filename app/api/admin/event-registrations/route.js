import { NextResponse } from "next/server";
import { canAccessResource, isAuthorized } from "@/lib/session";
import { readJsonFile } from "@/lib/github";
import { decryptData } from "@/lib/crypto";

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

export const dynamic = "force-dynamic";
