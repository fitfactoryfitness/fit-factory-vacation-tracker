# Fit Factory — Vacation Tracker

A simple, shared vacation/time-off tracker for the Fit Factory team. Anyone
on the team can log their own time off; managers get a Dashboard and a
Gantt-style Calendar to see who's away at a glance.

## Views

- **Dashboard** (`/`) — who's away today, who's starting time off in the
  next 7 days, and a per-team coverage count. The fastest "who's out"
  check for a manager.
- **Calendar** (`/calendar`) — a Gantt-style month view, one row per
  person grouped by team, with colored bars for each time-off span.
  Filter by team, navigate months, hover a bar for details.
- **Team** (`/team`) — everyone's upcoming and past time off in one
  scrollable list, with a running "days off this year" count per person.
  Filter by team or search by name.
- **My Time Off** (`/my`) — pick your name once (see "Access model"
  below), then add, edit, or delete your own time off.

## Access model

There are no passwords or accounts. The first time someone uses the app,
they pick their name from a list (grouped by Leads / Front Desk /
Coaches) and it's remembered on that device (`localStorage`). That
identity is what gets attached to any time off they add, and it's what
lets the "Edit"/"Delete" buttons show up on their own entries.

This is intentionally lightweight, trust-based access for a small
internal team — there's no server-side check preventing someone from
editing someone else's entry, only the UI hides those buttons for
entries that aren't yours. If that ever stops being good enough (bigger
team, need real accountability), swap in Supabase Auth and add a
`created_by` check in the API routes.

## Team roster

The 13 people on the team are a fixed list in
[src/lib/employees.ts](src/lib/employees.ts), not a database table — this
changes rarely, and keeping it in code means one less table and no
"manage employees" screen to build. **To add, rename, or remove someone,
edit that file and redeploy.**

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind — same visual
  language (near-black background, amber accent) as the other Fit
  Factory internal dashboards, for a consistent look across tools.
- **Supabase** (Postgres) as the only backend, but only ever reached from
  this app's own server-side API routes (`src/app/api/**`) using the
  service role key. The browser never talks to Supabase directly and
  never holds a Supabase key — so there's no Row Level Security policy
  to get right for this app's trust model, it's simply unreachable from
  outside.
- One table: `time_off` (see
  [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql)).

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the two Supabase values, see below
npm run dev                  # http://localhost:3200
```

## Setting up Supabase (one-time)

1. Create a free project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Project Settings → API → copy the **Project URL** and the
   **service_role** secret key.
3. Paste them into `.env.local` (locally) and into Vercel's environment
   variables (for the deployed app) as `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Project → SQL Editor → run the contents of
   [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql).
   That's the entire schema — one table.

## Deploying

The app is meant to live on GitHub with Vercel deploying from it:

1. Push this repo to a new GitHub repo (see commands below).
2. In [vercel.com/new](https://vercel.com/new), import that GitHub repo.
   Vercel auto-detects Next.js — no build config needed.
3. Add the two environment variables from the Supabase step above under
   Vercel Project Settings → Environment Variables.
4. Deploy. Every push to the main branch redeploys automatically.

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Known low-risk advisory

`npm audit` flags a couple of high-severity CVEs in `postgres`/`sharp`
that live inside Next.js's own bundled image-optimizer tooling (not a
direct dependency of this app). This app doesn't process untrusted
images or run user-supplied CSS through PostCSS at runtime — the only
image is the static Fit Factory logo — so real-world exposure here is
effectively nil. Worth revisiting on the next Next.js major upgrade.
