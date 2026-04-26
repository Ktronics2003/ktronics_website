/**
 * Single source of truth for all Solution offerings.
 *
 * Read by:
 *   - SolutionsGrid (homepage)
 *   - /solutions/ hub page
 *   - RelatedSolutions strip (on each detail page, filters out current)
 *   - Individual /solutions/[slug]/ pages (look up own data + FAQ + capabilities)
 *   - Footer Solutions list (eventually)
 *
 * To add or rename a solution, edit here once and it propagates everywhere.
 */

export interface SolutionCapability {
  title: string;
  body: string;
}

export interface SolutionFaq {
  question: string;
  answer: string;
}

export interface Solution {
  /** URL slug — must match the file at src/pages/solutions/{slug}.astro */
  slug: string;
  /** Short label used in cards, eyebrows, and breadcrumbs */
  label: string;
  /** SEO/page H1 — the full proposition. */
  pageTitle: string;
  /** Card-style headline used on the homepage SolutionsGrid */
  cardHeadline: string;
  /** Short description (1-2 sentences) used in cards and the hub */
  shortDescription: string;
  /** Long lead paragraph for the detail page hero */
  heroLead: string;
  /** Path to the solution's icon (under /public) */
  icon: string;
  /** Path to the detail page's hero/feature photo (under /src/assets/images/) */
  heroPhotoPath: string;
  heroPhotoAlt: string;
  /** Capability list rendered on the detail page */
  capabilities: SolutionCapability[];
  /** "How it works" — 3-4 step process specific to this solution */
  process: { num: string; title: string; body: string }[];
  /** Industries this solution is most relevant for (slugs from IndustriesList) */
  relevantIndustries: string[];
  /** Page-specific FAQs. Don't repeat Qs across pages. */
  faqs: SolutionFaq[];
  /** Display order in lists (lower first) */
  order: number;
}

