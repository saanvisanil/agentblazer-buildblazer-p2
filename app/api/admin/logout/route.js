import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { csrfError } from "@/lib/csrf";

export async function POST(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

export const dynamic = "force-dynamic";
