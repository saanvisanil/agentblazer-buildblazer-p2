import { NextResponse } from "next/server";

const API = "https://api.github.com";
const ALLOWED_PREFIXES = ["public/images/team/", "public/images/events/"];

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) throw new Error("Image storage is not configured.");
  return { token, repo, branch };
}

function resolvePath(source, repo, branch) {
  if (source.startsWith("/images/team/") || source.startsWith("/images/events/")) return `public${source}`;

  const rawPrefix = `https://raw.githubusercontent.com/${repo}/${branch}/`;
  if (source.startsWith(rawPrefix)) return source.slice(rawPrefix.length);

  return null;
}

function contentType(path) {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

// Keeps GitHub storage private from the browser while making the club's
// selected public profile photos usable in both local development and Vercel.
export async function GET(request) {
  try {
    const source = new URL(request.url).searchParams.get("src");
    if (!source) return NextResponse.json({ error: "Missing image source." }, { status: 400 });

    const { token, repo, branch } = config();
    const path = resolvePath(source, repo, branch);
    if (!path || !ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return NextResponse.json({ error: "Invalid image source." }, { status: 400 });
    }

    const response = await fetch(
      `${API}/repos/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error(`Could not read image (${response.status}).`);

    const file = await response.json();
    const bytes = Buffer.from(file.content, "base64");
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType(path),
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load image." }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
