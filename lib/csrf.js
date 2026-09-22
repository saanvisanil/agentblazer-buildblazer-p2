export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export function csrfError(request) {
  return isSameOriginRequest(request)
    ? null
    : Response.json({ error: "Invalid request origin." }, { status: 403 });
}
