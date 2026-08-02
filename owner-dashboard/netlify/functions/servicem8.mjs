/* =====================================================================
   KTRONICS OWNER DASHBOARD — ServiceM8 live data function
   =====================================================================
   Runs on Netlify's servers. The API key lives in the environment
   variable SERVICEM8_API_KEY and never reaches the browser.

   Set in Netlify: Site configuration → Environment variables
     SERVICEM8_API_KEY        (required) — from ServiceM8 Settings → API Keys
     LICENCE_SHEET_CSV_URL    (optional) — a Google Sheet published as CSV
                              with columns: item, holder, identifier,
                              expiry_date (YYYY-MM-DD), document_link, notes

   Returns a partial KTRONICS_DATA object. The dashboard merges it over
   data.js and flips the affected panels from SAMPLE to LIVE.

   NOTE (spec §02): field names below follow ServiceM8's api_1.0 job/company
   schema. If ServiceM8 renames fields this function degrades gracefully —
   each section is computed independently and simply omitted on failure,
   and the dashboard keeps its last saved data for that panel.
   ===================================================================== */

import { createHash } from "node:crypto";

const API = "https://api.servicem8.com/api_1.0";

/* ---- helpers ------------------------------------------------------- */

function monthKey(d) {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return M[d.getMonth()] + " " + d.getFullYear();
}
function parseDate(s) {
  if (!s || typeof s !== "string" || s.startsWith("0000")) return null;
  const d = new Date(s.replace(" ", "T"));
  return isNaN(d) ? null : d;
}
function num(x) { const v = parseFloat(x); return isNaN(v) ? 0 : v; }

/* Actual time on the job, not a diary booking. ServiceM8 JobActivity:
   activity_was_scheduled = scheduled in advance (dispatch block);
   activity_was_recorded  = recorded actual time. Mutually exclusive.
   Only recorded entries count as time spent. */
function isRecorded(a) {
  const r = a.activity_was_recorded;
  if (r === true || r === 1 || r === "1") return true;
  const s = a.activity_was_scheduled;
  if (s === true || s === 1 || s === "1") return false;
  /* neither flag present (schema drift) — treat as recorded so data isn't silently dropped */
  return r === undefined && s === undefined;
}

