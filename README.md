# AgentBlazer Club — Build Blazer (Phase 2)

Live implementation of the **AgentBlazer Club** official website for the Build Blazer competition track at St Joseph Engineering College (SJEC), Mangaluru. Built with Next.js 16 (App Router & Turbopack), Tailwind CSS, and GitHub-as-CMS architecture.

**Live Website Link:** [https://agentblazer-buildblazer-p2.vercel.app](https://agentblazer-buildblazer-p2.vercel.app)

---

## 👥 Team Information

| Role | Name / Details |
|---|---|
| **Repository Fork** | `saanvisanil/agentblazer-buildblazer-p2` |
| **Institution** | St Joseph Engineering College (SJEC), Mangaluru |
| **Department** | Department of Computer Science & Engineering |
| **Academic Track** | AgentBlazer Build Blazer Track (Academic Year 2025-2026) |

---

## 🚀 Key Features Implemented (Phases 1 – 5)

| Feature | Description | Status |
|---|---|---|
| 📢 **Live Announcement CMS** | Top header banner (`components/AnnouncementBar.js`) with active badges (`REGISTRATION OPEN`), message titles, and direct action links. Managed via Admin CMS. | ✅ Completed |
| 📅 **Dynamic Event Pages** | Dedicated pages (`/events/[slug]`) featuring event category tags, date/time, gallery posters, eligibility details, and registration status. | ✅ Completed |
| 📝 **Private Event Registration** | Student event intake form capturing Name, College Email, USN, Department, Year, and Phone. | ✅ Completed |
| 🔒 **AES-256 Student PII Protection** | Student registration data (USN, Email, Phone, Name) is encrypted server-side using **AES-256-GCM** before saving to `content/event-registrations.json`, preventing data exposure on public GitHub repos. | ✅ Completed |
| 📥 **Export CSV for Admin** | One-click **Export CSV** button in the Admin Dashboard under Registrations to download formatted student event lists for check-ins. | ✅ Completed |
| 🏆 **Milestone Timeline Page** | Interactive visual timeline (`/achievements`) grouped by year (`OUR JOURNEY`) with detailed modal inspection. | ✅ Completed |
| 🔗 **Multi-Platform Event Share** | Share modal with native Web Share API support and direct links for **WhatsApp, LinkedIn, Email, and Copy Link**. | ✅ Completed |
| 📊 **Admin Overview Dashboard** | Overview dashboard with summary KPI cards, action alerts (Registrations, Intake Applications, Visitor Messages), and audit log stream. | ✅ Completed |
| 👥 **Team Management** | Custom display ordering (President = 1, Vice President = 2...) and Archive toggle for historic leadership records. | ✅ Completed |
| 📅 **Event Lifecycle Management** | Rich status dropdown (`Draft`, `Published`, `Registration Open`, `Registration Closed`, `Completed`, `Archived`) and registration deadlines. | ✅ Completed |
| 📋 **Audit Activity Log** | Server-side logging of all admin actions (`lib/activity.js`, `content/activity.json`) with audit trail tab. | ✅ Completed |
| 🛡️ **Next.js 16 Security & CSRF** | Next.js 16 `proxy.js` CSRF origin protection, IP rate limiting, honeypot spam protection, and timing-safe password verification. | ✅ Completed |
| 📱 **Mobile Optimization** | Mobile inline card image previews and touch-friendly toggle support for mobile screens. | ✅ Completed |

---

## 🛠️ Run Locally — Step by Step

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
# 1. Clone your fork
git clone https://github.com/saanvisanil/agentblazer-buildblazer-p2.git
cd agentblazer-buildblazer-p2

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open **http://localhost:3000** — the site will run on your machine.

---

## 🔐 Environment Variables

Add these environment variables in Vercel under **Settings → Environment Variables**:

| Variable | Required for | Notes |
|---|---|---|
| `ADMIN_USERNAME` | `/admin` login | Bootstrap leader username (defaults to `leader`) |
| `ADMIN_PASSWORD` | `/admin` login | Your secure admin login password |
| `SESSION_SECRET` | `/admin` login | AES-256 encryption key and signed cookie secret |
| `GITHUB_TOKEN` | `/admin` CMS saving | Fine-grained token scoped to this repo with "Contents: Read and write" |
| `GITHUB_REPO` | `/admin` CMS saving | `saanvisanil/agentblazer-buildblazer-p2` |
| `GITHUB_BRANCH` | `/admin` CMS saving | `main` |
| `CONTACT_TO_EMAIL` | Form submissions | Destination email for visitor & contact messages |
| `NEXT_PUBLIC_SITE_URL` | SEO & OpenGraph | Live URL (`https://agentblazer-buildblazer-p2.vercel.app`) |

---

## 📁 Project Structure

```
app/                 App Router pages
  page.js            Home Page (Hero, AnnouncementBar, StatCards, Core emblem)
  about/page.js       About Us (Guests, Faculty Advisory Council, Student Core Team)
  achievements/      Milestone Timeline Page (Interactive OUR JOURNEY timeline)
  events/            Events & Workshops list page
    [slug]/          Dynamic Event Detail Page
      register/      Event Registration Form
  join/page.js         Membership Intake & Contact Page
  admin/               Password-protected Admin Dashboard (Overview, Events, Team, Announcements, Timeline, Registrations, Activity Log, Access)
  api/
    admin/           Login, Logout, Content R/W, Activity Logs, Registrations API
    contact/         Contact form submission with rate limiting
    event-registration/ Validates & AES-256 encrypts student registrations
    public-image/    Proxy for displaying fresh uploaded images safely
  layout.js          Root shell: fonts (Inter), Nav, Footer, SEO & OpenGraph tags
  globals.css        Theme design tokens for Violet, Inferno, and Frost themes
components/          Reusable UI: Nav, Footer, AnnouncementBar, AchievementTimeline,
                     GalleryCard, TeamCard, StatCard, EventActions, EventRegistrationForm,
                     Skeleton, EmptyState, ErrorState, ClubChatbot, CustomCursor
content/             Editable site content JSON files (the "database"):
                     site.json, events.json, team.json, announcements.json, achievements.json, activity.json
lib/
  crypto.js          AES-256-GCM authenticated encryption/decryption for student PII
  activity.js        Server-side activity logger for admin audit trails
  content.js          Reads content/*.json for live public pages
  github.js           Reads/writes content/*.json in GitHub for Admin CMS
  session.js          Signed-cookie authentication & role authorization for /admin
  csrf.js             CSRF origin protection validator
  rateLimit.js        In-memory IP rate limiter with periodic cleanup
proxy.js             Next.js 16 Middleware/Proxy for CSRF security enforcement
```

---

## 🔒 Security & Standards Compliance

- **Student Data Privacy**: Student PII (USN, Email, Phone, Name) is encrypted server-side using **AES-256-GCM** before saving. No unencrypted student data is ever committed to public repositories.
- **Server-Side Key Isolation**: Secret environment variables (`GITHUB_TOKEN`, `ADMIN_PASSWORD`, `SESSION_SECRET`) are accessed strictly inside server-only files (`app/api/` and `lib/`), never reaching the browser.
- **CSRF & Rate Limiting**: Next.js 16 `proxy.js` enforces same-origin mutating requests; IP rate limiting prevents spam and brute-force attacks.
- **Clean Compilation**: Production build (`npx next build`) compiles static routes and dynamic APIs in under 2 seconds with zero errors and zero warnings.

---

*Organized by AgentBlazer Club, SJEC, in collaboration with Cipher (CSE Association).*