export const solutions: Solution[] = [
  {
    slug: 'access-control',
    label: 'Access Control',
    pageTitle: 'Commercial Access Control Systems Sydney',
    cardHeadline: 'Control who goes where, and when.',
    shortDescription:
      'Smart, scalable access systems. Card, mobile, biometric, or cloud-managed, tailored to your operations and compliance needs.',
    heroLead:
      "From a single-door reader to a national multi-site rollout: we design, install, and maintain access control systems that fit how your building actually runs. We integrate Lenel, Tecom, and Axis kit, work with your IT team, and back the install with the same techs who quoted it.",
    icon: '/images/icons/access-control.png',
    heroPhotoPath: '/images/case-studies/warehouse-pharma-loading-bay-western-sydney.jpg',
    heroPhotoAlt: 'Ktronics-installed access control at a Western Sydney pharmaceutical distribution warehouse',
    capabilities: [
      { title: 'Card and fob systems', body: 'Proximity, MIFARE, and DESFire credentials with central management. Lost cards revoked in seconds, not days.' },
      { title: 'Mobile and wearable', body: 'Phone-as-credential via Bluetooth or NFC. No physical cards to lose, replace, or audit.' },
      { title: 'Biometric', body: 'Fingerprint, facial, and palm-vein readers for high-security zones. Optional dual-factor with card or PIN.' },
      { title: 'Cloud-managed', body: 'Browser-based admin from anywhere. No on-premise server, no VPN, no IT bottleneck.' },
      { title: 'Multi-site', body: 'Single panel of glass across every site. Enterprise-grade rollouts running on Lenel OnGuard, Forcefield, or Tecom Challenger.' },
      { title: 'Audit and compliance', body: 'Time-stamped event logs for every door, every credential. Insurance-ready, audit-ready.' },
    ],
    process: [
      { num: 'Stage 01', title: 'Site walk', body: 'We walk your site, map the doors, the people, the workflows. No quotes from a desk.' },
      { num: 'Stage 02', title: 'Custom design', body: 'We spec the readers, controllers, credentials, and software to your needs and budget.' },
      { num: 'Stage 03', title: 'Professional install', body: 'Our techs install, commission, and hand over. We work around your operating hours.' },
      { num: 'Stage 04', title: 'Ongoing service', body: 'Add or remove credentials, expand to new doors, upgrade firmware. Same techs, every time.' },
    ],
    relevantIndustries: ['warehouse-logistics', 'corporate-offices', 'medical-allied-health', 'strata-multi-tenant'],
    faqs: [
      {
        question: 'How long does a typical commercial access control install take?',
        answer:
          'A small office of 4 to 8 doors typically takes 1 to 2 days for the install plus a half day for commissioning and handover. A multi-site or warehouse rollout (40+ doors) can run several weeks. We always give a fixed-price install timeline as part of the quote, scheduled around your operating hours.',
      },
      {
        question: 'Can you upgrade my existing access control system instead of replacing it?',
        answer:
          "Often, yes. If your existing controllers are still supported (Lenel, Tecom, Inner Range, etc.) we can usually add new doors, swap to mobile credentials, or migrate to cloud management without replacing the whole system. We'll tell you upfront if a full replacement is genuinely the better option for your site.",
      },
      {
        question: 'Do I need a master licence to install my own access control?',
        answer:
          'In NSW, any business installing or maintaining electronic security on behalf of a third party needs a Master Licence. Internal IT teams installing on their own premises can do basic configuration, but the physical install, monitoring connection, and ongoing service should be done by a licensed installer. Our Master Licence is 102039.',
      },
      {
        question: 'Can the system integrate with our HR or visitor management?',
        answer:
          'Yes. Most modern access control systems support API integration with HR platforms (BambooHR, Employment Hero, Workday) for automatic credential provisioning when staff start or leave, and with visitor management for temporary day passes. We scope the integration during design and configure it during commissioning.',
      },
    ],
    order: 1,
  },

  {
    slug: 'video-surveillance',
    label: 'Video Surveillance',
    pageTitle: 'Commercial CCTV Installation Sydney',
    cardHeadline: 'Eyes on every corner of your site.',
    shortDescription:
      'HD, 4K, thermal, and AI-enabled CCTV systems. Real-time monitoring, evidence-grade footage, mobile alerts.',
    heroLead:
      "From a few cameras over a loading dock to a 200-camera multi-site network: we design and install commercial CCTV that actually performs at 2 a.m. as well as it does at midday. Avigilon, Axis, Genetec, and Hikvision platforms, integrated with your access control and monitored from anywhere.",
    icon: '/images/icons/video-surveillance.png',
    heroPhotoPath: '/images/details/warehouse-cctv-cameras-and-sensors.jpg',
    heroPhotoAlt: 'Warehouse interior with newly installed CCTV cameras and PIR sensors mounted to the ceiling',
    capabilities: [
      { title: 'HD and 4K', body: 'High-resolution colour CCTV with low-light performance. Evidence-grade footage that stands up in court.' },
      { title: 'Thermal imaging', body: 'Detect intrusion in pitch dark, smoke, or fog. Used on perimeter fences and outdoor compounds.' },
      { title: 'AI analytics', body: 'On-camera analytics that flag actual events (vehicle stopped, person crossing line) and ignore wildlife or weather. Fewer false alarms, more useful alerts.' },
      { title: 'Remote viewing', body: 'Live and recorded footage on phone, tablet, or browser. Multi-site dashboards for facilities managers.' },
      { title: 'Integrated with access', body: 'Tie a credential swipe to the camera that saw it. Investigate incidents in seconds, not hours.' },
      { title: 'Long-term retention', body: 'On-site NVR or hybrid cloud storage. Configurable retention to match your insurance and compliance requirements.' },
    ],
    process: [
      { num: 'Stage 01', title: 'Coverage assessment', body: 'We walk your site to identify blind spots, glare, and lighting issues. We propose camera positions, not products.' },
      { num: 'Stage 02', title: 'System design', body: 'Cameras, NVR/storage, network, and analytics specified to your real-world conditions.' },
      { num: 'Stage 03', title: 'Cabling and install', body: 'Structured cabling done properly. Cameras mounted, focused, and tested individually.' },
      { num: 'Stage 04', title: 'Tuning and handover', body: 'AI analytics tuned to your site. Staff trained. System monitored or self-managed, your choice.' },
    ],
    relevantIndustries: ['warehouse-logistics', 'retail-hospitality', 'corporate-offices', 'medical-allied-health'],
    faqs: [
      {
        question: 'How much does a commercial CCTV system cost in Sydney?',
        answer:
          "It depends on camera count, resolution, storage retention, and whether you want monitoring. A small office system (4 to 8 HD cameras with on-site NVR and 30-day retention) typically lands in the $5,000 to $12,000 range installed. A 50+ camera warehouse with AI analytics, integrated access control, and 90-day retention is closer to $40,000 to $80,000. We'll always give you a fixed-price quote after walking the site.",
      },
      {
        question: 'How long is CCTV footage typically kept?',
        answer:
          "30 days is the common default for commercial sites and matches most insurance requirements. Compliance-driven sectors (pharma, finance, government) often require 90 days or longer. Storage is sized to your chosen retention period during the design stage.",
      },
      {
        question: 'Can the cameras send me an alert when something happens?',
        answer:
          'Yes. Modern AI-enabled cameras can push real-time alerts to phone or email when they detect specific events: a person crossing a perimeter, a vehicle stopped where it shouldn\'t be, motion in a no-go zone after hours. We tune what triggers alerts to minimise false positives, so the alerts you do get are the ones worth reading.',
      },
      {
        question: "What's the difference between IP cameras and analogue?",
        answer:
          "IP cameras are network-connected, support modern features (4K, AI analytics, remote viewing, integration with access control), and are what we install on every new commercial system. Analogue is a legacy technology we still maintain on existing client sites but don't recommend for new installations.",
      },
    ],
    order: 2,
  },

  {
    slug: 'visitor-management',
    label: 'Visitor Management',
    pageTitle: 'Commercial Visitor Management Systems Sydney',
    cardHeadline: "Know who's on-site, in real time.",
    shortDescription:
      'Streamlined check-in systems that make a strong first impression while keeping site security tight.',
    heroLead:
      'Replace the paper sign-in book with a touchscreen kiosk that captures who, when, and why. Pre-register expected visitors, auto-notify their host, print a photo badge with an access-controlled day pass. Every entry is timestamped, every visitor is accounted for, and emergency evacuations have a single source of truth.',
    icon: '/images/icons/visitor-management.png',
    heroPhotoPath: '/images/details/ktronics-comms-rack-install.jpg',
    heroPhotoAlt: 'Ktronics technician commissioning a wall-mounted control panel at a Sydney commercial site',
    capabilities: [
      { title: 'Touchscreen kiosk', body: 'Branded check-in screen at reception. Visitor enters their name and host, system handles the rest.' },
      { title: 'Pre-registration', body: 'Hosts pre-register expected visitors. Visitor receives a QR code by email, scans on arrival, skips the form.' },
      { title: 'Photo badges', body: 'Auto-printed visitor badge with photo, host name, and timestamp. Optional barcoded day pass for access control integration.' },
      { title: 'Host notifications', body: 'Host receives instant notification (email, SMS, or Teams) when their visitor arrives.' },
      { title: 'Emergency evacuation', body: 'Live on-site visitor list available on phone for evacuation roll calls. Critical for compliance with WHS regs.' },
      { title: 'Integration with access control', body: 'Visitor badges can grant time-limited access to specific zones. Auto-revoked at sign-out or end of day.' },
    ],
    process: [
      { num: 'Stage 01', title: 'Reception walk-through', body: 'We assess your reception flow, peak visitor volumes, and any compliance requirements.' },
      { num: 'Stage 02', title: 'Kiosk and software design', body: 'Hardware specified, branded screen designed, integration with your access control mapped.' },
      { num: 'Stage 03', title: 'Install and configure', body: 'Kiosk installed, badge printer connected, host directory imported, sign-in flow tested with your team.' },
      { num: 'Stage 04', title: 'Train and refine', body: 'Reception staff and frequent hosts trained. We refine the flow once it is in real use.' },
    ],
    relevantIndustries: ['corporate-offices', 'medical-allied-health', 'childcare-schools', 'warehouse-logistics'],
    faqs: [
      {
        question: 'Can the visitor system print a temporary access card?',
        answer:
          "Yes, when integrated with the site's access control. The kiosk prints a barcoded badge or issues a temporary mobile credential that grants access to specific zones for the duration of the visit, then auto-revokes at sign-out or end of day.",
      },
      {
        question: 'What happens during an emergency evacuation?',
        answer:
          'Floor wardens and reception can pull a live on-site visitor list on their phone or tablet: name, host, sign-in time, and current location if zone tracking is enabled. This is required under WHS regulations for sites that maintain a visitor register and is one of the strongest reasons commercial buildings adopt these systems.',
      },
      {
        question: 'Does it work for contractors and deliveries, not just visitors?',
        answer:
          'Yes. Most systems support multiple sign-in flows: visitors, contractors, deliveries, and staff. Each flow can capture different information (e.g. contractors might confirm site induction status; deliveries might capture the consignment number and the receiving staff member).',
      },
      {
        question: 'Is visitor data captured GDPR or Privacy Act compliant?',
        answer:
          'The systems we install support automatic data purging on a configurable schedule (typically 30, 60, or 90 days), encrypted storage, and visitor consent capture at sign-in. We configure each install to comply with the Australian Privacy Act and any sector-specific requirements (e.g. health information).',
      },
    ],
    order: 3,
  },

  {
    slug: 'maintenance-monitoring',
    label: 'Maintenance & Monitoring',
    pageTitle: 'Security Maintenance & 24/7 Monitoring Sydney',
    cardHeadline: 'Always-on systems. Always-on support.',
    shortDescription:
      'Tailored maintenance plans, 24/7 monitoring, and emergency response. Compliance and uptime, guaranteed.',
    heroLead:
      "Most security systems fail quietly. A camera goes offline, a battery dies, a panel locks itself out, and nobody notices until the day you actually need the footage. Our maintenance and monitoring plans catch these issues before they matter, and our 24/7 control room responds the moment a real alarm fires.",
    icon: '/images/icons/maintenance-monitoring.png',
    heroPhotoPath: '/images/details/ktronics-monitoring-room.jpg',
    heroPhotoAlt: 'Ktronics technician on-site servicing perimeter gate hardware at a Sydney commercial property',
    capabilities: [
      { title: 'Scheduled service visits', body: 'Quarterly, half-yearly, or annual on-site checks. Cameras cleaned and refocused, batteries tested, panels inspected, software patched.' },
      { title: '24/7 alarm monitoring', body: 'Our control room monitors every alarm event around the clock. Verified alarms get a real human response, not an auto-dismissed notification.' },
      { title: 'Emergency callout', body: "When monitoring confirms a genuine event, our on-call tech responds. We've held this contract with our oldest clients for over twenty years."},
      { title: 'Remote diagnostics', body: 'Most issues we resolve remotely before you know about them. Faulty cameras flagged, firmware pushed, configurations restored.' },
      { title: 'Compliance reporting', body: "Insurance, WHS, and sector-specific compliance audits are easier when you have a service log to hand. We provide one for every visit." },
      { title: 'System upgrades', body: 'When kit reaches end-of-life, we plan and stage the upgrade so you get continuity of service, not a forklift replacement.' },
    ],
    process: [
      { num: 'Stage 01', title: 'Audit existing system', body: "We inspect what's installed, test what's working, document what's not. You get a written condition report." },
      { num: 'Stage 02', title: 'Plan agreement', body: 'Based on the audit, we propose a service interval, monitoring scope, and response time guarantee.' },
      { num: 'Stage 03', title: 'Onboard to monitoring', body: 'Your alarm panels are connected to our 24/7 control room. Test events confirmed end-to-end.' },
      { num: 'Stage 04', title: 'Ongoing service', body: 'Scheduled visits, real-time monitoring, fast response when something fires. Same techs, every time.' },
    ],
    relevantIndustries: ['warehouse-logistics', 'medical-allied-health', 'corporate-offices', 'retail-hospitality'],
    faqs: [
      {
        question: 'How often should commercial security systems be serviced?',
        answer:
          'For most commercial sites, twice a year is the right cadence. High-traffic sites (warehouses, retail) or compliance-critical sites (pharma, healthcare, childcare) often warrant quarterly. The service interval is set in your maintenance plan based on site type, kit age, and any insurance or sector-specific requirements.',
      },
      {
        question: 'What happens if my alarm goes off after hours?',
        answer:
          'Our 24/7 control room receives the signal within seconds. A trained operator verifies the event (against camera footage where available), and if it confirms as a real intrusion, fire, or duress, we dispatch the appropriate response: police, your nominated key-holder, our on-call technician, or all three. You receive a written incident report the next business day.',
      },
      {
        question: 'How fast is your emergency response?',
        answer:
          "For monitored clients in the Sydney metro area, our on-call technician's typical site arrival time after a verified alarm is under 90 minutes. Response time is faster on the Northern Beaches, North Shore, and CBD, where we hold callout SLAs in writing as part of the maintenance agreement.",
      },
      {
        question: 'Can you maintain a system you didn\u2019t install?',
        answer:
          "Yes, this is a significant part of our service work. We take on existing systems from other installers regularly. The first step is a written condition report so you know exactly what state the kit is in. We'll tell you upfront if anything is end-of-life, non-compliant, or genuinely beyond economic repair.",
      },
    ],
    order: 4,
  },
];

/** Helper: get a single solution by slug. Throws if not found. */
export function getSolution(slug: string): Solution {
  const found = solutions.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown solution slug: ${slug}`);
  return found;
}

/** Helper: get all solutions sorted by display order. */
export function allSolutions(): Solution[] {
  return [...solutions].sort((a, b) => a.order - b.order);
}

/** Helper: get the OTHER solutions (everything except current slug). */
export function relatedSolutions(currentSlug: string): Solution[] {
  return allSolutions().filter((s) => s.slug !== currentSlug);
}