async function sm8(path, apiKey) {
  const res = await fetch(API + path, {
    headers: { "X-API-Key": apiKey, "Accept": "application/json" }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ServiceM8 ${path} → HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  return res.json();
}

/* Simple CSV parser (handles quoted fields) for the licence Sheet. */
function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
      row = []; cell = "";
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/* ---- main ---------------------------------------------------------- */

export default async (request) => {
  const apiKey = process.env.SERVICEM8_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "SERVICEM8_API_KEY not configured" }, { status: 500 });
  }

  /* Access control: when DASHBOARD_PASSCODE_HASH is set, the request must
     carry the dashboard passcode (sent by the page after the gate) whose
     sha-256 matches. Stops anyone with the URL reading the raw feed. */
  const reqUrl = new URL(request.url);
  const gateHash = process.env.DASHBOARD_PASSCODE_HASH;
  if (gateHash) {
    const supplied = request.headers.get("x-dashboard-pass") || reqUrl.searchParams.get("pass") || "";
    const suppliedHash = createHash("sha256").update(supplied).digest("hex");
    if (suppliedHash !== gateHash.trim().toLowerCase()) {
      return Response.json({ error: "unauthorised" }, {
        status: 401,
        headers: { "Cache-Control": "no-store" }
      });
    }
  }
  /* ?inspect=<job number> — returns the raw ServiceM8 records behind one
     job's cost estimate, so any figure can be audited to its source. */
  const inspect = reqUrl.searchParams.get("inspect");

  const now = new Date();
  const out = { meta: { lastSync: now.toISOString() } };
  const errors = [];

  /* ---- jobs + companies (one filtered pull each) ---- */
  let jobs = null, companies = null;
  try {
    const since = new Date(now); since.setMonth(since.getMonth() - 26);
    const sinceStr = since.toISOString().slice(0, 10);
    const filter = encodeURIComponent(`date gt '${sinceStr}'`);
    [jobs, companies] = await Promise.all([
      sm8(`/job.json?%24filter=${filter}`, apiKey),
      sm8(`/company.json`, apiKey)
    ]);
  } catch (e) { errors.push(String(e.message || e)); }

  /* ---- job-costing inputs for the Value vs spend panel ---- */
  let activities = null, materials = null, staffList = null, categories = null, contacts = null;
  try {
    const actSince = new Date(now); actSince.setDate(actSince.getDate() - 400);
    const af = encodeURIComponent(`edit_date gt '${actSince.toISOString().slice(0, 10)}'`);
    [activities, materials, staffList, categories, contacts] = await Promise.all([
      sm8(`/jobactivity.json?%24filter=${af}`, apiKey),
      sm8(`/jobmaterial.json?%24filter=${af}`, apiKey),
      sm8(`/staff.json`, apiKey).catch(() => null),
      sm8(`/category.json`, apiKey).catch(() => null),
      sm8(`/companycontact.json`, apiKey).catch(() => null)
    ]);
  } catch (e) { errors.push("job costing inputs: " + String(e.message || e)); }

  if (Array.isArray(jobs)) {
    const active = jobs.filter(j => String(j.active) !== "0");
    const isWon = j => j.status === "Completed" || j.status === "Work Order";
    const isLost = j => j.status === "Unsuccessful";
    const isQuote = j => j.status === "Quote";
    const completed = active.filter(j => j.status === "Completed");

    /* revenue by month — completed jobs by completion date, last 25 months */
    try {
      const buckets = new Map();
      for (let i = 24; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.set(monthKey(d), 0);
      }
      for (const j of completed) {
        const d = parseDate(j.completion_date) || parseDate(j.date);
        if (!d) continue;
        const k = monthKey(d);
        if (buckets.has(k)) buckets.set(k, buckets.get(k) + num(j.total_invoice_amount));
      }
      out.revenueByMonth = {
        live: true,
        series: [...buckets.entries()].map(([m, v]) => [m, Math.round(v * 100) / 100])
      };
    } catch (e) { errors.push("revenueByMonth: " + e.message); }

    /* win / lose by month of job creation, last 13 months.
       win = quote progressed to Work Order/Completed; lost = Unsuccessful */
    try {
      const wl = new Map();
      for (let i = 12; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        wl.set(monthKey(d), [0, 0]);
      }
      for (const j of active) {
        const d = parseDate(j.date);
        if (!d) continue;
        const k = monthKey(d);
        if (!wl.has(k)) continue;
        if (isWon(j)) wl.get(k)[0]++;
        else if (isLost(j)) wl.get(k)[1]++;
      }
      out.winLose = { live: true, series: [...wl.entries()].map(([m, a]) => [m, a[0], a[1]]) };
    } catch (e) { errors.push("winLose: " + e.message); }

    /* 28-day KPI tiles */
    try {
      const d28 = new Date(now - 28 * 864e5), d56 = new Date(now - 56 * 864e5);
      const inWin = (j, a, b) => { const d = parseDate(j.completion_date); return d && d > a && d <= b; };
      const cur = completed.filter(j => inWin(j, d28, now));
      const prev = completed.filter(j => inWin(j, d56, d28));
      const sum = arr => arr.reduce((s, j) => s + num(j.total_invoice_amount), 0);
      const wonC = active.filter(j => isWon(j) && parseDate(j.date) > d28).length;
      const lostC = active.filter(j => isLost(j) && parseDate(j.date) > d28).length;
      const wonP = active.filter(j => { const d = parseDate(j.date); return isWon(j) && d > d56 && d <= d28; }).length;
      const lostP = active.filter(j => { const d = parseDate(j.date); return isLost(j) && d > d56 && d <= d28; }).length;
      out.kpis28d = {
        live: true,
        revenue: Math.round(sum(cur)),
        revenuePrev: Math.round(sum(prev)),
        jobsCompleted: cur.length, jobsCompletedPrev: prev.length,
        avgJobValue: cur.length ? Math.round(sum(cur) / cur.length) : 0,
        avgJobValuePrev: prev.length ? Math.round(sum(prev) / prev.length) : 0,
        winRate: (wonC + lostC) ? wonC / (wonC + lostC) : null,
        winRatePrev: (wonP + lostP) ? wonP / (wonP + lostP) : null
      };
    } catch (e) { errors.push("kpis28d: " + e.message); }

    /* pipeline — open quotes */
    try {
      const open = active.filter(isQuote);
      const staleCut = new Date(now - 21 * 864e5);
      const val = open.reduce((s, j) => s + num(j.total_invoice_amount), 0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const wonMonth = active.filter(j => isWon(j) && parseDate(j.quote_date || j.date) &&
        (parseDate(j.completion_date) || parseDate(j.date)) >= monthStart);
      out.pipeline = {
        sample: false, live: true,
        openValue: Math.round(val),
        awaitingDecision: { count: open.length, value: Math.round(val) },
        staleCount: open.filter(j => { const d = parseDate(j.quote_date) || parseDate(j.date); return d && d < staleCut; }).length,
        wonThisMonth: { count: wonMonth.length, value: Math.round(wonMonth.reduce((s, j) => s + num(j.total_invoice_amount), 0)) }
      };
    } catch (e) { errors.push("pipeline: " + e.message); }

    /* key clients — completed revenue this calendar year */
    try {
      const names = new Map();
      if (Array.isArray(companies)) for (const c of companies) names.set(c.uuid, c.name || "Unknown");
      const jan1 = new Date(now.getFullYear(), 0, 1);
      const byClient = new Map();
      let total = 0;
      for (const j of completed) {
        const d = parseDate(j.completion_date) || parseDate(j.date);
        if (!d || d < jan1) continue;
        const v = num(j.total_invoice_amount);
        total += v;
        byClient.set(j.company_uuid, (byClient.get(j.company_uuid) || 0) + v);
      }
      /* effort per client: recorded hours + costed materials, calendar YTD */
      const rateC = num(process.env.LABOUR_COST_RATE) || 60;
      const jobCompany = new Map();
      for (const j of jobs) jobCompany.set(j.uuid, j.company_uuid);
      const hoursByClient = new Map(); let totalHours = 0;
      if (Array.isArray(activities)) for (const a of activities) {
        if (String(a.active) === "0" || !isRecorded(a)) continue;
        const s = parseDate(a.start_date), e = parseDate(a.end_date);
        if (!s || !e || s < jan1) continue;
        const h = (e - s) / 36e5;
        if (h <= 0 || h > 16) continue;
        const cu = jobCompany.get(a.job_uuid);
        if (!cu) continue;
        hoursByClient.set(cu, (hoursByClient.get(cu) || 0) + h);
        totalHours += h;
      }
      const matByClient = new Map();
      if (Array.isArray(materials)) for (const m of materials) {
        if (String(m.active) === "0" || !(num(m.cost) > 0)) continue;
        const cu = jobCompany.get(m.job_uuid);
        if (!cu) continue;
        matByClient.set(cu, (matByClient.get(cu) || 0) + num(m.cost) * (num(m.qty) || 1));
      }
      const top = [...byClient.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
      out.clients = {
        live: true,
        totalRevenueYtd: Math.round(total),
        totalEffortHours: Math.round(totalHours),
        period: now.getFullYear() + " calendar YTD",
        list: top.map(([uuid, v], i) => {
          const h = hoursByClient.get(uuid) || 0;
          return {
            name: names.get(uuid) || "Unknown client",
            anon: "Client " + String.fromCharCode(65 + i),
            revenue: Math.round(v),
            hours: Math.round(h),
            estSpend: Math.round(h * rateC + (matByClient.get(uuid) || 0)),
            effortShare: totalHours > 0 ? h / totalHours : null
          };
        })
      };
    } catch (e) { errors.push("clients: " + e.message); }
  }

  /* ---- inspect mode: raw records for one job ---- */
  if (inspect && Array.isArray(jobs)) {
    const target = jobs.find(j => String(j.generated_job_id || "").trim().toLowerCase() === inspect.trim().toLowerCase());
    if (!target) return Response.json({ inspect, error: "job number not found in fetched jobs" }, { headers: { "Cache-Control": "no-store" } });
    const sName = new Map();
    if (Array.isArray(staffList)) for (const s of staffList) sName.set(s.uuid, (s.first || s.name || "") + " " + (s.last || ""));
    const acts = (Array.isArray(activities) ? activities : [])
      .filter(a => a.job_uuid === target.uuid)
      .map(a => {
        const s = parseDate(a.start_date), e = parseDate(a.end_date);
        const hrs = (s && e) ? Math.round((e - s) / 36e4) / 10 : null;
        return {
          uuid: a.uuid, staff: (sName.get(a.staff_uuid) || a.staff_uuid || "").trim(),
          start_date: a.start_date, end_date: a.end_date, hours: hrs,
          activity_was_recorded: a.activity_was_recorded, activity_was_scheduled: a.activity_was_scheduled,
          active: a.active,
          countedAsCost: String(a.active) !== "0" && isRecorded(a) && s && e && hrs > 0 && hrs <= 16,
          excludedReason: String(a.active) === "0" ? "inactive/deleted" : !isRecorded(a) ? "scheduled booking, not recorded time" : (hrs != null && hrs > 16) ? "corrupt (>16h) — flagged, not costed" : (!s || !e) ? "missing start/end" : null
        };
      });
    const mats = (Array.isArray(materials) ? materials : [])
      .filter(m => m.job_uuid === target.uuid)
      .map(m => ({ uuid: m.uuid, name: m.name, qty: m.qty, cost: m.cost, price: m.price, active: m.active }));
    return Response.json({
      inspect: { jobNumber: inspect, uuid: target.uuid, status: target.status, description: String(target.job_description || "").slice(0, 120), value: target.total_invoice_amount },
      activities: acts, materials: mats
    }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }

  /* ---- LIVE Value vs spend — active jobs with data-quality flags ----
     Labour cost = logged hours × LABOUR_COST_RATE (env, default $60/h)
     until per-staff cost rates exist in ServiceM8 Job Costing.
     Every row carries flags for data that needs fixing — suspect
     timesheet entries, missing cost, materials without cost prices. */
  if (Array.isArray(jobs) && Array.isArray(activities)) {
    try {
      const rate = num(process.env.LABOUR_COST_RATE) || 60;
      const staffName = new Map();
      if (Array.isArray(staffList)) for (const s of staffList)
        staffName.set(s.uuid, (s.first || s.name || "").trim().split(" ")[0] || "Tech");
      const catName = new Map();
      if (Array.isArray(categories)) for (const c of categories)
        catName.set(c.uuid, (c.name || "").trim());
      const compName = new Map();
      if (Array.isArray(companies)) for (const c of companies) compName.set(c.uuid, c.name || "");

      /* index timesheet activity by job; track per-staff weekly totals */
      const actByJob = new Map(), weekTotal = new Map();
      const weekKey = d => { const m = new Date(d); m.setDate(m.getDate() - m.getDay()); return m.toISOString().slice(0, 10); };
      for (const a of activities) {
        if (String(a.active) === "0" || !isRecorded(a)) continue;
        const s = parseDate(a.start_date), e = parseDate(a.end_date);
        if (!s || !e) continue;
        const hrs = (e - s) / 36e5;
        if (hrs <= 0) continue;
        const rec = { staff: a.staff_uuid, hrs, date: s, wk: weekKey(s) };
        if (!actByJob.has(a.job_uuid)) actByJob.set(a.job_uuid, []);
        actByJob.get(a.job_uuid).push(rec);
        const k = a.staff_uuid + "|" + rec.wk;
        weekTotal.set(k, (weekTotal.get(k) || 0) + hrs);
      }

      /* index materials by job.
         Only lines with a real COST price count as spend. Lines without one
         (often billable service items at sell price) count as ZERO and are
         flagged — never silently inflate cost with sell prices. */
      const matByJob = new Map();
      if (Array.isArray(materials)) for (const m of materials) {
        if (String(m.active) === "0") continue;
        const qty = num(m.qty) || 1;
        const cur = matByJob.get(m.job_uuid) || { cost: 0, uncostedSell: 0, uncostedLines: 0 };
        if (num(m.cost) > 0) cur.cost += num(m.cost) * qty;
        else if (num(m.price) > 0) { cur.uncostedSell += num(m.price) * qty; cur.uncostedLines++; }
        matByJob.set(m.job_uuid, cur);
      }

      const wo = jobs.filter(j => String(j.active) !== "0" && j.status === "Work Order");
      const doneCut = new Date(now - 120 * 864e5);
      const done = jobs.filter(j => String(j.active) !== "0" && j.status === "Completed" &&
        (parseDate(j.completion_date) || new Date(0)) > doneCut);
      const fmtD = d => d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" });
      const buildRow = j => {
        const acts = actByJob.get(j.uuid) || [];
        /* corrupt entries (>16h) are flagged but excluded from the cost estimate */
        const hours = acts.reduce((s, a) => s + (a.hrs <= 16 ? a.hrs : 0), 0);
        const mat = matByJob.get(j.uuid) || { cost: 0, uncostedSell: 0, uncostedLines: 0 };
        const labour = hours * rate;
        const costToDate = Math.round(labour + mat.cost);
        const value = num(j.total_invoice_amount);
        const flags = [];
        /* suspect single entries (> 16h in one go) */
        for (const a of acts) {
          if (a.hrs > 16) flags.push((staffName.get(a.staff) || "Someone") + " logged " +
            Math.round(a.hrs) + "h in a single entry on " + fmtD(a.date) + " — fix this timesheet");
        }
        /* suspect weeks (> 70h for one person, any job they touched) */
        const seenWk = new Set();
        for (const a of acts) {
          const k = a.staff + "|" + a.wk, t = weekTotal.get(k) || 0;
          if (t > 70 && !seenWk.has(k)) {
            seenWk.add(k);
            flags.push((staffName.get(a.staff) || "Someone") + " logged " + Math.round(t) +
              "h in the week of " + fmtD(new Date(a.wk)) + " — check clock-ons");
          }
        }
        if (mat.uncostedLines > 0 && mat.uncostedSell > 500) {
          flags.push(mat.uncostedLines + " material/service line" + (mat.uncostedLines > 1 ? "s" : "") +
            " ($" + Math.round(mat.uncostedSell / 1000) + "k at sell value) have no cost price — not counted as spend");
        }
        const noCost = hours === 0 && mat.cost === 0;
        const cat = catName.get(j.category_uuid) || "";
        const desc = String(j.job_description || "").replace(/\s+/g, " ").trim();
        return {
          live: true, type: "install",
          name: compName.get(j.company_uuid) || "Unknown client",
          codeName: "Job " + (j.generated_job_id || "").toString().trim(),
          sub: (desc.length > 52 ? desc.slice(0, 52) + "…" : desc) || "no description",
          pillText: cat || null,
          contractValue: Math.round(value),
          costToDate,
          labourCost: Math.round(labour),
          materialCost: Math.round(mat.cost),
          hours: Math.round(hours * 10) / 10,
          noCost, flags: flags.slice(0, 3)
        };
      };
      const rows = wo.map(buildRow);
      rows.sort((a, b) => (b.contractValue || 0) - (a.contractValue || 0));
      const doneRows = done.map(j => {
        const r = buildRow(j);
        r.completed = true;
        const cd = parseDate(j.completion_date);
        if (cd) r.sub = "done " + fmtD(cd) + " · " + r.sub;
        return r;
      });
      doneRows.sort((a, b) => (b.contractValue || 0) - (a.contractValue || 0));
      out.jobs = {
        sample: false, live: true,
        activeCount: wo.length,
        completedCount: done.length,
        completedDays: 120,
        estRate: rate,
        list: rows.slice(0, 12),
        completed: doneRows.slice(0, 12)
      };
    } catch (e) { errors.push("jobs panel: " + String(e.message || e)); }
  }

  /* ---- Marketing growth signals — from job history ----
     "New client" = first job for that client within the fetched window
     (~26 months), so it's an approximation, labelled as such in the UI. */
  if (Array.isArray(jobs)) {
    try {
      const jan1m = new Date(now.getFullYear(), 0, 1);
      const prevJan = new Date(now.getFullYear() - 1, 0, 1);
      const samePointPrev = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const firstJob = new Map();
      for (const j of jobs) {
        if (String(j.active) === "0") continue;
        const d = parseDate(j.date);
        if (!d) continue;
        const cu = j.company_uuid;
        if (!firstJob.has(cu) || d < firstJob.get(cu)) firstJob.set(cu, d);
      }
      let newYtd = 0, newPrev = 0;
      for (const d of firstJob.values()) {
        if (d >= jan1m) newYtd++;
        else if (d >= prevJan && d <= samePointPrev) newPrev++;
      }
      let ytdJobs = 0, retJobs = 0;
      for (const j of jobs) {
        if (String(j.active) === "0") continue;
        const d = parseDate(j.date);
        if (!d || d < jan1m) continue;
        ytdJobs++;
        const f = firstJob.get(j.company_uuid);
        if (f && f < jan1m) retJobs++;
      }
      out.marketing = {
        sample: false, live: true,
        newClientsYtd: newYtd, newClientsPrevYtd: newPrev,
        ytdJobs, returningShare: ytdJobs ? retJobs / ytdJobs : null
      };
    } catch (e) { errors.push("marketing: " + String(e.message || e)); }
  }

  /* ---- CRM leads — open quotes as lead cards, with client contact ---- */
  if (Array.isArray(jobs)) {
    try {
      const compName = new Map();
      if (Array.isArray(companies)) for (const c of companies) compName.set(c.uuid, c.name || "");
      /* best contact per company: prefer one with mobile or email */
      const contactBy = new Map();
      if (Array.isArray(contacts)) for (const ct of contacts) {
        if (String(ct.active) === "0") continue;
        const cur = contactBy.get(ct.company_uuid);
        const score = (ct.mobile ? 2 : 0) + (ct.email ? 1 : 0);
        const curScore = cur ? (cur.mobile ? 2 : 0) + (cur.email ? 1 : 0) : -1;
        if (score > curScore) contactBy.set(ct.company_uuid, ct);
      }
      const leads = jobs
        .filter(j => String(j.active) !== "0" && j.status === "Quote")
        .map(j => {
          const qd = parseDate(j.quote_date) || parseDate(j.date);
          const ct = contactBy.get(j.company_uuid);
          const desc = String(j.job_description || "").replace(/\s+/g, " ").trim();
          return {
            jobNo: "Job " + String(j.generated_job_id || "").trim(),
            client: compName.get(j.company_uuid) || "Unknown client",
            desc: desc.length > 90 ? desc.slice(0, 90) + "…" : desc,
            value: Math.round(num(j.total_invoice_amount)),
            quoteDate: qd ? qd.toISOString().slice(0, 10) : null,
            ageDays: qd ? Math.floor((now - qd) / 864e5) : null,
            contact: ct ? {
              name: ((ct.first || "") + " " + (ct.last || "")).trim(),
              mobile: (ct.mobile || ct.phone || "").trim(),
              email: (ct.email || "").trim()
            } : null,
            url: "https://go.servicem8.com/OpenJob/" + j.uuid
          };
        });
      leads.sort((a, b) => b.value - a.value);
      out.crm = { sample: false, live: true, totalCount: leads.length, list: leads.slice(0, 40) };
    } catch (e) { errors.push("crm leads: " + String(e.message || e)); }
  }

  /* ---- Timesheet hygiene — job check-in flags per tech, last 7 days ----
     Catches: days with no job check-ins at all, check-ins never checked
     out of, and corrupt entries (> 16h). Hygiene, not performance. */
  if (Array.isArray(activities) && Array.isArray(staffList)) {
    try {
      const fmtD = d => d.toLocaleDateString("en-AU", { weekday: "short", day: "2-digit", month: "short" });
      const cut7 = new Date(now - 7 * 864e5), cut21 = new Date(now - 21 * 864e5);
      const recent = activities.filter(a => {
        if (String(a.active) === "0" || !isRecorded(a)) return false;
        const s = parseDate(a.start_date);
        return s && s > cut21;
      });
      const fieldStaff = new Set(recent.map(a => a.staff_uuid));
      const jobNoMap = new Map();
      if (Array.isArray(jobs)) for (const j of jobs) jobNoMap.set(j.uuid, String(j.generated_job_id || "").trim());
      const byStaffDay = new Map();  // staff|yyyy-mm-dd -> {hrs, openEnds, corrupt, firstIn, lastOut, jobs}
      for (const a of recent) {
        const s = parseDate(a.start_date);
        if (s < cut7) continue;
        const e = parseDate(a.end_date);
        const key = a.staff_uuid + "|" + s.toISOString().slice(0, 10);
        const rec = byStaffDay.get(key) || { hrs: 0, openEnds: 0, corrupt: 0, firstIn: null, lastOut: null, jobs: new Map() };
        if (!rec.firstIn || s < rec.firstIn) rec.firstIn = s;
        if (!e || e <= s) rec.openEnds++;
        else {
          const h = (e - s) / 36e5;
          if (!rec.lastOut || e > rec.lastOut) rec.lastOut = e;
          if (h > 16) rec.corrupt++;
          else {
            rec.hrs += h;
            const jn = jobNoMap.get(a.job_uuid) || "unknown job";
            rec.jobs.set(jn, (rec.jobs.get(jn) || 0) + h);
          }
        }
        byStaffDay.set(key, rec);
      }
      const hhmm = d => d ? d.toTimeString().slice(0, 5) : null;
      const list = [];
      for (const su of fieldStaff) {
        const st = (staffList || []).find(s => s.uuid === su);
        if (st && String(st.active) === "0") continue;
        const name = st ? ((st.first || st.name || "").trim().split(" ")[0] || "Tech") : "Tech";
        let daysWith = 0, workdays = 0; const flags = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now - i * 864e5);
          const dow = d.getDay();
          if (dow === 0 || dow === 6) continue;   // weekdays only
          if (i === 0) continue;                   // today isn't finished yet
          workdays++;
          const rec = byStaffDay.get(su + "|" + d.toISOString().slice(0, 10));
          if (rec && (rec.hrs > 0 || rec.openEnds > 0 || rec.corrupt > 0)) {
            daysWith++;
            if (rec.openEnds > 0) flags.push(rec.openEnds + " job" + (rec.openEnds > 1 ? "s" : "") +
              " not checked out of on " + fmtD(d));
            if (rec.corrupt > 0) flags.push("corrupt entry (>16h) on " + fmtD(d) + " — fix this");
          } else {
            flags.push("No job check-ins " + fmtD(d));
          }
        }
        /* day-by-day detail: first check-in, hours, jobs touched */
        const detail = [];
        for (let i = 0; i <= 6; i++) {
          const d = new Date(now - i * 864e5);
          const dow = d.getDay();
          const rec = byStaffDay.get(su + "|" + d.toISOString().slice(0, 10));
          if (!rec && (dow === 0 || dow === 6)) continue;   // skip empty weekends
          const label = d.toLocaleDateString("en-AU", { weekday: "short", day: "2-digit", month: "short" });
          if (!rec) { detail.push({ day: label, none: true }); continue; }
          detail.push({
            day: label,
            firstIn: hhmm(rec.firstIn), lastOut: hhmm(rec.lastOut),
            hours: Math.round(rec.hrs * 10) / 10,
            openEnds: rec.openEnds, corrupt: rec.corrupt,
            jobs: [...rec.jobs.entries()].map(([no, h]) => ({ no, hrs: Math.round(h * 10) / 10 }))
              .sort((a, b) => b.hrs - a.hrs)
          });
        }
        if (workdays > 0) list.push({ name, daysWith, workdays, flags: flags.slice(0, 4), detail });
      }
      list.sort((a, b) => (b.flags.length - a.flags.length));
      if (list.length) out.techHygiene = { sample: false, live: true, days: 7, list };
    } catch (e) { errors.push("timesheet hygiene: " + String(e.message || e)); }
  }

  /* ---- Team cost — wages + super, whole-team aggregate only ----
     Wages aren't in ServiceM8. Set TEAM_ANNUAL_WAGES in Netlify env
     (combined gross annual wages, one number). Hours + headcount are live. */
  try {
    let hours28 = null;
    if (Array.isArray(activities)) {
      const cut = new Date(now - 28 * 864e5);
      hours28 = 0;
      for (const a of activities) {
        if (String(a.active) === "0" || !isRecorded(a)) continue;
        const s = parseDate(a.start_date), e = parseDate(a.end_date);
        if (!s || !e || s < cut) continue;
        const h = (e - s) / 36e5;
        if (h > 0 && h <= 16) hours28 += h;   // exclude corrupt entries from the estimate
      }
      hours28 = Math.round(hours28);
    }
    const headcount = Array.isArray(staffList)
      ? staffList.filter(s => String(s.active) !== "0").length : null;
    const tc = { live: true, sample: false, hours28d: hours28, headcount };
    const wages = num(process.env.TEAM_ANNUAL_WAGES);
    if (wages > 0) tc.totalAnnualWages = wages;
    const sr = num(process.env.SUPER_RATE); if (sr > 0) tc.superRate = sr;
    const oc = num(process.env.ON_COSTS_RATE); if (oc > 0) tc.onCostsRate = oc;
    out.teamCost = tc;
  } catch (e) { errors.push("team cost: " + String(e.message || e)); }

  /* ---- licences from the Google Sheet (optional) ---- */
  const sheetUrl = process.env.LICENCE_SHEET_CSV_URL;
  if (sheetUrl) {
    try {
      const res = await fetch(sheetUrl, { redirect: "follow" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCsv(await res.text());
      const head = rows[0].map(h => h.trim().toLowerCase());
      const col = n => head.indexOf(n);
      const list = rows.slice(1)
        .filter(r => r[col("item")] && r[col("expiry_date")])
        .map(r => ({
          item: r[col("item")].trim(),
          sub: (r[col("holder")] || r[col("notes")] || "").trim(),
          expiry: r[col("expiry_date")].trim(),
          url: (col("document_link") >= 0 ? r[col("document_link")] : "").trim()
        }));
      if (list.length) out.licences = { sample: false, live: true, list };
    } catch (e) { errors.push("licences sheet: " + e.message); }
  }

  if (errors.length) out.syncErrors = errors;
  const ok = out.revenueByMonth || out.clients || out.licences;

  return Response.json(out, {
    status: ok ? 200 : 502,
    headers: {
      "Cache-Control": "no-store",              // always fresh — page fetches once per load
      "X-Robots-Tag": "noindex"
    }
  });
};
