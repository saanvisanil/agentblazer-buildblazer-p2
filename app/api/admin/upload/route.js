import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/session";
import { csrfError } from "@/lib/csrf";
import fs from "fs/promises";
import pathModule from "path";

const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO must be configured.");
  }

  return { token, repo, branch };
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function POST(request) {
  const csrf = csrfError(request);
  if (csrf) return csrf;
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Not signed in." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const type = formData.get("type");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No image file was provided." },
        { status: 400 }
      );
    }

    if (type !== "team" && type !== "events") {
      return NextResponse.json(
        { error: "Invalid upload type." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WebP images are allowed." },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Each image must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    const safeName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    // Actual file location inside the repository.
    const path = `public/images/${type}/${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Always save file locally for instant local availability
    try {
      const diskPath = pathModule.join(/*turbopackIgnore: true*/ process.cwd(), path);
      await fs.mkdir(pathModule.dirname(diskPath), { recursive: true });
      await fs.writeFile(diskPath, buffer);
    } catch (fsErr) {
      console.error("Local disk image save warning:", fsErr);
    }

    const imageUrl = `/images/${type}/${safeName}`;

    // 2. Upload to GitHub repository if configured
    try {
      const content = buffer.toString("base64");
      const { token, repo, branch } = getConfig();

      const response = await fetch(
        `${GITHUB_API}/repos/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            ...githubHeaders(token),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Add ${type} image: ${safeName}`,
            content,
            branch,
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        console.error(`GitHub upload warning (${response.status}): ${body}`);
      }
    } catch (githubErr) {
      console.error("GitHub upload error:", githubErr);
      if (process.env.NODE_ENV === "production") {
        throw githubErr;
      }
    }

    return NextResponse.json({
      ok: true,
      path: imageUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: error.message || "Image upload failed." },
      { status: 500 }
    );
  }
}
