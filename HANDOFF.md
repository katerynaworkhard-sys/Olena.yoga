# Olena.yoga — Project Handoff

> Living handoff doc for **Olena Pruska — Yoga Teacher (Huntington Beach / Orange County)** site.
> Audience: a developer/agent picking this up cold. Covers what the project is, how to run it,
> the architecture, and a complete chronological log of every change made in the work session.
>
> **Concept note (read this first):** the project began as a *beach yoga booking* site and was
> progressively repositioned. In order: the beach theme was dropped and pricing removed
> (§8.15–§8.16); then the **class Schedule + the whole booking flow were removed** (§8.18); then the
> admin was **trimmed to just Contact Messages + Business Inquiries** (§8.19). It is now a
> **general yoga-teacher portfolio + company-contact** site. "Huntington Beach" appears only as her
> location. Later the site was shared with Olena via a **Cloudflare tunnel** (§8.20), the class-card
> photos were swapped for new ones (§8.21), and Olena's certificate was added (§8.22).
>
> **🚀 Current focus: going live.** We are mid-deployment to **Vercel + Turso** (§8.23 = code prep;
> **§11 = the live deploy runbook + "resume here" checklist**).

Last updated: 2026-07-02

---

## 1. What this is

A **portfolio + company-contact** site for a yoga teacher (Olena Pruska). (It started as a booking
site; the schedule/booking side has since been removed — see §8.18–§8.19.) It has:

- A **public client site** — home, about, contact, and a business "Make an Inquiry" page.
  (The public **Schedule page was deleted** (§8.18); `/schedule` now 404s.)
- A **password-protected admin panel** at `/admin` with **two tabs**: **Messages** (contact-form
  submissions) and **Inquiries** (business/partnership requests). (Bookings/Schedule/Requests tabs
  were removed — §8.18–§8.19.)
- A **SQLite database** (via Prisma). Only **`ContactMessage`** and **`BusinessInquiry`** are
  actively used. The older `YogaClass` / `Booking` / `PlanRequest` models still exist but are
  **orphaned** — nothing in the UI reads or writes them.

### Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.2.4** (App Router, React 19, Turbopack dev) |
| Language | TypeScript |
| Styling | **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme inline`) |
| DB | **SQLite** via **Prisma 7** using the **libSQL adapter** (`@prisma/adapter-libsql`) |
| Icons | `lucide-react` |
| Fonts | `next/font/google` — **Cormorant Garamond** (serif) + **DM Sans** (sans), normal + italic |
| Media | `ffmpeg` used to transcode source videos into web MP4s + poster frames |

> ⚠️ **Important repo convention** (`AGENTS.md` / `CLAUDE.md`): This is treated as a *modified* Next.js
> whose APIs may differ from training data. The instruction is to read the relevant guide in
> `node_modules/next/dist/docs/` before writing framework code, and heed deprecation notices.

### Brand palette (used throughout)
- Off-white background `#FAFAF8`, near-black text `#1A1A18`, blue accent `#7BA7BC`,
  sand `#C4B9A8`, subtle border `#E8E4DE`. Serif = Cormorant Garamond, sans = DM Sans.

---

## 2. How to run it

