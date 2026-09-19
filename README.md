# AgentBlazer Club — Build Blazer (Phase 2)

Live implementation of the AgentBlazer Club site, matching the reference
design (video walkthrough) and adding the required backend: a working,
validated Join form and a no-code admin panel for events/team/site content.

**Live link:** _add once deployed_

## Does it work? Yes — verified before handoff

`npm run build` completes with zero errors and all 9 routes compile (5 pages
+ 4 API routes), on the exact code in this zip. That said, two pieces only
work once you add your own free-tier credentials (steps below):

| Feature | Works out of the box? |
|---|---|
| All 5 pages, theme toggle, responsive layout | Yes, immediately |
| Join form validation + spam protection | Yes, immediately |
| Join form **emailing** the club | Only after you add a Resend API key |
| Join form **logging to the admin panel** | Only after you add a GitHub token |
| `/admin` login and editing | Only after you set `ADMIN_PASSWORD` + `SESSION_SECRET` + GitHub token |

Without those env vars, the site still runs and looks complete — the admin
page will just show a config error instead of your content, and the contact
form will silently skip emailing/logging (it still validates and returns
success to the visitor). This is intentional: it means a partial setup never
breaks the public pages, which is what judges will look at first.

## Run it locally — step by step

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
# 1. Unzip and enter the folder
cd agentblazer-buildblazer

# 2. Install dependencies (only needs to be done once)
npm install

# 3. Copy the environment template
cp .env.example .env.local
# open .env.local and fill in at least ADMIN_PASSWORD and SESSION_SECRET
# to try the admin panel locally (see "Environment variables" below)

# 4. Start it
npm run dev
```

Open **http://localhost:3000** — that's the real site running on your
machine. Leave the terminal open; `Ctrl+C` stops the server.

If `npm install` or `npm run dev` errors, it's almost always one of:
- Node.js not installed / too old → check with `node -v`, need 18+
- Wrong folder → make sure `package.json` is in the current directory
- Port 3000 already used → `npm run dev -- -p 3001` and open that port instead

## Environment variables

Copy `.env.example` to `.env.local` for local dev, and add the same
key/value pairs on Vercel under **Settings → Environment Variables** before
deploying — `.env.local` itself is git-ignored and never gets pushed.

| Variable | Required for | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | `/admin` login | Any password your team agrees on |
| `SESSION_SECRET` | `/admin` login | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GITHUB_TOKEN` | `/admin` saving, application logging | Fine-grained token, scoped to this one repo only, "Contents: Read and write" permission. Create at github.com/settings/tokens?type=beta |
| `GITHUB_REPO` | same as above | `AgentBlazer/agentblazer-buildblazer` |
| `RESEND_API_KEY` | emailing on form submit | Free at resend.com; optional — logging still works without it |
| `CONTACT_TO_EMAIL` | emailing on form submit | Where applications get emailed |
| `NEXT_PUBLIC_SITE_URL` | SEO tags, sitemap | Your Vercel URL once deployed |

## Deploying (making it live, as the rulebook requires)

1. Push this code to your fork of `agentblazer-buildblazer` on GitHub.
2. Go to vercel.com → **Add New Project** → import that repo. Next.js is
   auto-detected; no config needed.
3. Before the first deploy (or right after, then redeploy), add every
   variable from the table above under **Settings → Environment Variables**.
4. Deploy. Vercel gives you a live `.vercel.app` URL — put it at the top of
   this README and in `NEXT_PUBLIC_SITE_URL`.
5. From then on: every `git push`, and every save from `/admin`, triggers a
   new automatic deploy.

## Project structure

```
app/                 One folder per page; page.js is what the visitor sees
  page.js            Home
  about/page.js       About Us (guests, faculty, officers, committee)
  events/page.js       Events & Workshops
  join/page.js         Join & Connect
  admin/               Password-protected content dashboard (client-side)
  api/contact/         Validates + emails + logs Join form submissions
  api/admin/           Login, logout, content read/write, applications list
  layout.js            Shared shell: nav, footer, theme boot script, SEO tags
  globals.css          Design tokens for all three themes
components/          Reusable UI: Nav, Footer, Button, Logo, ThemeToggle,
                     GalleryCard, TeamCard, StatCard, Eyebrow, JoinForm
content/             All editable site content (JSON) — the "database"
lib/
  content.js          Reads content/*.json for the public pages
  github.js           Reads/writes content/*.json in GitHub for the admin
  session.js          Signed-cookie auth for /admin
public/images/       Logo, event photos, team photos (swap in the real ones)
```

## How the backend satisfies the rulebook's technical standards

- **Modular code** — every page is assembled from `components/`; nothing is
  duplicated between pages.
- **No leaked keys** — `GITHUB_TOKEN`, `RESEND_API_KEY`, and `ADMIN_PASSWORD`
  are read from `process.env` only inside files under `app/api/` and
  `lib/`, which run exclusively on the server. Nothing secret reaches the
  browser bundle.
- **Safe input fields** — `app/api/contact/route.js` re-validates every field
  server-side (never trusts the browser), strips angle brackets and control
  characters, caps lengths, restricts year to a known list, rate-limits by
  IP, and uses a honeypot field against bots.
- **Easy content updates** — `/admin`, see CONTENT-GUIDE.md. No code, no
  local setup, works from any browser.
- **Event data loads automatically** — `lib/content.js` reads
  `content/events.json` at build time; nothing is hardcoded into a page.
- **Performance & SEO** — every page is static HTML (see the build output:
  `○` marks static routes); `app/layout.js` sets metadata site-wide,
  `app/sitemap.js` and `app/robots.js` are generated automatically.

Only `Nav`, `ThemeToggle`, `JoinForm`, `GalleryCard`, `TeamCard`, and the
`admin/*` files say `"use client"` — everything else renders on the server,
which is the one Next.js concept worth being able to explain to judges: it's
why the pages are static and fast, while the interactive pieces (theme
switch, hover galleries, the form, the dashboard) still work in the browser.

## Known gaps to fill before submission

- **Colors/fonts are an approximation.** I matched the Violet/Inferno/Frost
  palettes by eye from your walkthrough video — swap in exact values in
  `app/globals.css` (`:root`, `[data-theme="inferno"]`, `[data-theme="frost"]`)
  once you have the real Figma or brand spec.
- **Photos are placeholders.** Drop real files into `public/images/events/`
  and `public/images/team/`, then update the `image`/`images` paths in
  `content/events.json` and `content/team.json` (or do this from `/admin`
  once photos are hosted somewhere with a URL).
- **Display font** uses a system serif fallback so the build never depends
  on network access. To get the exact look, add two lines to
  `app/layout.js`:
  ```js
  import { Fraunces } from "next/font/google";
  const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
  // then add fraunces.variable to the <html className>
  ```
