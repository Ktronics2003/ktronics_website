/**
 * Single source of truth for all Case Studies.
 *
 * Read by:
 *   - /case-studies/ hub page
 *   - /case-studies/[slug]/ individual pages
 *   - Homepage FeatureCaseStudy section (eventually pulls from here)
 *
 * Per Karl's privacy rule, client names are withheld and replaced with
 * sector-level descriptors ("a multinational pharmaceutical distributor",
 * "a co-located data centre operator", etc).
 *
 * Adding a case study: append a new object below + create
 * src/pages/case-studies/[slug].astro that calls getCaseStudy(slug).
 */

export interface CaseStudyStat {
  value: string;
  suffix?: string;
  label: string;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  /** Short tag rendered on hover, e.g. "Comms rack / fit-out" */
  tag?: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  role: string;
  organisation?: string;
}

export interface CaseStudy {
  /** URL slug — must match the Astro page filename. */
  slug: string;
  /** Editorial title used in the hero (the project, not the client) */
  title: string;
  /** Short label used in cards + meta strips */
  label: string;
  /** Section card lead-in / 1-2 sentence summary */
  summary: string;
  /** Industry sector descriptor (kept generic — no client identifying info) */
  industry: string;
  /** Sydney region or generic geo descriptor */
  location: string;
  /** Single year or "Since YYYY" for ongoing relationships */
  year: string;
  /** Short comma-separated scope (e.g. "Design, install, monitor") */
  scope: string;
  /** Hero image path under /public */
  heroImage: string;
  heroImageAlt: string;
  /** SEO description for the detail page */
  metaDescription: string;
  /** The brief — what the client needed and why */
  challenge: string[];   // array of paragraphs
  /** The work — what we did, kit involved, integration approach */
  solution: string[];    // array of paragraphs
  /** The outcome — ongoing relationship, performance, what it enabled */
  outcome: string[];     // array of paragraphs
  /** Headline numbers strip */
  stats: CaseStudyStat[];
  /** Image gallery (4-8 photos typical) */
  gallery: CaseStudyImage[];
  /** Optional client quote — name omitted by default per privacy rule */
  testimonial?: CaseStudyTestimonial;
  /** Display order (lower first) */
  order: number;
  /** Toggle to true once an editorial review has signed off the page. */
  published: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'pharma-distribution-western-sydney',
    title: 'Locking down a multinational pharmaceutical distribution centre.',
    label: 'Pharma distribution centre, Western Sydney',
    summary:
      'A full-site integrated access control and surveillance system designed for compliance-grade pharmaceutical logistics: 40 access-controlled doors, 200+ cameras, and 24/7 monitoring across a multinational distributor\u2019s Western Sydney facility.',
    industry: 'Pharmaceutical logistics',
    location: 'Western Sydney',
    year: 'Ongoing since installation',
    scope: 'Design, install, monitor',
    heroImage: '/images/case-studies/ktronics-techs-walking-warehouse-pharma.jpg',
    heroImageAlt:
      'Two Ktronics technicians walking through the pharmaceutical distribution facility in Western Sydney during a security install',
    metaDescription:
      "Compliance-grade access control + full-site CCTV across a multinational pharmaceutical distribution centre in Western Sydney. 40 doors, 200+ cameras, 24/7 monitored.",

    challenge: [
      "A multinational pharmaceutical supplies distributor was scoping a new Western Sydney distribution facility and needed compliance-grade security from day one. Pharmaceutical logistics carries tight regulatory certification requirements, strict insurance conditions, and absolute control over which staff and contractors can enter which zones at which times. Failure modes are expensive in every direction: regulatory, financial, and reputational.",
      "The brief was unusually specific. A single integrated platform across access, intrusion, CCTV, and intercom. Forty access-controlled doors zoned by role and time-of-day. Two hundred plus cameras with 90-day retention and intelligent analytics. Monitoring around the clock with verified human response, not auto-dismissed alerts. And all of it had to commission cleanly with the building handover, no slipping the date.",
    ],

    solution: [
      "Ktronics designed and installed an integrated security platform spanning the full site. Access control runs on Tecom Challenger panels with Forcefield software providing the management plane; CCTV is built on Axis cameras feeding a dedicated NVR backbone with 90-day retention; intrusion and intercom are unified into the same operator console.",
      "Door-by-door zoning was mapped against the client\u2019s operations workflow during the design stage so credentials provision automatically against role: warehouse, dispatch, cold chain, office, executive. After-hours access requires verified credential plus duress PIN. Camera coverage is overlapping at every door so an incident review can resolve who, when, and how, in seconds.",
      "Install was sequenced around the building handover rather than the other way around. Cabling went in during fit-out, head-end equipment was racked and tested off-site, on-site commissioning ran in parallel with the operations team\u2019s own pre-opening walks. The system went live the day the warehouse received its first pallet.",
    ],