```bash
npm install          # deps (already installed in the working tree)
npm run seed         # seed sample classes into prisma/dev.db (script: npx tsx prisma/seed.ts)
npm run dev          # start dev server (next dev) — defaults to :3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

### Dev workflow gotchas (hit during this session — read these)
- **After changing `prisma/schema.prisma`:** run `npx prisma db push` then `npx prisma generate`,
  **and restart the dev server**. The running Next process caches the old Prisma client, so the first
  insert against a new model 500s until you restart. (`db push` was used instead of `migrate dev`
  because the DB has migration drift — see §5 — and `migrate dev` would offer to reset/wipe data.)
- **After changing `next.config.ts`:** the Turbopack cache can go stale and make **all `/api/*` routes
  return 404** (serving the not-found HTML). Fix: stop the server, `rm -rf .next`, restart.
- **Adding a new `lucide-react` import / removing the last use of one** can trip ESLint
  (unused-vars) — keep imports in sync with usage.

### Local preview note (this environment)
- A dev server config exists at `.claude/launch.json` (name: `dev`, `npm run dev`).
- Port 3000 is repeatedly occupied by a stale node process, so **`"autoPort": true`** was added to
  `.claude/launch.json`; the preview server picks an **ephemeral port** each start (it changed many
  times: 62574 → 50472 → 51086 → 57703 → 50137 → 55715 → 55654 → 57157 …). **The port is not fixed —
  read the launch output.**
- **The preview screenshot tool times out in this environment** (it hangs on `<video>` elements and
  on the very large `lenaproject/*.JPG` images). All verification was done via the browser's DOM/Font
  APIs, `curl` HTTP-status/header checks, network inspection, and reading extracted poster frames —
  not visual screenshots. (To "show" the admin panel once, a faithful HTML mockup was rendered from
  live data instead of a screenshot.)

### Environment variables (`.env`, NOT committed)

```
DATABASE_URL=file:./prisma/dev.db
ADMIN_PASSWORD=<set in .env>               # changed from "admin" to a real value (see §8.17)
AUTH_SECRET=<64-char random base64url>     # already a strong value locally
```

- `.env` and `prisma/dev.db` are **git-ignored** (confirmed not tracked).
- **`.env.example` exists and is committed** (placeholders only, no real secret) — confirmed it does
  NOT leak the real `AUTH_SECRET`.
- The admin password was changed away from the `admin` dev value (§8.17). The real value is **only**
  in the local `.env` and is deliberately **not written into this committed doc**. `.env` is read at
  startup, so changing it requires a dev-server restart. Env vars must also be set in any host/deploy.

---

## 3. Repository / Git

- Remote: `origin` → `https://github.com/katerynaworkhard-sys/Olena.yoga.git` (fetch + push).
- Default branch: `main`. Local `main` tracks `origin/main`.
- At session start the tree was clean and in sync with origin at commit `401d527`.
- **All session edits below are uncommitted** unless a commit was made after this doc was written.
  New untracked source media also sits in the repo root (see §9).

---

## 4. Directory structure (current)

```
prisma/
  schema.prisma            # 5 models (sqlite)
  seed.ts                  # seeds 12 sample classes for the upcoming week
  migrations/              # init + add_plan_request (DB itself is kept in sync via `db push`)
prisma.config.ts           # prisma config (reads DATABASE_URL via dotenv)
next.config.ts             # images.unoptimized, devIndicators:false, turbopack root, security headers()
.env.example               # committed placeholder env (no secrets)
.claude/launch.json        # preview dev-server config (autoPort: true)
HANDOFF.md                 # this file
src/
  app/
    layout.tsx             # root layout; loads Cormorant + DM Sans (normal+italic, display:swap)
    globals.css            # Tailwind import, theme vars, animations, font smoothing/rendering
    page.tsx               # HOME (client) — hero VIDEO, About strip, classes (click→modal, CTA→/contact),
                           #   What to Bring (gradient), testimonials, CTA. (Pricing removed §8.15.)
    about/page.tsx         # About (bio, stats, timeline, certs, CTA with background VIDEO → /contact)
    contact/page.tsx       # Contact (client) — name/email/PHONE/message → POST /api/messages
    inquiries/page.tsx     # "Make an Inquiry" (client) — dual CTA + 7-field business form
    request/[plan]/page.tsx# Plan request form — ORPHANED (no links since §8.15). 2 valid slugs.
    admin/page.tsx         # Admin dashboard (client) — login + 2 tabs (Messages, Inquiries)
    # DELETED §8.18: schedule/page.tsx  → /schedule now 404s
    api/
      admin/login/route.ts   # POST: rate-limited password check, set session cookie
      admin/logout/route.ts  # POST: clear session cookie
      admin/session/route.ts # GET: { authenticated: boolean }
      messages/route.ts      # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)  [ACTIVE]
      inquiries/route.ts     # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)  [ACTIVE]
      bookings/route.ts      # ORPHANED (§8.18–8.19) — routes exist, no UI caller
      classes/route.ts       # ORPHANED (§8.18) — routes exist, no UI caller
      requests/route.ts      # ORPHANED (§8.15,8.19) — routes exist, no UI caller
  components/
    Navbar.tsx             # fixed nav; `overlay` prop = white-on-dark hero; links: Home/About/Contact/Make an Inquiry + "Get in Touch"
    Footer.tsx             # nav links + Instagram link
    # DELETED §8.18: ClassCard.tsx, BookingModal.tsx
  lib/
    auth.ts                # HMAC-signed cookie session, password verify, requireAdmin()
    prisma.ts              # singleton PrismaClient w/ libSQL adapter
    rate-limit.ts          # in-memory per-IP sliding-window limiter (NEW)
    validation.ts          # email/length/blank input-validation helpers (NEW)
public/
  hero.mp4, hero-poster.jpg              # home hero background video (from "video 1.mov")
  about-cta.mp4, about-cta-poster.jpg    # about CTA background video (from "video 2.MP4")
  classes/                               # vinyasa/hatha/yin-yoga/yoga-sculpt.jpg (photos replaced §8.21)
  lenaproject/                           # lena1/2/3.JPG (about page etc.) — ~13–14 MB each
```

---

## 5. Data model (`prisma/schema.prisma`) — 5 models

```prisma
model YogaClass {
  id        String   @id @default(uuid())
  dayOfWeek String
  date      DateTime
  time      String
  type      String
  duration  Int
  location  String
  maxSpots  Int      @default(10)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  bookings  Booking[]
}

model Booking {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  email     String
  phone     String?            // nullable in DB, but REQUIRED at the app/API layer now
  classId   String
  yogaClass YogaClass @relation(fields: [classId], references: [id])
  createdAt DateTime @default(now())
}

model PlanRequest {
  id        String   @id @default(uuid())
  plan      String             // "3-class-pack" | "monthly-unlimited"
  firstName String
  lastName  String
  email     String
  phone     String
  comment   String?
  status    String   @default("new")
  createdAt DateTime @default(now())
}

model ContactMessage {        // NEW (8.9) — contact form submissions
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String
  message   String
  status    String   @default("new")
  createdAt DateTime @default(now())
}

model BusinessInquiry {       // NEW (8.10) — resort/retreat/private inquiries
  id             String   @id @default(uuid())
  name           String
  email          String
  company        String?
  location       String?
  inquiryType    String        // Resort | Retreat | Private Class | Corporate / Event | Other
  preferredDates String?
  message        String
  status         String   @default("new")
  createdAt      DateTime @default(now())
}
```

- ⚠️ **`YogaClass` / `Booking` / `PlanRequest` are now ORPHANED** (§8.18–8.19): the Schedule page,
  booking modal, and the admin Bookings/Schedule/Requests tabs that used them were removed. The models,
  the seed, and their API routes still exist, but **nothing in the UI touches them**. Only
  `ContactMessage` and `BusinessInquiry` are actively read/written. (These models could be deleted in a
  future cleanup — see §9.)
- Seed (`prisma/seed.ts`) inserts 12 classes (Hatha / Yin Yoga / Hot Vinyasa / Yoga Sculpt) across
  the upcoming Mon–Sat, `maxSpots: 10`. (Now only relevant to the orphaned models above.)
- **Migration drift:** the DB was originally created via `db push`, so the `migrations/` history does
  not match the live DB. `ContactMessage` and `BusinessInquiry` were added with `npx prisma db push`
  (non-destructive) — **not** `migrate dev` (which would reset/wipe). Keep using `db push` for schema
  changes here, or reconcile the migration history before switching back to `migrate`.

---

## 6. Auth & API security (`src/lib/auth.ts`, `rate-limit.ts`, `validation.ts`)

**Session auth**
- Cookie `admin_session`: httpOnly, sameSite=lax, secure in production, 7-day TTL.
- Token format: `"<expiresMs>.<hmacSHA256(expiresMs, AUTH_SECRET)>"` (base64url sig).
- `verifyAdminPassword(input)` — timing-safe compare against `ADMIN_PASSWORD`.
- `buildSessionToken()` / `verifySessionToken()` — sign + expiry check.
- `isAdminAuthenticated()` reads/verifies the cookie; `requireAdmin()` returns a 401 `NextResponse`
  or `null` (gates admin routes). `AUTH_SECRET` must be ≥ 32 chars or the lib throws.

**Authorization map** (all routes still gated the same way; some are now orphaned)
- **Admin-gated** (`requireAdmin()`): `GET`/`DELETE` on bookings, requests, messages, inquiries;
  `GET`/`POST`/`DELETE` on classes. Unauthenticated → **401**. The admin UI now only calls
  `GET /api/messages` and `GET /api/inquiries` (§8.19); bookings/classes/requests GET/DELETE are
  orphaned but still gated.
- **Public POST** (customer write paths): **messages, inquiries** are live (contact form, inquiry
  form). **bookings, requests** POST endpoints still exist and remain validated + rate-limited, but
  their UIs were removed (§8.18) so nothing calls them.

**Rate limiting** (`src/lib/rate-limit.ts`) — in-memory sliding window keyed by client IP
(`x-forwarded-for` → `x-real-ip` → `'local'`):
- `POST /api/admin/login`: **10 / 10 min** → 429 (brute-force defense).
- Each public POST (bookings, requests, messages, inquiries): **10 / min** → 429 (spam defense).
- ⚠️ In-memory = per-instance; restart clears the counters. For serverless/multi-instance, back it
  with Redis/Upstash.

**Input validation** (`src/lib/validation.ts`) — applied in every public POST: trims inputs,
`isValidEmail()` server-side, `FIELD_LIMITS` max-length checks (→ 400), and allow-list re-checks for
`plan` (requests) and `inquiryType` (inquiries).

**Security headers** (`next.config.ts` `headers()` on `/:path*`): `X-Frame-Options: SAMEORIGIN`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` (camera/mic/geo/FLoC off), `Strict-Transport-Security` (HTTPS only).

---

## 7. Routes summary

| Path | Type | Notes |
|---|---|---|
| `/` | client | Home — full-bleed hero **video**, About strip, classes (click → detail modal, CTA "Get in Touch" → `/contact`), What to Bring (gradient), testimonials, CTA → `/contact`. (Pricing removed §8.15.) |
| `/schedule` | — | **DELETED (§8.18) → 404.** Was the class schedule + booking. |
| `/about` | server | Bio, stats, experience timeline, certs/languages, CTA (background video) → `/contact` |
| `/contact` | client | Name / Email / **Phone** / Message → `POST /api/messages` (all required) |
| `/inquiries` | client | "Make an Inquiry" — dual CTA ("Get in Touch"→`/contact`, "Make an Inquiry"→form) + 7-field form → `POST /api/inquiries` |
| `/request/3-class-pack`, `/request/monthly-unlimited` | client | Plan forms + Back button — **ORPHANED** (no links since §8.15) but still resolve if visited directly |
| `/request/<other>` | — | `notFound()` → 404 |
| `/admin` | client | Login gate → **2 tabs: Messages, Inquiries** (Bookings/Schedule/Requests removed §8.18–8.19) |

> Nav/Footer links are now: Home · About · Contact · Make an Inquiry, plus a "Get in Touch" button
> (→ `/contact`). Every former schedule/booking CTA ("Book a Class", "View Schedule", "Reserve Your
> Spot", "Join Me on the Mat", "Book a Session") was repointed to `/contact` (§8.18).

---

## 8. CHANGE LOG — full session, chronological

Each item: intent, files touched, how it was verified. Interspersed "run the project on localhost" and
"show me the admin panel" requests produced no code changes (the server was started/confirmed, and the
admin was reproduced as an HTML mockup from live data because screenshots time out here).

### 8.0 Initial bring-up + run
- Read the entire codebase. Confirmed deps installed, Prisma client generated, `prisma/dev.db` seeded
  (12 classes, 0 bookings, 0 requests at the time), migrations + images present.
- Started the dev server via preview; added `"autoPort": true` to `.claude/launch.json` because :3000
  was taken by a stale process. All routes 200; full admin login flow verified end-to-end (wrong pw
  401, correct 200, session authenticated, protected APIs return data).

### 8.0b GitHub connection check
- Verified `origin` is correctly wired, reachable, authenticated (`git fetch` / `git ls-remote`), and
  in sync (local `main` == `origin/main` == `401d527`, ahead/behind 0). `.env` / `dev.db` not tracked.

### 8.1 Home hero → full-bleed background video
**Intent:** Replace the two-column image hero with a full-screen background **video** + centered white text.
- **Asset:** source `video 1.mov` (720×1280 portrait, H.264, 2.9s) → ffmpeg → `public/hero.mp4`
  (~882 KB) + `public/hero-poster.jpg`. ffmpeg auto-applied rotation → upright landscape.
  ```bash
  ffmpeg -y -i "video 1.mov" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -movflags +faststart -an public/hero.mp4
  ffmpeg -y -ss 0.5 -i "video 1.mov" -vframes 1 -q:v 3 public/hero-poster.jpg
  ```
- **`src/app/page.tsx`:** hero rewritten to `relative min-h-screen flex items-center justify-center`
  with absolute `<video autoPlay muted loop playsInline poster>` + `object-cover`, dark gradient
  overlay (`from-black/40 via-black/25 to-black/50`), centered white content (tags, "Beach Yoga" /
  *Huntington Beach*, subtitle, white "View Schedule"). Removed the old `next/image` hero + import.
- **`src/components/Navbar.tsx`:** added **`overlay?: boolean`** prop. `overlay && !scrolled` →
  white text + white "Book a Class" button; scrolled (>50px) → solid light bar. Home uses
  `<Navbar overlay />`; other pages `<Navbar />`.
- **Verify:** video 200; nav brand computed white; content centered; overlay present.

### 8.2 "Find Your Flow" → real photos + "Hot Vinyasa" → "Vinyasa"
- **Assets:** 4 images copied into `public/classes/` (1024×1024): `a_young_woman_doing_yo.jpeg`→`vinyasa.jpg`,
  `a_group_of_people_doin.jpeg`→`hatha.jpg`, `a_woman_silhouette_is_.jpeg`→`yin-yoga.jpg`,
  `b_woman_silhouette_is_.jpeg`→`yoga-sculpt.jpg`.
- **`src/app/page.tsx`:** icon tiles → `<Image fill object-cover>` cards (`aspect-square`, rounded,
  hover zoom); "Hot Vinyasa" → "Vinyasa" with blurb "Dynamic, breath-led flow that strengthens and
  energizes." Removed unused `lucide-react` icons; re-added `next/image`.
- **Verify:** all 4 `/classes/*.jpg` 200 + decode 1024×1024; titles correct.

### 8.3 Class cards → clickable detail modal
- **`src/app/page.tsx`:** classes moved into a typed **`CLASSES`** array (`title`, `image`,
  `shortDesc`, `longDesc` — full copy transcribed for Vinyasa, Hatha, Yin Yoga, Yoga Sculpt). Cards
  became `<button onClick={() => setActiveClass(cls)}>`. Added `activeClass` state + modal: backdrop
  `fixed inset-0 z-[60] bg-black/50`, 16:10 image header with title overlaid on a bottom gradient,
  description, full-width black **RESERVE YOUR SPOT** → `/schedule`, circular ✕. Closes on ✕,
  backdrop, **Escape**; locks body scroll; `role="dialog"` + `aria-modal`. Re-added `X`, `useState`.
- **Verify:** each card opens its own content; all 3 close methods work; scroll lock toggles.

### 8.4 "What to Bring" → borderless + light-blue gradient + 3 columns
- **`src/app/page.tsx`:** removed the inner white card; section bg →
  `bg-gradient-to-b from-white via-[#7BA7BC]/15 to-[#FAFAF8]`; grid → `sm:grid-cols-2 lg:grid-cols-3`
  in `max-w-6xl`. Six items unchanged.
- **Verify:** wrapper bg transparent (no card); section bg is a linear-gradient; grid = 3 columns.

### 8.5 About CTA → low-opacity background video
- **Asset:** `video 2.MP4` (720×1280, 10s). **Rotation was NOT auto-applied** (unlike video 1) — first
  pass came out sideways, so re-encoded with **90° CW** (`-vf "transpose=1"`) → upright 1280×720.
  ```bash
  ffmpeg -y -i "video 2.MP4" -vf "transpose=1" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -movflags +faststart -an public/about-cta.mp4
  ffmpeg -y -ss 1 -i "video 2.MP4" -vf "transpose=1" -vframes 1 -q:v 4 public/about-cta-poster.jpg
  ```
  → `public/about-cta.mp4` (~2.3 MB) + poster (confirmed upright: face left, seahorse necklace, sunset beach).
- **`src/app/about/page.tsx`:** CTA → `relative overflow-hidden bg-[#FAFAF8]` with absolute
  `<video ... object-cover opacity-40>`, a `bg-white/20` legibility wash, dark heading + dark
  "Join Me on the Mat" on `z-10`.
- **Verify:** `/about-cta.mp4` 200; opacity 0.4, object-cover, absolute; CTA → `/schedule`.

### 8.6 Pricing cards → same-tab navigation
- Discovery: `/request/[plan]` pages already existed and matched the design; the two pack cards linked
  there but with `target="_blank"` (new tab).
- **`src/app/page.tsx`:** removed `target="_blank" rel="noopener noreferrer"` from the 3-Class Pack
  and Monthly Unlimited links → same-tab navigation. Drop-In intentionally stays → `/schedule`.
- **Verify:** all three same-tab; `/request/*` 200; invalid slug 404; click lands on the form.

### 8.7 Typography quality fix — real italics ("low quality text")
- **Root cause:** `layout.tsx` loaded only the **normal** style of both fonts, so every `italic` use
  (hero *Huntington Beach*, About headline, plan taglines, admin comments) was browser-**synthesized**
  (faux-slanted) → blurry.
- **`src/app/layout.tsx`:** added `style: ["normal", "italic"]` + `display: "swap"` to **both**
  `Cormorant_Garamond` and `DM_Sans`.
- **`src/app/globals.css`** `body`: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing:
  grayscale; text-rendering: optimizeLegibility; font-kerning: normal; font-synthesis: none;`
- **Verify:** real italic faces load (Cormorant italic 300 & 400; DM Sans italic 400 on demand);
  `font-synthesis: none` + `optimizeLegibility` active. Italic usages: `page.tsx`, `about/page.tsx`,
  `request/[plan]/page.tsx` (×2), `admin/page.tsx`.

### 8.7b HANDOFF.md created
- Wrote the first version of this document, then started/confirmed the server on localhost twice.

### 8.8 Request page → Back button
- **`src/app/request/[plan]/page.tsx`:** added `useRouter` + a top-left "← Back" button
  (`ArrowLeft`). `handleBack()` does `router.back()` if `window.history.length > 1`, else
  `router.push('/')`.
- **Verify:** Home → 3-Class Pack → Back returns to `/`; button renders with icon.

### 8.9 Contact form → database + admin "Messages" tab
- **DB:** added `ContactMessage` model; `prisma db push` (avoided `migrate dev` due to drift).
- **API:** new `src/app/api/messages/route.ts` — public `POST` (all fields required), admin
  `GET`/`DELETE`.
- **`src/app/contact/page.tsx`:** added a **required Phone** field; replaced the fake `setTimeout`
  submit with a real `POST /api/messages` + error handling. All fields mandatory.
- **`src/app/admin/page.tsx`:** new **Messages** tab (interface, state, fetch, delete handler, panel).
- **Note:** required a dev-server restart so the running process picked up the regenerated Prisma
  client (first live insert 500'd before restart).
- **Verify:** valid POST 200 + saved; missing field 400; unauth GET 401; admin sees full message;
  delete works.

### 8.10 Business "Make an Inquiry" section (resorts / retreats / private)
- **DB:** added `BusinessInquiry` model; `prisma db push` + `generate` + restart.
- **API:** new `src/app/api/inquiries/route.ts` — public `POST` (required Name/Email/Message + allowed
  `inquiryType`), admin `GET`/`DELETE`.
- **Page:** new `src/app/inquiries/page.tsx` — header + dual CTA ("Book a Session" → `/schedule`,
  "Make an Inquiry" → scrolls to `#inquiry-form`) + 7-field form (Name, Email, Property/Company,
  Location, Type of Inquiry [Resort/Retreat/Private Class/Corporate · Event/Other], Preferred Dates,
  Message). Required: Name, Email, Type, Message.
- **Nav/Footer:** "Make an Inquiry" link added to `Navbar.tsx` and `Footer.tsx`.
- **Admin:** new **Inquiries** tab (interface, state, fetch, delete handler, panel showing type badge,
  name · company, email, location, preferred dates, message).
- **Verify:** `/inquiries` 200; valid POST 200; missing/invalid 400; unauth GET 401; admin sees full
  inquiry; delete works.

### 8.11 Booking modal → all fields mandatory
- **`src/components/BookingModal.tsx`:** Phone is now **required** (label changed from
  "Phone (optional)" → "Phone"). First/Last/Email were already required.
- **`src/app/api/bookings/route.ts`:** added server-side check rejecting blank firstName/lastName/
  email/phone (→ 400).
- **Verify:** modal shows 4 required fields, no "(optional)"; API rejects missing phone (400),
  accepts complete (200).

### 8.12 Remove WhatsApp + set Instagram link
- **`src/components/Footer.tsx`** and **`src/app/contact/page.tsx`:** removed all **WhatsApp** links
  (and the `|` separator on Contact). **Instagram** now → `https://www.instagram.com/olena_pruska/`
  (`target="_blank"`, `rel="noopener noreferrer"`).
- **Verify:** site-wide grep for WhatsApp = 0 matches; rendered Instagram href correct.

### 8.13 Security & health audit + hardening
- **Audit (clean):** `.env`/`dev.db` not tracked; `.env.example` placeholders only (no leaked secret);
  all admin GET/DELETE routes gated; no `dangerouslySetInnerHTML`/`eval`; Prisma parameterizes queries.
- **Added:** security headers (`next.config.ts`), in-memory per-IP rate limiting
  (`src/lib/rate-limit.ts`) on login + all public POSTs, and shared input validation
  (`src/lib/validation.ts`) wired into all four public POST routes. See §6 for specifics.
- **Verify:** headers present; bad email / oversized / bad-type / bad-plan → 400; login → 429 after 10
  attempts; valid login still 200; admin APIs 401 unauthenticated; `/request/<bad>` 404;
  `tsc --noEmit` + `eslint` clean; no data lost.
- **Gotcha hit:** editing `next.config.ts` made all `/api/*` routes 404 (stale Turbopack cache) →
  fixed with `rm -rf .next` + restart.

### 8.14 HANDOFF.md — full rewrite
- Rewrote the doc so every reference section (§1–§7) reflects the current state (5 models, 5 admin
  tabs, new routes/libs, security) and the change log captures all turns end-to-end.
- Committed + pushed everything to `main` (commit `79780e7`; `.gitignore` updated to keep raw source
  media out — see §9).

### 8.15 Remove home Pricing section
**Intent:** Olena dropped fixed class pricing as the site shifts toward cooperation + general info.
- **`src/app/page.tsx`:** deleted the entire "Pricing" / "Invest in Your Practice" section
  (Drop-In $25 / 3-Class Pack $65 / Monthly Unlimited $180 cards). Home now flows
  What to Bring → Testimonials. The `/request/*` pages still exist but are no longer linked from home.
- **Verify:** `/` 200; "Invest in Your Practice" not present; no console errors.

### 8.16 Reposition copy: beach yoga → general yoga teacher (whole site)
**Intent:** No longer "beach yoga" — present Olena as a yoga teacher in general (classes, private
sessions, retreats, collaborations). Photos/videos kept; only text changed. "Huntington Beach"
remains as a place name only.
- **`src/app/page.tsx` (home):**
  - Hero headline "Beach Yoga / Huntington Beach" → "Yoga Teacher / *in Huntington Beach*".
  - Hero subtitle "…on the sand, under the California sky." → "…mindful movement for every body."
  - About strip col 3 "Outdoors & Alive" + sand/ocean text → "Grounded & Present" + "Slow down,
    breathe deeply, and reconnect with your body — one mindful movement at a time."
  - Tagline "Where the ocean meets your breath…" → "Where breath meets movement — that's where the
    practice begins."
  - Testimonial "…peaceful atmosphere on the beach." → "…in every session."
  - Class modal copy: Vinyasa "…savasana with the sound of the waves beside you." → "…as your breath
    settles."; Yin "Bring a blanket. The ocean takes care of the soundtrack." → "Bring a blanket and
    let the stillness do the rest."
  - Class image alt text "…beach yoga" → "…yoga" (card + modal).
  - **"What to Bring"** fully generalized: removed "(or rent one from Olena — ask when booking)",
    "stay hydrated in the sun!", and "Sunscreen & sunglasses"; new 6 items = Your own yoga mat /
    Water bottle to stay hydrated / Comfortable activewear you can move in / A light towel or blanket
    (for Yin & Savasana) / Arrive a few minutes early to settle in / An open mind & good vibes.
- **`src/app/schedule/page.tsx`:** header "All classes take place on the beach…" → "Classes across
  Huntington Beach & Orange County. Check each session for the exact location."; "What to bring" note
  dropped sunscreen + "outdoor practice".
- **`src/app/contact/page.tsx`:** Location Note "held outdoors on beaches across Orange County" →
  "held across Huntington Beach & Orange County. Exact locations are shared upon booking."
- **`src/app/inquiries/page.tsx`:** intro "Bring intentional beach yoga…" → "Bring intentional yoga
  to your resort, retreat, studio, or private event…".
- **`src/app/about/page.tsx`:** bio "…the most beautiful studio in the world — the beach." → "…my own
  classes, private sessions, and retreats."; timeline entry "Beach Yoga / Independent Teacher" →
  "Independent Practice / Yoga Teacher"; image alt "…walking on the beach" → "Olena Pruska, yoga teacher".
- **`src/components/Footer.tsx`:** "Beach yoga for every body." → "Mindful yoga for every body."
- **`src/app/layout.tsx`:** page title → "Olena Pruska | Yoga Teacher · Huntington Beach"; meta
  description → general ("private sessions, group classes, retreats & collaborations").
- **Verify:** site-wide sweep of `/ /schedule /about /contact /inquiries` for
  beach/ocean/sand/sunscreen/outdoors = **0 matches** on every page; no console errors. Committed +
  pushed to `main` (commit `fe76ffb`).

### 8.17 Admin password changed
- Changed `ADMIN_PASSWORD` in `.env` from the `admin` dev value to a real value (restart applied; old
  password → 401, new → 200, verified). The literal value is intentionally **not stored in this
  committed doc**; it lives only in the git-ignored `.env`. (Existing sessions stay valid because they
  are signed by `AUTH_SECRET`, which was unchanged.)
- The §8.15–§8.17 changes were committed + pushed to `main` (commits `fe76ffb`, then HANDOFF doc
  update `5b0d32e`).

### 8.17b Operational / Q&A turns (no code changes)
- Several "run the project" turns (started/confirmed the dev server on localhost; port landed on
  3000 once the stale process was gone).
- Answered "if someone clones the repo, do they see the same thing?" → yes for code + `public/`
  assets, but they must supply `.env`, run `db push` + `seed`, and won't inherit the local DB data.
- "Show me the admin panel" → rendered a faithful HTML mockup from live data (screenshots time out).

### 8.18 Remove the Schedule page + booking flow
**Intent:** "Olena doesn't want schedule anymore — site should be portfolio + company contact only."
- **Deleted files:** `src/app/schedule/page.tsx` (→ `/schedule` now 404), `src/components/ClassCard.tsx`,
  `src/components/BookingModal.tsx` (both only used by the schedule page).
- **`src/components/Navbar.tsx`:** removed the "Schedule" link; relabeled the "Book a Class" button →
  **"Get in Touch"** → `/contact`.
- **`src/components/Footer.tsx`:** removed the "Schedule" link.
- **Repointed every schedule/booking CTA → `/contact`, relabeled "Get in Touch":** home hero
  ("View Schedule"), home CTA banner ("See This Week's Schedule" → button "Get in Touch", heading
  "Let's work together"), class-detail modal ("Reserve Your Spot"), About CTA ("Join Me on the Mat"),
  Inquiries "Book a Session".
- **`src/app/admin/page.tsx`:** removed the **Schedule** tab, its "Class Schedule" panel, the
  "Add New Class" modal, and all related state/handlers (`classes`, `YogaClass` interface,
  `handleAddClass`, `handleDeleteClass`, `showAddClass`/`newClass`, the `/api/classes` fetch, unused
  `X`/`Plus` icons).
- **Verify:** `tsc` + `eslint` clean; no leftover `/schedule` links/symbols; `/schedule` → 404; other
  pages 200; home has no Schedule nav text and no `/schedule` hrefs; admin renders remaining tabs.
  (Cleared `.next` + restarted since a route/page was deleted.)

### 8.19 Trim admin → Messages + Inquiries only
**Intent:** "Also delete Bookings and Requests from the admin panel."
- **`src/app/admin/page.tsx`:** removed the **Bookings** tab (table + CSV export) and **Requests** tab,
  plus all supporting code — `Booking` & `PlanRequest` interfaces, `PLAN_LABEL`, `bookings`/`requests`
  state, their `/api/bookings` + `/api/requests` fetches, `handleDeleteBooking`, `handleDeleteRequest`,
  `exportToCSV`, and the now-unused `Download` icon. Default tab is now **Messages**.
- Panels were spliced out with a small node script (unique-marker `indexOf`) to avoid
  whitespace-matching errors on the large JSX block.
- **Verify:** `tsc` + `eslint` clean; admin → 200; tabs = **Messages / Inquiries** only; both panels
  render; no console/server errors (earlier `setBookings`-undefined errors were stale HMR noise during
  the multi-step edit — confirmed gone after `rm -rf .next` + restart).
- **Result:** the `/api/bookings`, `/api/classes`, `/api/requests` routes and the `/request/[plan]`
  pages are now fully orphaned (see §9 for optional deletion).

### 8.20 Share with Olena via a Cloudflare tunnel (Option B)
**Intent:** "How can Olena check the project from her computer?" → chose a temporary public link.
- Presented 3 options: (A) same-Wi-Fi Network URL, (B) Cloudflare quick tunnel, (C) real deploy to
  Vercel + hosted DB (Turso/Neon) — since SQLite doesn't run on serverless. User chose **B**.
- Installed **cloudflared** (`winget install Cloudflare.cloudflared`) → `C:\Program Files (x86)\cloudflared\cloudflared.exe`.
- Started the dev server + ran `cloudflared tunnel --url http://localhost:3000` → public URL
  `https://<random>.trycloudflare.com`. Verified home/about/admin 200 through the tunnel; admin login
  works remotely. Gave the client link and the `/admin` link + password to send Olena.
- ⚠️ Caveats communicated: the PC must stay on with **both** the dev server and tunnel running; the
  URL is random/temporary and changes on restart; it's a dev build; the link is public (only the admin
  is password-gated). For persistence beyond a Claude session, the user should run the two commands in
  their own terminals. (These processes are session-scoped and were torn down/restarted across a
  session reconnect during this work.)

### 8.21 Replace the class-card photos
**Intent:** "I put new photos in the project — replace them by name."
- User added 4 new photos to the repo root (named by class). Viewed each to confirm upright/valid, then
  copied over the existing files (same URLs, so no code change):
  `photo vinyasa.jpg`→`public/classes/vinyasa.jpg`, `photo hatha.jpg`→`hatha.jpg`,
  `photoYinYan.jpg`→`yin-yoga.jpg`, `photoYoga Sculpt.jpg`→`yoga-sculpt.jpg`.
- Added `/photo*.jpg` + `/photo*.jpeg` to `.gitignore` (raw sources stay local; used copies live in
  `public/classes/`).
- **Verify:** all four `/classes/*.jpg` serve 200 with the new byte sizes. (User said "three"; there
  were four matching files — replaced all four.) Note: filenames are unchanged, so a browser hard
  refresh (Ctrl+F5) may be needed to bust cache.

### 8.21b Swap Hatha ↔ Yin Yoga photos
- Swapped the two files in `public/classes/` (`hatha.jpg` ↔ `yin-yoga.jpg`) at the user's request so
  each card shows the other's image. No code change (same URLs). Verified both serve 200 with swapped
  byte sizes.

### 8.22 Add Olena's certificate to the About page
**Intent:** "I added Olena's certificate — put it on the site, around the Experience/Certifications area."
- **Asset:** `certificate.png` (1491×1055) copied to `public/certificate.png`. It's the Adhiroha
  "Hatha & Ashtanga Yoga Teacher Training, 500 Hour Level" certificate awarded to Olena Pruska
  (Rishikesh, India, 2024).
- **`src/app/about/page.tsx`:** added a new **"500-Hour Certification"** section (label "Credential" +
  serif heading) right after the Certifications & Languages section and before the CTA. Shows the
  certificate via `next/image` (width 1491 / height 1055, `w-full h-auto`) in a white framed card
  (border + subtle shadow), with a caption line. Uses the already-imported `Image`.
- `.gitignore`: added `/certificate.png` (root source stays local; the used copy is `public/certificate.png`).
- **Verify:** `/about` 200; `/certificate.png` 200; the "500-Hour Certification" heading + image
  reference render on the page.

> §8.18–§8.22 were committed + pushed as commit `edc1bb3` ("Remove schedule/booking, trim admin, swap
> class photos, add certificate").

### 8.23 Prepare for production deploy (Vercel + Turso) — commit `1cbcbb3`
Chose **Vercel** (host) + **Turso** (hosted libSQL database). Full deploy runbook + current progress is
in **§11**. Code/asset changes made here:
- **`src/lib/prisma.ts`:** pass `TURSO_AUTH_TOKEN` to the libSQL adapter when set (production). Local
  `file:` SQLite DB is unchanged (no token needed).
- **`package.json`:** `build` is now `prisma generate && next build` so Vercel generates the Prisma
  client during the build (there is no `postinstall`).
- **Turso DB `olena-yoga` (region `aws-us-west-2`)** created via the Turso web dashboard. Its 5 tables
  were created by generating DDL (`npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma
  --script`) and executing it against Turso with a tiny `@libsql/client` script (see §11 for how to
  redo this).
- **Image optimization (the "fast" work):** compressed with ffmpeg — `lena1/2/3.JPG` ~14 MB → 57–146 KB
  each (only `lena2.JPG` is used, on /about); `certificate.png` (1.2 MB) → `certificate.jpg` (156 KB),
  and updated the `<Image src>` in `about/page.tsx`. Confirmed the certificate text is still legible.
- **Verify:** local `npm run build` compiles clean (16 routes); committed + pushed (`1cbcbb3`).

---

## 9. Known issues / housekeeping / suggested follow-ups

1. **Admin password** has been set to a real value in `.env` (§8.17) — no longer the `admin` default.
   It exists only in the local `.env`; for any hosted deploy, set `ADMIN_PASSWORD` (and `AUTH_SECRET`)
   in that environment too. `AUTH_SECRET` is already strong; rotating it invalidates existing sessions.
2. **Orphaned schedule/booking code (candidate for deletion).** After §8.18–8.19, these exist but are
   never used: API routes `api/bookings`, `api/classes`, `api/requests`; pages `request/[plan]`; and
   the Prisma models `YogaClass` / `Booking` / `PlanRequest` (+ `prisma/seed.ts`). Safe to remove for a
   truly minimal codebase — left in place because the user only asked to remove the UI so far.
3. **Raw source media in repo root** is now git-ignored via patterns `/video*.{mov,MP4}`,
   `/a_*.jpeg`, `/b_*.jpeg`, `/photo*.jpg`, `/photo*.jpeg` (optimized versions live in `public/`).
   Still tracked historically: a stray `public/lenaproject/New Microsoft Word Document.docx`.
3. **Images now compressed (§8.23):** `lena*.JPG` are ~57–146 KB and the certificate is a 156 KB JPG.
   `next.config.ts` still has `images.unoptimized: true` (predictable/no-surprises). Optional further
   win: remove `unoptimized` so Vercel serves optimized WebP — test the build if you do.
   Note `lena1.JPG` / `lena3.JPG` are compressed but **unused** (only `lena2.JPG` is referenced).
4. **Rate limiter is in-memory** (single-instance only). For serverless/multi-instance hosting, back
   it with Redis/Upstash.
5. **No Content-Security-Policy** yet. Deliberately skipped — a strict CSP needs careful testing with
   Next's inline scripts/Turbopack HMR. Add it in prod with testing.
6. **Booking capacity/duplicate check is not transactional** (minor TOCTOU race under concurrent
   bookings). Wrap the find-then-create in a transaction if high concurrency is expected.
7. **`prefers-reduced-motion`:** background videos always autoplay. Optional: fall back to the poster
   image when reduced motion is requested.
8. **Migration drift:** DB is maintained with `db push`, not `migrate`. Reconcile `migrations/` before
   switching back to `migrate dev`.
9. **Deep-linking idea:** class-modal "Reserve Your Spot" and pricing buttons all funnel to `/schedule`
   or `/request/[plan]`. Could deep-link to a pre-filtered schedule by class type; Drop-In could get
   its own request page (add a `drop-in` entry to `PLAN_DETAILS` + allowed plans).

---

## 10. Quick verification cheatsheet

```bash
PORT=3000   # dev server port (autoPort may pick another if 3000 is busy)

# live routes (expect 200; /schedule now 404)
for p in / /about /contact /inquiries /admin; do
  curl -s -o /dev/null -w "$p -> %{http_code}\n" "http://localhost:$PORT$p"; done
curl -s -o /dev/null -w "/schedule -> %{http_code} (expect 404)\n" "http://localhost:$PORT/schedule"

# security headers
curl -s -D - -o /dev/null "http://localhost:$PORT/admin" | grep -iE "x-frame|x-content|referrer|permissions-policy|strict-transport"

# admin login + gated data (password is in .env, not here)
J=/tmp/c.txt
curl -s -c $J -X POST "http://localhost:$PORT/api/admin/login" -H 'Content-Type: application/json' -d '{"password":"<ADMIN_PASSWORD>"}'
for e in messages inquiries; do
  echo "$e -> $(curl -s -b $J -o /dev/null -w '%{http_code}' http://localhost:$PORT/api/$e)"; done

# db counts (active models)
node -e "const{PrismaClient}=require('@prisma/client');const{PrismaLibSql}=require('@prisma/adapter-libsql');\
const p=new PrismaClient({adapter:new PrismaLibSql({url:'file:./prisma/dev.db'})});\
Promise.all([p.contactMessage.count(),p.businessInquiry.count()])\
.then(r=>{console.log('messages,inquiries =',r);process.exit(0)})"

# share with Olena (Option B, §8.20) — two terminals, keep both open:
#   1) npm run dev
#   2) & "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
```

- Admin login: open `/admin`, enter `ADMIN_PASSWORD` (value is in the local `.env`). Tabs:
  **Messages / Inquiries**.
- **Live data snapshot (as data existed during this session):** messages and business inquiries are
  the active tables; counts change as people submit the contact + inquiry forms.
```

---

## 11. Going live / Deployment runbook — 🚧 IN PROGRESS (resume here)

**Stack:** **Vercel** (host, free) + **Turso** (hosted libSQL database, free). Chosen because the code
already uses the libSQL adapter, so Turso needs almost no code change and is fast. The custom **domain**
is bought last (~$10–15/yr). Everything else is free.

### Already set up
- **GitHub:** `katerynaworkhard-sys/Olena.yoga`, branch `main`, **deploy-ready at commit `1cbcbb3`**.
- **Vercel:** account created (GitHub login); GitHub app installed; `Olena.yoga` is importable.
- **Turso:** account created; database **`olena-yoga`** in region **`aws-us-west-2`**; **all 5 tables
  created** (Booking, BusinessInquiry, ContactMessage, PlanRequest, YogaClass), currently empty.
  - DB URL: `libsql://olena-yoga-katerynaworkhard-sys.aws-us-west-2.turso.io`

### Environment variables Vercel needs (4)
Set in Vercel → Project → **Settings → Environment Variables** (Production). **Secret values are
intentionally NOT written in this committed doc** — obtain them as noted:

| Name | Value source |
|---|---|
| `DATABASE_URL` | the Turso DB URL above (`libsql://…aws-us-west-2.turso.io`) |
| `TURSO_AUTH_TOKEN` | **secret** — Turso dashboard → `olena-yoga` → **Create Token** (Full Access). |
| `ADMIN_PASSWORD` | **secret** — same value as the local `.env` admin password (for `/admin`). |
| `AUTH_SECRET` | **secret** — long random string: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |

Read by `src/lib/prisma.ts` (`DATABASE_URL` + `TURSO_AUTH_TOKEN`) and `src/lib/auth.ts`
(`ADMIN_PASSWORD` + `AUTH_SECRET`).

### Progress checklist
- [x] 1. Vercel account + GitHub connected.
- [x] 2. Turso account + `olena-yoga` DB + 5 tables created.
- [x] 3. Code deploy-ready (Turso auth in `prisma.ts`, `prisma generate` in build, images optimized) → `1cbcbb3`.
- [ ] 4. **← YOU ARE HERE:** In Vercel, **Import** `Olena.yoga`, add the 4 env vars, click **Deploy**.
      (User was doing this; waiting on the deploy success/error screenshot.)
- [ ] 5. Test the live `*.vercel.app` URL: load all pages; **submit the contact form**, then log into
      `/admin` and confirm the message appears — this proves the Turso DB works end-to-end in production.
- [ ] 6. Buy a domain (cheapest: Cloudflare Registrar at-cost, or Namecheap; or buy inside Vercel = simplest).
- [ ] 7. Vercel → Settings → **Domains** → add the domain, then update the registrar's DNS as Vercel
      instructs. HTTPS is automatic.
- [ ] 8. Live on the custom domain. 🎉

### (Re)create the Turso tables, if ever needed
```bash
# 1) generate SQLite DDL from the Prisma schema (Turso is SQLite-compatible)
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > /tmp/ddl.sql
# 2) run it against Turso using @libsql/client (already a dependency). Pass the URL + token as ENV VARS
#    (never hardcode the token). During deploy this was a tiny throwaway .mjs:
#      import { createClient } from '@libsql/client'
#      const c = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
#      // split ddl on ';' and c.execute() each CREATE TABLE
```
Inspect/edit data: Turso dashboard → `olena-yoga` → **Edit Data**, or the Turso CLI.

### Deploy gotchas
- **Build must generate the Prisma client** → handled by `build: prisma generate && next build`. No `postinstall`.
- **`prisma.config.ts` throws if `DATABASE_URL` is unset** → Vercel must have it set at build time
  (Vercel env vars are available during build by default).
- **In-memory rate limiter** (§6) resets on cold starts; fine for low traffic, move to Upstash Redis for heavy use.
- The **Cloudflare tunnel** (§8.20) was only a temporary preview — obsolete once the Vercel URL is live.
- **Local `prisma/dev.db` data does NOT migrate to Turso.** The live DB starts empty (intended for launch).
