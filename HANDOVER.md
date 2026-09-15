# Handover — Vacation Tracker

**In plain terms:** where the team logs their own time off, and where managers see who's
away at a glance (a dashboard) and a calendar view of everyone's time off for the month.

**Owner until 2026-09-29:** Lucas Rietsch (lucas@fitfactoryfitness.com).

## Do you need to touch any code?

**No.** This is just a web page. Nobody using it day-to-day needs to see any code.

## How to actually use it

Open this link: **https://fit-factory-vacation-tracker.vercel.app/**

## ⚠️ How "who's logging in" actually works — worth knowing

There's **no password login**. When you open the page, you pick your own name from a list,
and the app remembers that choice on that browser/device. There's nothing stopping someone
from picking a different person's name and logging time off "as" them — it runs on trust, not
a real login system. This is likely an intentional simplicity choice for a small team, but
flagging it clearly so it's a known tradeoff, not a surprise later.

## Setting up access (do this before 2026-09-29)

### 1. Vercel (hosts the web page)
1. Go to **vercel.com** and sign in.
2. Whoever has access to the account currently hosting this clicks the **team/account name**
   (top left) → **Settings** → **Members** → **Invite Member**.
3. Enter the new owner's email, choose a role, send the invite.
4. They accept it from their email.

*Note: this project's Vercel account/team wasn't identifiable from the files on Lucas's
laptop — log into vercel.com to confirm which account it's under before inviting anyone.*

### 2. Supabase (the real database — everyone's time-off records and the team roster)
1. Go to **supabase.com** and sign in.
2. Click the **organization name** (top left) → **Team** (in Settings).
3. Click **Invite**, enter the new owner's email, choose a role, send.
4. They accept it from their email.

If nobody but Lucas has access to this Supabase project, the team's time-off history and
roster could be hard to recover once he leaves — this is worth prioritizing early, not last.

### 3. GitHub (where the code itself lives)
Nothing you need to do unless you're editing code yourself. Lucas will move this repository
into a Fit Factory GitHub organization — see the master handover plan.

## For whoever becomes the technical contact

There's a `supabase/` folder with the database migrations. Worth double-checking how the
client actually talks to Supabase in production — the environment variables found locally
were unusual (missing the normal "public" key a browser-facing app typically needs), so this
may be worth a quick review rather than assuming it's set up the standard way.