    outcome: [
      "Ktronics retains the maintenance contract and the system is monitored from our 24/7 control room. Quarterly on-site service visits, remote diagnostics in between, firmware patched on a scheduled cadence. The platform has not had unplanned downtime since commissioning.",
      "The same architecture has since been extended as the site has grown. Adding doors and cameras to a system designed for it is a planning conversation, not a forklift replacement. That\u2019s the long version of why this client has stayed with Ktronics rather than rebid the contract.",
    ],

    stats: [
      { value: '40', label: 'Access-controlled<br>doors' },
      { value: '200', suffix: '+', label: 'CCTV cameras<br>across the site' },
      { value: '24/7', label: 'Monitored from<br>our control room' },
    ],

    gallery: [
      {
        src: '/images/case-studies/ktronics-techs-walking-warehouse-pharma.jpg',
        alt: 'Two Ktronics technicians walking through the pharmaceutical warehouse during install',
        tag: 'On-site / install team',
      },
      {
        src: '/images/case-studies/pharma-distribution-warehouse-comms.jpg',
        alt: 'Comms cabinet under overhead cable tray inside the pharmaceutical distribution centre',
        tag: 'Comms cabinet / warehouse',
      },
      {
        src: '/images/case-studies/warehouse-pharma-loading-bay-western-sydney.jpg',
        alt: 'Pharmaceutical distribution loading bay with Ktronics-installed access control at the entry point',
        tag: 'Loading bay / access control',
      },
      {
        src: '/images/case-studies/warehouse-comms-rack-cable-tray.jpg',
        alt: 'Overhead galvanised cable tray dropping into a Sharkrack comms cabinet inside the warehouse',
        tag: 'Cable tray / fit-out',
      },
      {
        src: '/images/case-studies/control-board-bank-multi-unit.jpg',
        alt: 'Bank of multi-unit access and intrusion control boards supporting the door-by-door zoning',
        tag: 'Multi-unit control boards',
      },
      {
        src: '/images/details/detail-access-control-panel-axis.jpg',
        alt: 'Access control panel with neat colour-coded looms supporting the door-by-door zoning',
        tag: 'Access control panel',
      },
    ],

    testimonial: {
      quote:
        "Ktronics turned up with a system that actually fit how our warehouse runs, not a generic kit list. They've kept it running ever since.",
      role: 'Facilities Lead',
      organisation: 'Multinational pharmaceutical distributor',
    },

