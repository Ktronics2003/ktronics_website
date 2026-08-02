/* =====================================================================
   KTRONICS OWNER DASHBOARD — DATA LAYER
   =====================================================================
   Everything the dashboard renders comes from this file. When ServiceM8
   is connected, replace the SAMPLE blocks with synced values (or point
   the build at a generated data.js) — the UI does not need to change.

   entries marked  live:true   → real numbers from ServiceM8 exports, 23 Jul 2026
   entries marked  sample:true → placeholder from the approved spec mockup;
                                 rendered with a SAMPLE badge until wired up.
   ===================================================================== */

window.KTRONICS_DATA = {

  meta: {
    business: "Ktronics Pty Ltd",
    abn: "54 169 716 527",
    lastSync: "2026-07-23T19:10:00+10:00",     // stale banner appears 36h after this
    exportedBy: "ServiceM8 report exports",
    // sha-256 of the passcode. Default passcode: ktronics2026
    // Change it: run  echo -n "newpass" | shasum -a 256   and paste the hash here.
    passcodeHash: "87abaa24b865ede2411b0f0484eb4ca5a5c7d04000816fff72f86e2032c27f0d",
    anonymiseByDefault: true
  },

  /* All thresholds in one place — tune here, not in the UI code. */
  thresholds: {
    installAmber: 0.70,        // burn_pct ≥ → "Burning fast"
    installRed:   0.90,        // burn_pct ≥ → "Over budget"
    contractAmber: 0.05,       // pace_delta > → "Over-servicing" (amber)
    contractRed:   0.15,       // pace_delta > → "Over-servicing" (red)
    leakageAmberHrs: 0,        // unbilled hrs > → "Leakage" (amber)
    leakageRedHrs:   3,        // unbilled hrs > → "Leakage" (red)
    licenceAmberDays: 60,
    licenceRedDays:   30,
    clientConcentrationRed: 0.25,  // single client share ≥ → red bar
    staleQuoteDays: 21,
    staleSyncHours: 36
  },

  /* ------------------------------------------------------------------
     LIVE — monthly invoiced revenue (ServiceM8 custom report export)
     ------------------------------------------------------------------ */
  revenueByMonth: { live: true, series: [
    ["Jul 2024", 9203.50], ["Aug 2024", 36194.44], ["Sep 2024", 115677.74],
    ["Oct 2024", 28937.49], ["Nov 2024", 23822.20], ["Dec 2024", 29277.14],
    ["Jan 2025", 41659.97], ["Feb 2025", 34443.68], ["Mar 2025", 130893.11],
    ["Apr 2025", 46470.14], ["May 2025", 57164.78], ["Jun 2025", 144136.00],
    ["Jul 2025", 99410.22], ["Aug 2025", 189977.96], ["Sep 2025", 205783.98],
    ["Oct 2025", 62968.45], ["Nov 2025", 259037.12], ["Dec 2025", 127441.13],
    ["Jan 2026", 99715.64], ["Feb 2026", 105284.03], ["Mar 2026", 102032.29],
    ["Apr 2026", 97726.20], ["May 2026", 80920.25], ["Jun 2026", 101370.63],
    ["Jul 2026", 51607.45]
  ]},

  /* LIVE — quote win / lose by month (jobs successful, jobs lost) */
  winLose: { live: true, series: [
    ["Jul 2025", 63, 11], ["Aug 2025", 59, 6], ["Sep 2025", 70, 6],
    ["Oct 2025", 55, 17], ["Nov 2025", 43, 5], ["Dec 2025", 21, 2],
    ["Jan 2026", 33, 7], ["Feb 2026", 36, 2], ["Mar 2026", 41, 7],
    ["Apr 2026", 62, 1], ["May 2026", 58, 40], ["Jun 2026", 63, 7],
    ["Jul 2026", 31, 0]
  ]},

  /* LIVE — Business Dashboard tiles, last 28 days vs previous 28 days */
  kpis28d: { live: true,
    revenue: 62982,        revenuePrev: 77432,
    jobsCompleted: 79,     jobsCompletedPrev: 52,
    avgJobValue: 797,      avgJobValuePrev: 1489,
    winRate: 0.67,         winRatePrev: 0.75,
    daysToPayment: 21.0,   daysToPaymentPrev: 21.9,
    returningRate: 1.00,   returningRatePrev: 0.96,
    grossProfitMargin: -1.21   // ← data-quality signal: cost logging is broken
  },

  /* LIVE — top clients, ServiceM8 "This Year" (calendar 2026 YTD).
     totalRevenueYtd = Jan–Jul 2026 invoiced revenue, for share-of-revenue. */
  clients: { live: true,
    totalRevenueYtd: 638656,
    period: "2026 calendar YTD",
    list: [
      { name: "Amazon",                                  anon: "Client A — E-commerce logistics", revenue: 86913.56 },
      { name: "HCL Eastern Creek",                       anon: "Client B — Healthcare logistics", revenue: 37597.12 },
      { name: "Diageo Australia Limited",                anon: "Client C — Beverage mfg",         revenue: 37259.19 },
      { name: "Weir Minerals Australia Ltd",             anon: "Client D — Minerals / industrial",revenue: 27497.15 },
      { name: "HealthCare Logistics — Dolerite Way",     anon: "Client E — Healthcare logistics", revenue: 22908.39 },
      { name: "Diageo Australia — City Office",          anon: "Client F — Beverage mfg (corp)",  revenue: 15044.24 },
      { name: "SP77547 — The Edgecliff",                 anon: "Client G — Strata / residential", revenue: 11564.52 },
      { name: "Symbion Pty Ltd",                         anon: "Client H — Pharma distribution",  revenue: 9229.00 },
      { name: "Symbion — Kemps Creek",                   anon: "Client I — Pharma distribution",  revenue: 8769.20 },
      { name: "Onelink Symbion Yennora",                 anon: "Client J — Pharma distribution",  revenue: 7679.36 }
    ]
  },

  /* LIVE — data-health flags surfaced from the exports.
     "The honest dependency": every core-panel number is only as good as
     what technicians book against jobs. These are current gaps. */
  dataHealth: { live: true, flags: [
    { level: "r", title: "Cost data is not being logged",
      detail: "ServiceM8 reports gross profit margin of −121% for the last 28 days (86% prior period). Materials/labour aren't being booked against jobs consistently. The Value-vs-spend panel cannot go live until this is fixed." },
    { level: "a", title: "Timesheet hygiene — clock-ons missing",
      detail: "Mitch logged 27.7 job hrs this week with no shift clock-on/off. Rhys has two travel entries of ~135h (data error). Job costing will inherit these errors." },
    { level: "a", title: "Job Costing add-on — confirm active",
      detail: "Required for the core panel, with an internal cost rate set per staff member and a labour budget per maintenance contract." }
  ]},

  /* ------------------------------------------------------------------
     SAMPLE — everything below matches the approved spec mockup and is
     badged SAMPLE in the UI until ServiceM8 job costing + the Google
     Sheets trackers are connected.
     ------------------------------------------------------------------ */

  kpiStrip: { sample: true,
    activeProjectValue: 296000, activeProjectTrend: "+11% vs last month",
    costToDate: 185000, activeJobs: 14,
    blendedMargin: 0.37, blendedMarginTrend: "−2 pts — watch overruns",
    recurringRevenue: 186000,
    receivables: 73000, overdue60: 21000,
    openQuotes: 290000, openQuoteCount: 11
  },

  jobs: { sample: true, activeCount: 14, list: [
    { type: "install",  name: "Pharma DC — West Syd", sub: "Stage 2 CCTV expansion",
      contractValue: 84000, costToDate: 61200 },
    { type: "install",  name: "Data Centre — Co-lo", sub: "Lenel OnGuard expansion",
      contractValue: 126000, costToDate: 69300 },
    { type: "install",  name: "Corporate HQ", sub: "Multi-site access rollout",
      contractValue: 38000, costToDate: 35600 },
    { type: "contract", name: "CBD Tower", sub: "Annual service contract",
      annualFee: 12000, labourBudget: 12000, costThisYear: 8400, elapsedPct: 0.56 },
    { type: "contract", name: "Retail Group", sub: "Multi-venue service",
      annualFee: 18000, labourBudget: 18000, costThisYear: 9900, elapsedPct: 0.56 },
    { type: "contract", name: "Childcare Group", sub: "Monitoring + service",
      annualFee: 6000, labourBudget: 6000, costThisYear: 1150, elapsedPct: 0.56 },
    { type: "oneoff",   name: "Warehouse callout", sub: "After-hours fault",
      hoursBooked: 14, hoursBilled: 9, chargeRate: 130 }
  ]},

  /* Team cost — whole-team wages + super, aggregate only (no ranking).
     Preferred: leave totalAnnualWages null here and set the Netlify env var
     TEAM_ANNUAL_WAGES instead — env values stay server-side and
     passcode-protected; anything in this file is readable in page source. */
  teamCost: { sample: true,
    totalAnnualWages: null,   // e.g. 380000 — combined gross annual wages, whole team
    superRate: 0.12,          // super guarantee (12% from 1 Jul 2025)
    onCostsRate: 0.0,         // optional: workers comp / other on-costs as a % of wages
    hours28d: null,           // live from ServiceM8 once connected
    headcount: null
  },

  /* CRM leads — open quotes as lead cards. SAMPLE until the ServiceM8
     function is deployed; then live from jobs with status "Quote". */
  crm: { sample: true, totalCount: 7, list: [
    { jobNo: "Job KTR-203301", client: "Pharma DC — West Syd", desc: "Stage 3 CCTV expansion — loading dock coverage", value: 64000, quoteDate: "2026-07-20", ageDays: 3,
      contact: { name: "Site Manager", mobile: "04XX XXX XXX", email: "ops@example.com" }, url: "#" },
    { jobNo: "Job KTR-203287", client: "Data Centre — Co-lo", desc: "Access control upgrade — biometric readers", value: 48000, quoteDate: "2026-07-14", ageDays: 9,
      contact: { name: "Facilities Lead", mobile: "04XX XXX XXX", email: "" }, url: "#" },
    { jobNo: "Job KTR-203265", client: "Retail Group", desc: "Multi-venue alarm monitoring renewal + upgrades", value: 36000, quoteDate: "2026-07-10", ageDays: 13,
      contact: { name: "Ops Coordinator", mobile: "", email: "ops@example.com" }, url: "#" },
    { jobNo: "Job KTR-203198", client: "Corporate HQ", desc: "Reception turnstile replacement", value: 22000, quoteDate: "2026-06-26", ageDays: 27,
      contact: { name: "Office Manager", mobile: "04XX XXX XXX", email: "" }, url: "#" },
    { jobNo: "Job KTR-203171", client: "Beverage mfg", desc: "Perimeter fence detection — quarterly service add-on", value: 16000, quoteDate: "2026-06-20", ageDays: 33,
      contact: null, url: "#" },
    { jobNo: "Job KTR-203312", client: "Childcare Group", desc: "Additional monitoring — two new centres", value: 8000, quoteDate: "2026-07-22", ageDays: 1,
      contact: { name: "Centre Director", mobile: "04XX XXX XXX", email: "" }, url: "#" },
    { jobNo: "Job KTR-203244", client: "Warehouse — Eastern Ck", desc: "After-hours callout coverage agreement", value: 4000, quoteDate: "2026-07-03", ageDays: 20,
      contact: { name: "Warehouse Mgr", mobile: "", email: "wh@example.com" }, url: "#" }
  ]},

  /* Marketing / growth signals — SAMPLE until the function computes these
     from job history (first-job-per-client = new client). */
  marketing: { sample: true,
    newClientsYtd: 14, newClientsPrevYtd: 11,
    returningShare: 0.78, ytdJobs: 552
  },

  /* Timesheet hygiene — seeded from the 18–24 Jul timesheet export.
     Goes fully live (rolling 7 days) once the ServiceM8 function is deployed. */
  techHygiene: { sample: true, days: 7, list: [
    { name: "Mark",  daysWith: 4, workdays: 4, flags: [
      "Missing clock-off Thu 23 Jul — shift not closed" ] },
    { name: "Mitch", daysWith: 4, workdays: 4, flags: [
      "No shift clock-on/off all week — job time logged without shifts" ] },
    { name: "Rhys",  daysWith: 4, workdays: 4, flags: [
      "Two corrupt travel entries (~135h each) Sun 19 + Mon 20 — fix these",
      "Missing clock-off Thu 23 Jul" ] }
  ]},

  contractBook: { sample: true,
    arr: 186000, liveContracts: 31,
    renewing90: { count: 4, arr: 46000 },
    overServicing: { count: 2, note: "CBD Tower + 1 other" },
    lapsedQuarter: { count: 0, note: "none — retention 100%" }
  },

  pipeline: { sample: true,
    openValue: 290000,
    awaitingDecision: { count: 7, value: 198000 },
    staleCount: 3,
    wonThisMonth: { count: 5, value: 112000 }
    /* win rate rendered LIVE from winLose above */
  },

  /* Licence tracker — one row per Google Sheet row.
     Fill real expiry dates and the traffic lights compute themselves. */
  licences: { sample: true, list: [
    { item: "NSW Master Licence 102039", sub: "renew to keep trading",   expiry: "2026-08-14" },
    { item: "Security licence — Rhys",   sub: "individual operator",     expiry: "2026-09-09" },
    { item: "Security licences — Mark, Mitch", sub: "current",           expiry: "2027-03-15" },
    { item: "Public liability + PI insurance", sub: "$20m cover",        expiry: "2026-10-31" },
    { item: "ASIAL Gold membership",     sub: "Workers comp current",    expiry: "2026-12-01" }
  ]},

  /* Team structure chart (Team dashboard) — edit names/roles here. */
  orgChart: {
    name: "Karl", role: "Owner · Managing Director",
    reports: [
      { name: "Lesley", role: "Operations Manager",
        reports: [
          { name: "Rhys",  role: "Technician" },
          { name: "Mitch", role: "Technician" },
          { name: "Mark",  role: "Technician" }
        ] }
    ]
  },

  /* EOS Accountability Chart (Team dashboard) — one entry per seat.
     Draft wording: refine with Karl & Lesley, edit here. */
  accountability: [
    { seat: "Visionary / Owner", person: "Karl", items: [
      "Company direction & big decisions",
      "Key client & partner relationships",
      "Major deals, tenders & pricing calls",
      "Culture & standards",
      "Final word on money"
    ]},
    { seat: "Operations / Integrator", person: "Lesley", items: [
      "Scheduling & dispatch — right tech, right job",
      "Quoting & job admin through ServiceM8",
      "Invoicing, receivables & supplier bills",
      "Licence, insurance & compliance tracking",
      "Day-to-day issues stop with Lesley"
    ]},
    { seat: "Field Delivery", person: "Rhys · Mitch · Mark", items: [
      "On-site installs, service & callouts done right",
      "Check in / out of every job — time is the cost record",
      "Materials booked to the job they're used on",
      "Site safety, SWMS & work permits",
      "Client communication on site"
    ]}
  ],

  /* HR documents (Team dashboard) — set url per row to the Drive link. */
  hrDocs: { list: [
    { ic: "DIR", red: false, title: "Staff KPIs — scorecards",        sub: "quarterly · per staff member",        url: "#" },
    { ic: "DOC", red: false, title: "Position descriptions",          sub: "current roles",                       url: "#" },
    { ic: "DIR", red: false, title: "Employment agreements",          sub: "signed · per staff member",           url: "#" },
    { ic: "DOC", red: false, title: "Training & licence matrix",      sub: "who holds what · renewal dates",      url: "#" },
    { ic: "DOC", red: false, title: "Review templates",               sub: "quarterly check-in format",           url: "#" }
  ]},

  /* Documents — set url to the Google Drive share link for each. */
  documents: { sample: true, list: [
    { ic: "PDF", red: true,  title: "Certificate of currency — insurances", sub: "Public liability + PI · to 31 Oct", url: "#" },
    { ic: "PDF", red: true,  title: "NSW Master Licence 102039",            sub: "licence certificate",               url: "#" },
    { ic: "DOC", red: false, title: "Capability Statement 2026",            sub: "current tender version",            url: "#" },
    { ic: "DIR", red: false, title: "Master service agreements",            sub: "per client · signed contracts",     url: "#" },
    { ic: "DIR", red: false, title: "As-built drawings & site docs",        sub: "by client / by site",               url: "#" }
  ]}
};
