// Server-only helper that reads and writes JSON files directly in the site's
// GitHub repository, using the GitHub Contents API. This is the whole
// "backend": there is no separate database. When the admin panel saves a
// change, it commits a new version of the file here; GitHub notifies Vercel,
// which rebuilds and republishes the site automatically.
//
// GITHUB_TOKEN must be a fine-grained personal access token scoped only to
// this repository, with just "Contents: Read and write" permission. It is
// read from process.env on the server and is never sent to the browser.

const API = "https://api.github.com";

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "AgentBlazer/agentblazer-buildblazer"
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error(
      "GITHUB_TOKEN and GITHUB_REPO must be set for the admin panel to read or save content."
    );
  }
  return { token, repo, branch };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Reads a JSON file from the repo. Returns { data, sha } so callers can pass
// the sha back in when updating (GitHub requires this to prevent overwriting
// someone else's concurrent change).
export async function readJsonFile(path) {
  const { token, repo, branch } = config();
  const res = await fetch(
    `${API}/repos/${repo}/contents/${path}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`Could not read ${path} from GitHub (${res.status})`);
  }
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(content), sha: json.sha };
}

// Writes a JSON file back to the repo as a new commit.
export async function writeJsonFile(path, data, sha, message) {
  const { token, repo, branch } = config();
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64");

  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message || `Update ${path} via admin panel`,
      content,
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Could not save ${path} to GitHub (${res.status}): ${body}`);
  }
  const json = await res.json();
  return { sha: json.content.sha };
}