    order: 1,
    published: true,
  },

  /* -----------------------------------------------------------------------
   * NSW high-voltage substations (TransGrid, anonymised)
   * Source: Ktronics Company Profile — TransGrid section.
   * --------------------------------------------------------------------- */
  {
    slug: 'nsw-high-voltage-substations',
    title: 'Two decades securing NSW\u2019s 330 kV electricity backbone.',
    label: 'NSW high-voltage substations',
    summary:
      "Preferred contractor since 2004 for a major NSW high-voltage electricity infrastructure operator. Integrated alarm, CCTV, access control, intercom, and electric fence systems across multiple substations and underground cable tunnels, all interfaced directly with the operator\u2019s SCADA network.",
    industry: 'Critical infrastructure / utilities',
    location: 'Sydney metropolitan area',
    year: 'Ongoing since 2004',
    scope: 'Design, install, integrate, maintain',
    heroImage: '/images/details/detail-overhead-cable-tray.jpg',
    heroImageAlt: 'Overhead cable tray spanning a substation comms run, representative of Ktronics\u2019 high-voltage infrastructure work',
    metaDescription:
      'Preferred contractor since 2004 to a NSW high-voltage electricity operator. Integrated security across substations and cable tunnels, interfaced with SCADA.',

    challenge: [],
    solution: [
      "Ktronics has been a preferred contractor since 2004 to one of NSW\u2019s major high-voltage electricity infrastructure operators, delivering perimeter protection and integrated security upgrades across multiple substation sites and underground cable tunnels around Sydney. The systems combine alarm, CCTV, access control, intercom, and electric-fence detection, all interfaced directly with the operator\u2019s SCADA platform so that security events surface in the same operational view as the rest of the network.",
    ],
    outcome: [
      "Ktronics also provides ongoing service and maintenance for substation security systems across the Sydney metropolitan area. Two decades into the contract, the same engineering team is still on site.",
    ],

    stats: [
      { value: '20', suffix: '+', label: 'Years as<br>preferred contractor' },
      { value: '330', label: 'kV network<br>under coverage' },
      { value: 'SCADA', label: 'Direct integration<br>with operator network' },
    ],

    gallery: [
      { src: '/images/details/detail-overhead-cable-tray.jpg', alt: 'Overhead cable tray', tag: 'Cable tray / substation' },
      { src: '/images/case-studies/control-board-yellow-orange-modules.jpg', alt: 'Inner Range control boards with yellow and orange relay modules inside a substation cabinet', tag: 'Control boards / substation' },
      { src: '/images/details/detail-comms-rack-fitout.jpg', alt: 'Comms rack supporting substation security platform', tag: 'Comms rack' },
      { src: '/images/details/detail-alarm-intrusion-control-panel.jpg', alt: 'Alarm and intrusion control panel', tag: 'Alarm / intrusion' },
    ],

    order: 2,
    published: true,
  },

  /* -----------------------------------------------------------------------
   * National multi-site pharmaceutical access control
   * (AstraZeneca, anonymised — separate engagement to the pharma distributor
   * case so the two reads don\u2019t conflate)
   * Source: Ktronics Company Profile — AstraZeneca + CCTV migration sections.
   * --------------------------------------------------------------------- */
  {
    slug: 'national-pharmaceutical-access-control',
    title: 'A national access and alarm system for a pharmaceutical group.',
    label: 'National pharmaceutical access control',
    summary:
      'Centrally-managed access control and alarm system supporting a multinational pharmaceutical group across multiple Australian sites. In service continuously since 2003, with a long-term migration from analogue to IP CCTV completed in 2012 still operating reliably today.',
    industry: 'Pharmaceutical / life sciences',
    location: 'Multiple sites, Australia',
    year: 'Ongoing since 2003',
    scope: 'Install, integrate, migrate, maintain',
    heroImage: '/images/details/detail-access-control-board-din-rail.jpg',
    heroImageAlt: 'Multi-module access control board on DIN rail, representative of national multi-site rollouts',
    metaDescription:
      'National access control and alarm system for a multinational pharma group, in service since 2003. Includes a 2012 Avigilon IP CCTV migration still running.',

    challenge: [],
    solution: [
      "Ktronics has provided technical services to a multinational pharmaceutical group continuously since 2003, including the installation and ongoing maintenance of a centrally-managed national access control and alarm system supporting multiple Australian sites. In 2012, the same engagement included a large-scale migration from analogue to IP-based CCTV using Avigilon Control Centre.",
    ],
    outcome: [
      "Both systems are still in active service. The IP CCTV platform has run reliably for more than a decade, with ongoing upgrades currently underway to extend its lifecycle further. Long-term system performance under continuous service is the kind of outcome a pharmaceutical client cares about more than a flashy launch.",
    ],

    stats: [
      { value: '20', suffix: '+', label: 'Years of continuous<br>technical service' },
      { value: '10', suffix: '+', label: 'Years on the original<br>IP CCTV platform' },
      { value: 'Multi-site', label: 'Centrally managed<br>access control' },
    ],

    gallery: [
      { src: '/images/details/detail-access-control-board-din-rail.jpg', alt: 'Access control board on DIN rail', tag: 'Access control / DIN rail' },
      { src: '/images/case-studies/control-board-lcd-detail.jpg', alt: 'Multi-board access and intrusion controller with LCD readout, neatly looped power and DIN-rail terminations', tag: 'Controller / LCD detail' },
      { src: '/images/details/detail-cable-management.jpg', alt: 'Tidy cable management inside a control cabinet', tag: 'Cable management' },
      { src: '/images/details/detail-comms-rack-green-cabling.jpg', alt: 'Fibre cabling supporting the IP CCTV migration', tag: 'IP CCTV / fibre' },
    ],

    order: 3,
    published: true,
  },

  /* -----------------------------------------------------------------------
   * Beverage producer CCTV + access (Diageo, anonymised)
   * Source: Ktronics Company Profile — Diageo section.
   * --------------------------------------------------------------------- */
  {
    slug: 'beverage-producer-cctv-access-control',
    title: 'Genetec CCTV and integrated access control for a global beverage producer.',
    label: 'Global beverage producer',
    summary:
      'High-performance Genetec CCTV system designed and installed for a multinational beverage producer\u2019s Australian sites, complemented by integrated Tecom and Forcefield access control. Ktronics retains the ongoing service and support contract.',
    industry: 'Beverage manufacturing / FMCG',
    location: 'Sydney',
    year: 'Ongoing',
    scope: 'Design, install, maintain',
    heroImage: '/images/details/warehouse-cctv-cameras-and-sensors.jpg',
    heroImageAlt: 'Warehouse interior with Ktronics-installed CCTV cameras and sensors mounted to the ceiling',
    metaDescription:
      'Genetec CCTV with integrated Tecom and Forcefield access control for a multinational beverage producer\u2019s Australian sites. Ongoing Ktronics support.',

    challenge: [],
    solution: [
      "Ktronics designed and installed a high-performance Genetec CCTV platform for a multinational beverage producer\u2019s Australian sites, complemented by integrated Tecom and Forcefield access control. The two systems share a unified operator console so floor management, perimeter coverage, and after-hours monitoring all run through the same view.",
    ],
    outcome: [
      "Ktronics continues to provide ongoing service and support across the client\u2019s Australian sites.",
    ],

    stats: [
      { value: 'Genetec', label: 'CCTV platform<br>with full analytics' },
      { value: 'Tecom', label: 'Access control<br>integrated end-to-end' },
      { value: 'Multi-site', label: 'Unified operator<br>console' },
    ],

    gallery: [
      { src: '/images/details/warehouse-cctv-cameras-and-sensors.jpg', alt: 'CCTV cameras and sensors mounted at scale', tag: 'CCTV coverage' },
      { src: '/images/case-studies/rack-green-white-cable-management.jpg', alt: 'Comms cabinet with switches and tightly bundled green and white cabling supporting the integrated platform', tag: 'Cabinet / cable management' },
      { src: '/images/details/detail-comms-rack-fitout.jpg', alt: 'Comms rack supporting the integrated platform', tag: 'Comms rack' },
      { src: '/images/details/detail-access-control-panel-axis.jpg', alt: 'Access control panel for the integrated Tecom and Forcefield system', tag: 'Access control panel' },
    ],

    order: 4,
    published: true,
  },

  /* -----------------------------------------------------------------------
   * High-security data centre
   * Source: Ktronics Company Profile — Co-Location Data Centre section.
   * (Already generic in the source — no client name to anonymise.)
   * --------------------------------------------------------------------- */
  {
    slug: 'high-security-data-centre',
    title: 'Lenel OnGuard and Axis CCTV for a high-security data centre.',
    label: 'Co-located data centre',
    summary:
      'Top-tier integrated security solution for a high-security co-located data centre, designed to meet the stringent compliance and documentation requirements of the industry. Lenel OnGuard access control with a comprehensive Axis CCTV network, on full lifecycle support.',
    industry: 'Data centre / co-location',
    location: 'Sydney',
    year: 'Ongoing',
    scope: 'Design, install, audit, maintain',
    heroImage: '/images/case-studies/corporate-office-comms-rack-sydney.jpg',
    heroImageAlt: 'Comms rack supporting a high-security data centre security platform',
    metaDescription:
      'Lenel OnGuard access control + Axis CCTV for a high-security co-located data centre. Compliance-grade documentation, full Ktronics lifecycle support.',

    challenge: [],
    solution: [
      "Ktronics delivered a top-tier integrated security solution for a high-security co-located data centre, designed specifically to meet the stringent compliance and documentation requirements of the industry. The platform combines Lenel OnGuard access control with a comprehensive Axis CCTV network, configured for the highest level of protection across cages, corridors, mechanical rooms, and external perimeters.",
    ],
    outcome: [
      "Ktronics provides ongoing maintenance, regular system audits, and full lifecycle support to ensure the platform runs smoothly and stays fully compliant with industry regulations and standards. Documentation is maintained in step with the install so audit responses don\u2019t require digging.",
    ],

    stats: [
      { value: 'Lenel', label: 'OnGuard access<br>control platform' },
      { value: 'Axis', label: 'CCTV network<br>across the facility' },
      { value: 'Audit', label: 'Regular system audits<br>+ lifecycle support' },
    ],

    gallery: [
      { src: '/images/case-studies/data-centre-rack-cabling.jpg', alt: 'Densely populated data centre cabinet with bundled green and white cabling running into Cisco-class switching gear', tag: 'Cabinet / cabling' },
      { src: '/images/case-studies/corporate-office-comms-rack-sydney.jpg', alt: 'Comms rack supporting the data centre platform', tag: 'Comms rack' },
      { src: '/images/case-studies/rack-green-white-cable-management.jpg', alt: 'Cable management on a data centre comms cabinet, neat green and white patch leads', tag: 'Cable management' },
      { src: '/images/details/detail-access-control-panel-axis.jpg', alt: 'Access control panel cleanly mounted in a data centre cabinet', tag: 'Access control / Lenel' },
      { src: '/images/details/detail-comms-rack-green-cabling.jpg', alt: 'Tidy fibre patch supporting the Axis CCTV network', tag: 'Fibre patch / CCTV' },
    ],

    order: 5,
    published: true,
  },
];

/** All case studies sorted by display order. Hides unpublished drafts. */
export function allCaseStudies(): CaseStudy[] {
  return [...caseStudies].filter((c) => c.published).sort((a, b) => a.order - b.order);
}

/** Get one case study by slug. Throws if missing. */
export function getCaseStudy(slug: string): CaseStudy {
  const found = caseStudies.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown case study slug: ${slug}`);
  return found;
}

/** Other published case studies, excluding the current one. */
export function relatedCaseStudies(currentSlug: string): CaseStudy[] {
  return allCaseStudies().filter((c) => c.slug !== currentSlug);
}
