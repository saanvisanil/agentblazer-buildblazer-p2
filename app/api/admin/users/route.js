import { NextResponse } from "next/server";
import { hasRole, isAuthorized } from "@/lib/session";
import { csrfError } from "@/lib/csrf";
import { createUser, publicUsers, updateUser } from "@/lib/users";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasRole(request, "leader")) {
    return NextResponse.json({ error: "Only the team leader can view admin accounts." }, { status: 403 });
  }

  try {
    return NextResponse.json({ data: await publicUsers() });
  } catch (error) {
    return NextResponse.json({ error: String(error.message || error) }, { status: 500 });
  }
}

export async function POST(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  if (!hasRole(request, "leader")) {
    return NextResponse.json({ error: "Only the team leader can create admin accounts." }, { status: 403 });
  }

  try {
    await createUser({ username: body.username, password: body.password, role: "custom", permissions: body.permissions || [] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error.message || error) }, { status: 400 });
  }
}

export async function PUT(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== "string") {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  if (!hasRole(request, "leader")) {
    return NextResponse.json({ error: "Only the team leader can update admin permissions." }, { status: 403 });
  }

  try {
    const input = {};
    if (typeof body.enabled === "boolean") input.enabled = body.enabled;
    if (Array.isArray(body.permissions)) input.permissions = body.permissions;
    if (typeof body.password === "string") input.password = body.password;
    await updateUser(body.username, input);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error.message || error) }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
