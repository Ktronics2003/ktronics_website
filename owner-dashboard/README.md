# Ktronics Owner Dashboard + Operations Platform

Two apps on one Netlify site, one passcode:

- `/` — the owner dashboard (live ServiceM8 data)
- `/ops/` — the operations platform (clickable design mockup, invented data — the draft of the system intended to eventually replace ServiceM8)

Unlocking either app unlocks both for the browser session. The Ops platform is currently front-end only; making it the real system of record needs a database + backend phase (see "Ops platform roadmap" discussion).

Single-screen owner dashboard for Karl (MD), built to the Owner Dashboard Spec v1.
Static site — no build step, no backend. Ready for Netlify.

## Deploy to Netlify

Easiest: drag-and-drop.

1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. Done — Netlify gives you an unguessable URL (you can rename the site in Site settings → Change site name, e.g. `ktronics-owner.netlify.app`).

Or via git: push this folder to a repo and "Import from Git" in Netlify. No build command needed; publish directory is the repo root (already set in `netlify.toml`).

## Passcode

The dashboard is behind a lightweight passcode screen.

- **Default passcode: `ktronics2026`**
- Change it: run `echo -n "yournewpass" | shasum -a 256` and paste the hash into `passcodeHash` in `data.js`.
- This is casual-access protection only — the data is still in the page source. For real security, enable Netlify's site-wide password (Site settings → Access control, paid plans) or put it behind Google sign-in later.

## Client names

Real client names live in `data.js` but the screen shows anonymised labels ("Client A — E-commerce logistics") by default, per the spec's anonymise-by-default rule. The **Names** button in the top bar toggles real names for the current viewer only.

## What's live vs sample

| Panel | Status |
|---|---|
| Live KPI strip (revenue, jobs, win rate, days-to-payment) | **LIVE** — from ServiceM8 exports, 23 Jul 2026 |
| Revenue by month chart (25 months) | **LIVE** |
| Data health flags | **LIVE** — real issues found in the exports |
| Key clients / concentration | **LIVE** — ServiceM8 Top 10 Clients |
| Money-on-the-books KPI strip | SAMPLE — needs Job Costing add-on |
| Value vs spend (core panel) | SAMPLE — needs Job Costing + cost rates |
| Contract book | SAMPLE — needs recurring-job data + renewal Sheet |
| Pipeline | SAMPLE (win rate within it is live) |
| Licences & compliance | SAMPLE dates — traffic lights compute automatically once real expiry dates are entered |
| Documents | Placeholder links — set `url` per row in `data.js` |

Every sample panel carries a visible **SAMPLE** badge. A stale-data banner appears automatically when the data is older than 36 hours (configurable), so nobody mistakes a static export for today's numbers.

## Updating the data (until ServiceM8 is connected)

Everything rendered comes from `data.js` — edit it and redeploy (or re-drag the folder). No HTML changes needed. All status thresholds (burn %, pace, licence days, concentration flag, stale quote days) are in the `thresholds` block at the top.

## Live ServiceM8 connection

The site now includes a Netlify Function (`netlify/functions/servicem8.mjs`) that pulls jobs, quotes and clients from ServiceM8 on Netlify's servers and feeds the dashboard. The API key never reaches the browser.

**Setup — three steps:**

1. **API key** — in ServiceM8: Settings → API Keys → generate a key (it inherits the access of whoever creates it, so treat it like a bank password).
2. **Environment variable** — in Netlify: Site configuration → Environment variables → Add a variable:
   - Key: `SERVICEM8_API_KEY` (exactly that — caps and underscores)
   - Value: the API key
   - Tick "Contains secret values"
3. **Deploy with the function** — drag-and-drop deploys can't include functions, so use the included `deploy.command` (double-click it; first run logs you into Netlify and links the folder to your existing site). Alternatively push this folder to a git repo and connect it in Netlify.

Once deployed, the dashboard fetches `/.netlify/functions/servicem8` on load. Panels with real data flip their badge from SAMPLE to LIVE automatically; if the sync fails, a red banner names the failure and the dashboard keeps showing the last saved data (per spec §09). Responses are cached for 15 minutes.

### Environment variables (all set in Netlify → Environment variables)

| Variable | Required | What it does |
|---|---|---|
| `SERVICEM8_API_KEY` | yes | ServiceM8 access (Settings → API Keys) |
| `DASHBOARD_PASSCODE_HASH` | strongly recommended | Locks the live data feed itself behind the dashboard passcode. Value = the same hash as `passcodeHash` in data.js |
| `LABOUR_COST_RATE` | optional | $/hour used to estimate labour cost on the Jobs tab until ServiceM8 cost rates exist (default 60) |
| `TEAM_ANNUAL_WAGES` | optional | Combined gross annual wages, whole team — lights up the Team cost card. Kept server-side so individual pay never appears anywhere |
| `SUPER_RATE` | optional | Default 0.12 (12% super guarantee) |
| `ON_COSTS_RATE` | optional | Workers comp etc as a fraction of wages, e.g. 0.03 |
| `LICENCE_SHEET_CSV_URL` | optional | Published-CSV link of the licence Google Sheet |

After adding or changing any variable, run `deploy.command` again (env changes need a redeploy to take effect on functions).

### Tabs

The dashboard is organised into four tabs — Money, Jobs, Team, Compliance — matching the spec's reading order. Red counters on the tabs show items needing attention (over-budget jobs, timesheet flags, licences due). Deep-linkable: `#jobs`, `#team`, etc.

### Jobs tab — live Value vs spend with data-quality flags

Each active job shows quoted value vs estimated cost (logged hours × `LABOUR_COST_RATE` + materials). Under each job, amber flags call out data that needs fixing: corrupt timesheet entries (>16h), suspicious weeks (>70h), jobs with no cost logged at all (hatched bar, per the spec's missing-cost rule), unquoted jobs, and materials without cost prices. Corrupt entries are excluded from the cost estimate. Client names respect the Names toggle (job numbers shown when hidden).

### Team tab

Team cost = wages + super + optional on-costs, whole-team aggregate only (per-person pay and per-tech performance ranking are deliberately excluded). Timesheet hygiene lists each tech's last 7 days of job check-ins: days with none, jobs never checked out of, corrupt entries — the fix-list for making job costing trustworthy.

**Optional — live licence tracker:** publish your licence Google Sheet as CSV (File → Share → Publish to web → CSV) with columns `item, holder, identifier, expiry_date, document_link, notes` (expiry_date as YYYY-MM-DD), then add a second Netlify environment variable `LICENCE_SHEET_CSV_URL` with that link. The compliance panel goes live with computed traffic lights.

**Still sample after connecting:** the Value-vs-spend core panel, contract book, and the money-on-the-books KPI strip need job costing data that isn't reliable yet. From the spec's prerequisites — and confirmed by the current exports (gross profit margin reads −121%, i.e. costs aren't being booked to jobs):

1. Job Costing add-on active in ServiceM8
2. Internal cost rate set per staff member
3. Technicians booking hours + materials against jobs consistently
4. A labour budget per maintenance contract

Once those are in place, the function can be extended to compute the core panel from `jobactivity` (timesheets) and `jobmaterial` records.
