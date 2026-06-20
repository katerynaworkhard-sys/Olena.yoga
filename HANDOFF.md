# Olena.yoga — Project Handoff

> Living handoff doc for **Olena Pruska — Beach Yoga (Huntington Beach)** marketing + booking site.
> Audience: a developer/agent picking this up cold. Covers what the project is, how to run it,
> the architecture, and a complete chronological log of every change made in the work session.

Last updated: 2026-06-20

---

## 1. What this is

A marketing + lightweight booking site for a yoga teacher (Olena Pruska). It has:

- A **public client site** — home, schedule, about, contact, plan-request pages, and a
  business "Make an Inquiry" page.
- A **password-protected admin panel** at `/admin` with **five tabs**: Bookings, Schedule,
  Requests, Messages, Inquiries.
- A **SQLite database** (via Prisma) storing classes, bookings, plan requests, contact messages,
  and business inquiries.

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
ADMIN_PASSWORD=admin                       # ⚠️ dev value — change for production
AUTH_SECRET=<64-char random base64url>     # already a strong value locally
```

- `.env` and `prisma/dev.db` are **git-ignored** (confirmed not tracked).
- **`.env.example` exists and is committed** (placeholders only, no real secret) — confirmed it does
  NOT leak the real `AUTH_SECRET`.

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
    page.tsx               # HOME (client) — hero VIDEO, About strip, classes (click→modal),
                           #   What to Bring (gradient), pricing, testimonials, CTA
    about/page.tsx         # About (bio, stats, timeline, certs, CTA with background VIDEO)
    schedule/page.tsx      # Schedule (server component, reads DB), grouped by day → ClassCard
    contact/page.tsx       # Contact (client) — name/email/PHONE/message → POST /api/messages
    inquiries/page.tsx     # "Make an Inquiry" (client) — dual CTA + 7-field business form
    request/[plan]/page.tsx# Plan request form ("By Invitation") + Back button — 2 valid slugs
    admin/page.tsx         # Admin dashboard (client) — login + 5 tabs
    api/
      admin/login/route.ts   # POST: rate-limited password check, set session cookie
      admin/logout/route.ts  # POST: clear session cookie
      admin/session/route.ts # GET: { authenticated: boolean }
      bookings/route.ts      # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)
      classes/route.ts       # GET(admin) / POST(admin) / DELETE(admin)
      requests/route.ts      # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)
      messages/route.ts      # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)
      inquiries/route.ts     # GET(admin) / POST(public, validated+rate-limited) / DELETE(admin)
  components/
    Navbar.tsx             # fixed nav; `overlay` prop = white-on-dark hero; links incl. Make an Inquiry
    Footer.tsx             # nav links (incl. Make an Inquiry) + Instagram link
    ClassCard.tsx          # schedule class card (opens BookingModal)
    BookingModal.tsx       # booking form modal — all fields required → POST /api/bookings
  lib/
    auth.ts                # HMAC-signed cookie session, password verify, requireAdmin()
    prisma.ts              # singleton PrismaClient w/ libSQL adapter
    rate-limit.ts          # in-memory per-IP sliding-window limiter (NEW)
    validation.ts          # email/length/blank input-validation helpers (NEW)
public/
  hero.mp4, hero-poster.jpg              # home hero background video (from "video 1.mov")
  about-cta.mp4, about-cta-poster.jpg    # about CTA background video (from "video 2.MP4")
  classes/                               # vinyasa.jpg, hatha.jpg, yin-yoga.jpg, yoga-sculpt.jpg
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

- Seed (`prisma/seed.ts`) inserts 12 classes (Hatha / Yin Yoga / Hot Vinyasa / Yoga Sculpt) across
  the upcoming Mon–Sat with beach locations, `maxSpots: 10`.
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

**Authorization map**
- **Admin-gated** (`requireAdmin()`): `GET`/`DELETE` on bookings, requests, messages, inquiries;
  `GET`/`POST`/`DELETE` on classes. Unauthenticated → **401**.
- **Public POST** (customer write paths): bookings, requests, messages, inquiries.

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
| `/` | client | Home — full-bleed hero **video**, About strip, classes (click → detail modal), What to Bring (gradient), pricing, testimonials, CTA |
| `/schedule` | server | Upcoming classes (DB, `date >= today`) grouped by day; cards open `BookingModal` |
| `/about` | server | Bio, stats, experience timeline, certs/languages, **CTA with background video** |
| `/contact` | client | Name / Email / **Phone** / Message → `POST /api/messages` (all required) |
| `/inquiries` | client | "Make an Inquiry" — dual CTA + 7-field business form → `POST /api/inquiries` |
| `/request/3-class-pack` | client | "By Invitation" plan form + **Back** button → `POST /api/requests` |
| `/request/monthly-unlimited` | client | "By Invitation" plan form + **Back** button |
| `/request/<other>` | — | `notFound()` → 404 (only the two slugs are valid) |
| `/admin` | client | Login gate → tabs: **Bookings** (CSV export), **Schedule** (add/delete), **Requests**, **Messages**, **Inquiries** |

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

### 8.14 HANDOFF.md — full rewrite (this update)
- Rewrote the doc so every reference section (§1–§7) reflects the current state (5 models, 5 admin
  tabs, new routes/libs, security) and the change log captures all turns end-to-end.

---

## 9. Known issues / housekeeping / suggested follow-ups

1. **⚠️ `ADMIN_PASSWORD` is `admin`** (dev). Biggest real risk — set a strong unique value in `.env`
   before any public deploy. `AUTH_SECRET` is already strong; rotating it invalidates existing
   admin sessions.
2. **Untracked source media in repo root** (not git-ignored): `video 1.mov`, `video 2.MP4`, and the
   `a_*.jpeg` / `b_*.jpeg` source photos. Optimized versions live in `public/`. Recommend moving the
   raw sources out or adding them to `.gitignore` so only `public/` assets get committed. Also a stray
   `public/lenaproject/New Microsoft Word Document.docx`.
3. **Large unoptimized images:** `public/lenaproject/lena*.JPG` are ~13–14 MB each
   (`next.config.ts` has `images.unoptimized: true`). Slow to load; also break the preview screenshot
   tool. Consider compressing/resizing.
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
PORT=<from launch output>

# public + admin routes
for p in / /schedule /about /contact /inquiries /admin \
         /request/3-class-pack /request/monthly-unlimited; do
  curl -s -o /dev/null -w "$p -> %{http_code}\n" "http://localhost:$PORT$p"; done

# security headers
curl -s -D - -o /dev/null "http://localhost:$PORT/admin" | grep -iE "x-frame|x-content|referrer|permissions-policy|strict-transport"

# admin login + gated data
J=/tmp/c.txt
curl -s -c $J -X POST "http://localhost:$PORT/api/admin/login" -H 'Content-Type: application/json' -d '{"password":"admin"}'
for e in bookings classes requests messages inquiries; do
  echo "$e -> $(curl -s -b $J -o /dev/null -w '%{http_code}' http://localhost:$PORT/api/$e)"; done

# db counts (all 5 models)
node -e "const{PrismaClient}=require('@prisma/client');const{PrismaLibSql}=require('@prisma/adapter-libsql');\
const p=new PrismaClient({adapter:new PrismaLibSql({url:'file:./prisma/dev.db'})});\
Promise.all([p.yogaClass.count(),p.booking.count(),p.planRequest.count(),p.contactMessage.count(),p.businessInquiry.count()])\
.then(r=>{console.log('classes,bookings,requests,messages,inquiries =',r);process.exit(0)})"
```

- Admin login: open `/admin`, enter `ADMIN_PASSWORD` (dev: `admin`). Tabs: Bookings / Schedule /
  Requests / Messages / Inquiries.
- **Live data snapshot at last check (2026-06-20):** classes 12, bookings 1, requests 4, messages 1,
  inquiries 1 (all real submissions; counts change as people use the site).
```
