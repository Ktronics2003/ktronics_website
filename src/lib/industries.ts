/**
 * Single source of truth for all Industries Ktronics serves.
 *
 * Read by:
 *   - IndustriesList (homepage row of links)
 *   - /industries/ hub page
 *   - /industries/[slug]/ individual pages
 *   - RelatedIndustries strip on each detail page
 *
 * To add or rename an industry, edit here once and it propagates everywhere.
 */

import type { Solution } from './solutions';

export interface IndustryChallenge {
  title: string;
  body: string;
}

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface Industry {
  /** URL slug — must match src/pages/industries/{slug}.astro */
  slug: string;
  /** Card label / breadcrumb */
  label: string;
  /** Full SEO H1 */
  pageTitle: string;
  /** 1-line value-prop headline used in the hero */
  cardHeadline: string;
  /** Short description used on the homepage IndustriesList rows + hub */
  shortDescription: string;
  /** Long lead paragraph for the detail page hero */
  heroLead: string;
  /** Path to the industry icon (under /public) — already wired on homepage */
  icon: string;
  /** Path to the detail page hero photo (under /public) */
  heroPhotoPath: string;
  heroPhotoAlt: string;
  /** Common considerations / challenges in this sector */
  challenges: IndustryChallenge[];
  /** Slugs of the Solutions most relevant to this industry — order matters,
   *  rendered most-to-least relevant. */
  recommendedSolutions: Solution['slug'][];
  /** Industry-specific FAQs. No Q is repeated across pages. */
  faqs: IndustryFaq[];
  /** Display order on the IndustriesList + hub (lower first) */
  order: number;
}

