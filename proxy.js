import { NextResponse } from "next/server";

// CSRF protection: ensure mutating requests to admin API routes originate
// from the same site. This blocks cross-origin form submissions and fetch
// requests from malicious pages.
export function proxy(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // Only check mutating methods
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return NextResponse.next();
  }

  // Allow requests with no origin header (same-origin navigations, curl, etc.)
  if (!origin) {
    return NextResponse.next();
  }

  // Compare origin hostname with the host header
  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return NextResponse.json(
        { error: "Cross-origin requests are not allowed." },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// Support backwards compatibility if Next.js invokes middleware export
export const middleware = proxy;

export const config = {
  matcher: ["/api/admin/:path*"],
};