export const industries: Industry[] = [
  {
    slug: 'warehouse-logistics',
    label: 'Warehouse & logistics',
    pageTitle: 'Commercial Security for Warehouse & Logistics Sites',
    cardHeadline: 'High-traffic sites that don\u2019t stop for security upgrades.',
    shortDescription: 'High-traffic access zones, perimeter CCTV, dock management.',
    heroLead:
      'Distribution centres, third-party logistics, cold chain, and freight forwarding all share the same problem: continuous operations leave no window for downtime, but security needs to keep up with rising compliance, insurance, and theft-prevention demands. Ktronics designs warehouse security around how the site actually runs, not the other way around.',
    icon: '/images/icons/industries/warehouse-logistics.png',
    heroPhotoPath: '/images/case-studies/warehouse-pharma-loading-bay-western-sydney.jpg',
    heroPhotoAlt: 'Warehouse loading bay with Ktronics-installed access control at the entry point',
    challenges: [
      { title: 'High-traffic access zones', body: 'Multiple loading docks, dispatch areas, and contractor entries running 24/7. Credentials need to flow with shift changes, not the other way around.' },
      { title: 'Perimeter coverage', body: 'Long fence lines, multiple yard cameras, and AI analytics that filter wildlife and weather so the alerts that fire are the ones worth reading.' },
      { title: 'Dock and yard management', body: 'CCTV with timestamped events tied to access control swipes so dispatch disputes resolve in minutes, not hours.' },
      { title: 'Cold chain compliance', body: 'Restricted-zone access with audit trails. Some clients run pharma or food-grade logistics where compliance documentation is non-optional.' },
      { title: 'Insurance-ready footage', body: '90-day retention is common for warehouse insurance. We size storage and resolution to your policy from day one.' },
      { title: 'Continuous-operations rollout', body: 'Most warehouse upgrades have to happen during operating hours. We sequence the install around the dock schedule, not the other way around.' },
    ],
    recommendedSolutions: ['video-surveillance', 'access-control', 'maintenance-monitoring'],
    faqs: [
      {
        question: 'How do you upgrade a 24/7 warehouse without disrupting operations?',
        answer:
          'We sequence work around the loading dock schedule. Cabling and head-end work happens off-hours; cameras and readers are installed in zone-by-zone passes during quieter shifts. The system goes live in stages so each zone is operational before the next is touched. We do this on most warehouse rollouts.',
      },
      {
        question: 'Can the system handle 50+ cameras and 20+ access doors on a single platform?',
        answer:
          'Yes. Our enterprise installs run on Lenel OnGuard, Tecom Challenger with Forcefield, or Genetec: platforms purpose-built for hundreds of doors and thousands of cameras. We size the head-end equipment and network during design, not after install.',
      },
      {
        question: 'What insurance retention is typical for warehouse CCTV?',
        answer:
          'Most commercial warehouse insurance requires 30 to 90 days of retained footage at full resolution. Cold chain, pharma, and bonded warehouses often require 90+ days. We size storage to match your policy, with provision for retention extension if your insurer changes requirements.',
      },
    ],
    order: 1,
  },

  {
    slug: 'strata-multi-tenant',
    label: 'Strata & multi-tenant',
    pageTitle: 'Strata & Multi-Tenant Building Security Systems',
    cardHeadline: 'Buildings where every door has a different story.',
    shortDescription: 'Multi-resident access, common-area surveillance, intercom.',
    heroLead:
      'Strata buildings, mixed-use complexes, and multi-tenant commercial blocks share the same headache: dozens of legitimate users, no clear chain of authority, and after-hours incidents that need an audit trail. Ktronics installs systems strata managers and building managers can actually run.',
    icon: '/images/icons/industries/strata-multi-tenant.png',
    heroPhotoPath: '/images/details/detail-comms-rack-fitout.jpg',
    heroPhotoAlt: 'Comms rack fit-out supporting a multi-tenant building security platform',
    challenges: [
      { title: 'Multi-resident access', body: 'Dozens of credentials per building, with regular turnover. We provision via the strata management platform so deactivations happen the day a resident moves out.' },
      { title: 'Common-area surveillance', body: 'Lobbies, lifts, basement carparks, garbage rooms: coverage of every space owners corp can be asked about during an incident.' },
      { title: 'Intercom and visitor entry', body: 'Audio and video intercom with mobile answer, so residents can let in legitimate visitors without compromising the front door.' },
      { title: 'Audit trails for disputes', body: 'Time-stamped event logs for every common-door swipe. Resolves "who came in last night" disputes in seconds.' },
      { title: 'After-hours response', body: '24/7 monitoring with verified human escalation. The strata manager isn\u2019t the after-hours response plan.' },
      { title: 'Owners corp documentation', body: 'Service records and compliance certificates structured for the AGM, not buried in our system.' },
    ],
    recommendedSolutions: ['access-control', 'video-surveillance', 'visitor-management', 'maintenance-monitoring'],
    faqs: [
      {
        question: 'Can the access system integrate with our strata management software?',
        answer:
          'Yes. We integrate with most major Australian strata management platforms (StrataMax, Rockend StrataMaster, BuildingLink) so credentials provision automatically when residents move in or out, and the audit trail flows into the same record system the strata manager already uses.',
      },
      {
        question: 'What CCTV retention do strata buildings typically need?',
        answer:
          'Owners corps usually want 30 days minimum for common-area incidents. Buildings with luxury or commercial tenants often run 60 to 90 days. The right answer is whatever your insurance and AGM-decided policies say: we size to your decision, not a default.',
      },
      {
        question: 'How does the visitor intercom work for residents?',
        answer:
          'Modern systems push the call to a resident\u2019s phone via app: they can see and talk to the visitor, then unlock the door from anywhere. Backup falls to the desk handset for residents who prefer it. We can also wire timed access codes for tradespeople and deliveries.',
      },
    ],
    order: 2,
  },

  {
    slug: 'childcare-schools',
    label: 'Childcare & schools',
    pageTitle: 'Childcare Centre & School Security Systems',
    cardHeadline: 'Compliance-grade entry control for sites where it counts most.',
    shortDescription: 'Compliant entry control, visitor management, child protection.',
    heroLead:
      'Childcare centres, primary and secondary schools, and after-school facilities operate under some of the strictest visitor and entry compliance requirements in the country. Ktronics designs systems that meet the regulatory standard without making the daily drop-off feel like an airport.',
    icon: '/images/icons/industries/childcare-schools.png',
    heroPhotoPath: '/images/details/ktronics-comms-rack-install.jpg',
    heroPhotoAlt: 'Ktronics technician commissioning a control panel at a Sydney commercial site',
    challenges: [
      { title: 'Compliant entry control', body: 'Single-point-of-entry systems with parent or staff credentials, visitor pre-registration, and tamper-evident logs that hold up to a regulatory audit.' },
      { title: 'Visitor management', body: 'Touchscreen check-in for parents, contractors, and external staff. Photo badges, sign-in time, host on-site. Required by most state-level early-childhood frameworks.' },
      { title: 'Child protection footage', body: 'CCTV positioned to cover entry, exit, and common areas without breaching child-privacy frameworks. Footage retention sized to the regulator, not the maximum disk size.' },
      { title: 'Lockdown and duress', body: 'Single-button lockdown across all external doors. Duress buttons at reception. Tested response plans, not just installed hardware.' },
      { title: 'Parent app integration', body: 'Some operators want sign-in to flow into Xplor, Storypark, or Kindyhub. Where APIs exist, we connect them; where they don\u2019t, we keep the data on-site.' },
      { title: 'After-hours access', body: 'Out-of-hours cleaners, OOSH staff, and tradespeople need access without compromising the daytime profile. Time-window credentials handle it.' },
    ],
    recommendedSolutions: ['access-control', 'visitor-management', 'video-surveillance'],
    faqs: [
      {
        question: 'Are your systems compliant with the National Quality Framework for early childhood?',
        answer:
          'Yes. Our childcare installs are designed to comply with the visitor-register and entry-control requirements of the National Quality Standard (NQS), state-level Working with Children Check workflows, and the relevant National Regulations. We document the install accordingly so QIP and audit responses don\u2019t require us to dig.',
      },
      {
        question: 'How does the visitor sign-in handle parent vs. contractor vs. casual staff?',
        answer:
          'The kiosk presents different sign-in flows: parents pick up against a child record (some integrations let the system check authorised pick-up against the family file), contractors confirm site induction status, casual or relief staff confirm WWCC validity. Each flow captures the right data without making the front desk slow.',
      },
      {
        question: 'What happens during a lockdown event?',
        answer:
          'A single button: typically at reception and one other location: locks all external doors simultaneously, sends an alert to the nominated staff list, and surfaces a live visitor and child sign-in roll on phone for warden response. We test the lockdown sequence end-to-end during commissioning, then again at every annual service visit.',
      },
    ],
    order: 3,
  },

  {
    slug: 'medical-allied-health',
    label: 'Medical & allied health',
    pageTitle: 'Medical Centre & Allied Health Security Systems',
    cardHeadline: 'Compliance-grade systems for clinics, day surgeries, and allied health.',
    shortDescription: 'Restricted areas, after-hours access, compliance-grade systems.',
    heroLead:
      'Day surgeries, medical centres, dental practices, allied health, and aged-care facilities all sit under regulatory frameworks that touch security: who can enter, who can access medication storage, what footage is retained, and how patient privacy is protected. Ktronics designs the system so compliance isn\u2019t something you have to reconcile after the fact.',
    icon: '/images/icons/industries/medical-allied-health.png',
    heroPhotoPath: '/images/details/detail-access-control-board-din-rail.jpg',
    heroPhotoAlt: 'Access control board on DIN rail supporting restricted-area zoning at a medical site',
    challenges: [
      { title: 'Restricted-area zoning', body: 'Drug storage, pathology, theatres, and records rooms each need their own credential profile with audit-ready logs.' },
      { title: 'After-hours access', body: 'Cleaning, maintenance, and out-of-hours practitioners need scoped access without compromising the daytime profile. Time-window credentials handle it.' },
      { title: 'Patient privacy under CCTV', body: 'Coverage that secures the building without breaching health-privacy frameworks. Camera positioning and footage handling designed around APP and OAIC obligations.' },
      { title: 'Duress and panic', body: 'Reception duress buttons, consult-room panic, and verified silent alarm response. Designed for clinics that have actually had incidents.' },
      { title: 'Aged-care specific compliance', body: 'Dementia-care wandering protection, after-hours visitor protocols, and integration with nurse-call where required.' },
      { title: 'Documented audit trail', body: 'Every door, every credential, every incident: exportable in formats that match your accreditation framework.' },
    ],
    recommendedSolutions: ['access-control', 'video-surveillance', 'maintenance-monitoring'],
    faqs: [
      {
        question: 'Are your systems compliant with the Australian Privacy Principles for health information?',
        answer:
          'Yes. CCTV coverage and footage handling on our medical and allied-health installs are designed against APP requirements: clear signage, lawful collection purposes, configurable retention periods, and access logs for any retrieval of footage. We document the configuration so OAIC enquiries or accreditation audits can be answered cleanly.',
      },
      {
        question: 'Can the access system integrate with our practice management software?',
        answer:
          'In some cases, yes. Major platforms like Best Practice, Genie, and MediTrak don\u2019t expose public APIs for credential provisioning, so for those we typically run access in parallel with HR onboarding. Where a platform does expose an API (less common in primary care, more common in larger group practices and aged care), we wire it during commissioning.',
      },
      {
        question: 'How fast is your emergency response if a duress alarm fires?',
        answer:
          'For monitored medical clients, our 24/7 control room verifies the duress event (against camera footage where positioned) and dispatches according to your written response plan within seconds: police, your nominated key-holder, our on-call technician, or all three. Sydney-metro arrival times are under 90 minutes for the technician; police response is faster on verified events.',
      },
    ],
    order: 4,
  },

  {
    slug: 'corporate-offices',
    label: 'Corporate offices',
    pageTitle: 'Corporate Office Security Systems Sydney',
    cardHeadline: 'Tenancy access, meeting rooms, executive zones.',
    shortDescription: 'Tenancy access, meeting room booking, executive zones.',
    heroLead:
      'Corporate fit-outs sit at the intersection of facilities management, IT, HR, and physical security. Ktronics works directly with all four to design office security that flows with the building, scales with headcount, and integrates with the platforms your team already uses.',
    icon: '/images/icons/industries/corporate-offices.png',
    heroPhotoPath: '/images/case-studies/corporate-office-comms-rack-sydney.jpg',
    heroPhotoAlt: 'Comms rack supporting a Sydney corporate office security and IT integration',
    challenges: [
      { title: 'Tenancy access', body: 'Card, mobile, or biometric credentials integrated with the base-building access where required. Multi-tenant CBD towers need clean handoff between landlord and tenant.' },
      { title: 'Meeting room and executive zones', body: 'Meeting rooms with credential-only entry; executive floors with biometric or dual-factor. Configurable per-zone, not all-or-nothing.' },
      { title: 'HR system integration', body: 'Credentials provisioned automatically when staff start, deactivated when they leave. Integration with BambooHR, Employment Hero, Workday, or your in-house system.' },
      { title: 'Visitor flow that doesn\u2019t embarrass the brand', body: 'Touchscreen kiosk reception, branded check-in, photo badges, host notifications. The first thing your visitors interact with shouldn\u2019t be a paper book.' },
      { title: 'After-hours and weekend access', body: 'Time-window credentials for cleaners, contractors, and out-of-hours staff. Audit logged, expirable, revocable in seconds.' },
      { title: 'Multi-site corporate networks', body: 'Single panel of glass across every office, anywhere in Australia. Add a site, expand the platform, no re-architecture.' },
    ],
    recommendedSolutions: ['access-control', 'visitor-management', 'video-surveillance', 'maintenance-monitoring'],
    faqs: [
      {
        question: 'Can credentials provision automatically from our HR system?',
        answer:
          'Yes, on the platforms we install (Lenel, Tecom, Genetec). Most modern corporate HR platforms (BambooHR, Employment Hero, Workday, ELMO) expose APIs that let new starters be issued credentials on day one and revoked the moment they leave. The integration is scoped during design and tested as part of commissioning.',
      },
      {
        question: 'How do you handle credentials in a multi-tenant CBD tower?',
        answer:
          "Tenant credentials sit on the tenancy's own access controller, integrated with the base-building reader at the lobby and lift. Tenant ops have full control over their own floors; the base-building manager controls common areas and the lift call. The handoff is clean and the audit trails stay separate.",
      },
      {
        question: 'Can the system support biometric for executive floors?',
        answer:
          'Yes. Fingerprint, facial recognition, and palm-vein readers are all supported for high-security zones. We typically run biometric as dual-factor (biometric + card or PIN) on executive floors so a single failed read doesn\u2019t lock out a legitimate user.',
      },
    ],
    order: 5,
  },

  {
    slug: 'retail-hospitality',
    label: 'Retail & hospitality',
    pageTitle: 'Retail Store & Hospitality Venue Security Systems',
    cardHeadline: 'Storefront protection, venue access, point-of-sale CCTV.',
    shortDescription: 'Storefront protection, venue access, point-of-sale CCTV.',
    heroLead:
      'Retail and hospitality run on tight margins, high foot traffic, and incidents that span shoplifting through to liquor-licence compliance. Ktronics designs venue security that earns its keep: reducing shrinkage, supporting management with point-of-sale-tied footage, and keeping the back-of-house secure without slowing the floor.',
    icon: '/images/icons/industries/retail-hospitality.png',
    heroPhotoPath: '/images/details/detail-comms-rack-green-cabling.jpg',
    heroPhotoAlt: 'Tidy fibre patch supporting CCTV across a retail or hospitality venue',
    challenges: [
      { title: 'Storefront and POS coverage', body: 'High-resolution camera coverage on every till and entry/exit. Tied to POS transaction data so a price-override or void can be reviewed in the same dashboard.' },
      { title: 'Venue and back-of-house access', body: 'Stock rooms, cellars, kitchens, and offices on credential-only access. Deliveries scoped to time-window credentials.' },
      { title: 'Liquor and gaming compliance', body: 'CCTV positioning and retention for licensed venues that meet OLGR or state-equivalent requirements. We don\u2019t want you missing renewal because of a coverage gap.' },
      { title: 'Shrinkage and incident review', body: 'AI analytics flag known patterns (gathered groups at high-shrinkage zones, after-hours back-door activity). Incidents review in minutes, not hours.' },
      { title: 'Multi-venue rollouts', body: 'Single platform across every store or venue. Centralised monitoring, decentralised credentials. Add a new site without rebuilding.' },
      { title: 'After-hours response', body: '24/7 monitoring with verified human response. The duty manager isn\u2019t the night-time alarm response plan.' },
    ],
    recommendedSolutions: ['video-surveillance', 'access-control', 'maintenance-monitoring'],
    faqs: [
      {
        question: 'Can CCTV be tied to point-of-sale data for fraud review?',
        answer:
          'Yes. Modern retail CCTV platforms (Genetec, Avigilon, Hanwha) integrate with POS systems so every transaction line is overlaid on the matching camera feed. Voids, price overrides, refunds, and no-sales become reviewable on a per-transaction basis. Reduces internal shrinkage and gives loss prevention real evidence for staff conversations.',
      },
      {
        question: 'What CCTV retention is required for licensed venues in NSW?',
        answer:
          "NSW Liquor & Gaming requires 28 days minimum for premises with a CCTV condition on their licence, with footage available to police on request. Higher-risk venues (late-trading, declared premises) often need longer. We size storage to your specific licence conditions and provide footage-export workflows that match the police request format, so a request that comes in on Thursday isn't still being processed the following week.",
      },
      {
        question: 'Can we monitor multiple venues from one head office dashboard?',
        answer:
          'Yes. Multi-site retail and hospitality is one of the patterns the major platforms (Lenel, Genetec, Avigilon) handle natively. Head-office security or operations gets a single panel of glass across every venue: live cameras, alarm events, access activity, system health. Each venue still has local control where it makes sense.',
      },
    ],
    order: 6,
  },
];

/** All industries sorted by display order. */
export function allIndustries(): Industry[] {
  return [...industries].sort((a, b) => a.order - b.order);
}

/** Get one industry by slug. Throws if missing. */
export function getIndustry(slug: string): Industry {
  const found = industries.find((i) => i.slug === slug);
  if (!found) throw new Error(`Unknown industry slug: ${slug}`);
  return found;
}

/** All industries except the current one (for the related strip). */
export function relatedIndustries(currentSlug: string): Industry[] {
  return allIndustries().filter((i) => i.slug !== currentSlug);
}
