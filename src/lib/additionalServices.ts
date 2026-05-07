/**
 * Additional Services — complementary trade services Ktronics performs alongside
 * the six commercial security pillars. Test & Tag (AS/NZS 3760) and Structured
 * Data Cabling are common bundles for clients we already service.
 *
 * Kept in a separate file from solutions.ts so the homepage / nav / SEO
 * positioning can keep "six pillars of commercial security" as the headline
 * brand story. These pages exist for buyers who specifically search for
 * "test and tag Sydney" or "data cabling commercial Sydney" and to tell
 * existing clients these can be bundled into the same service contract.
 *
 * Used by:
 *   - /additional-services/ hub
 *   - /additional-services/[slug]/ detail pages
 *   - Footer "Additional services" column
 */

export interface AdditionalServiceFaq {
  question: string;
  answer: string;
}

export interface AdditionalService {
  /** URL slug — must match the file at src/pages/additional-services/{slug}.astro */
  slug: string;
  /** Short label for cards + nav */
  label: string;
  /** SEO/page H1 */
  pageTitle: string;
  /** Short summary used on the hub card */
  shortDescription: string;
  /** Long lead paragraph for the detail page hero */
  heroLead: string;
  /** Path to the icon (under /public) */
  icon: string;
  /** Capability bullets */
  capabilities: { title: string; body: string }[];
  /** Page-specific FAQs */
  faqs: AdditionalServiceFaq[];
  /** Display order */
  order: number;
}

export const additionalServices: AdditionalService[] = [
  {
    slug: 'test-and-tag',
    label: 'Test & Tag',
    pageTitle: 'Commercial Test & Tag Services Sydney (AS/NZS 3760)',
    shortDescription:
      'Compliant test and tag of portable electrical equipment to AS/NZS 3760. Bundled into your scheduled security service visit, or as a standalone job.',
    heroLead:
      "Test and tag is the recurring electrical safety check that satisfies your insurer, your WHS obligations, and the office manager who hates having to chase a separate contractor. We perform compliant test and tag of portable electrical equipment to AS/NZS 3760: power tools, leads, RCDs, kettles, microwaves, computers, the lot. Done in line with your scheduled security service visit, so it's one tech, one invoice, one service window.",
    icon: '/images/icons/test-and-tag.png',
    capabilities: [
      { title: 'AS/NZS 3760 compliant testing', body: 'Visual inspection, earth continuity, insulation resistance, and polarity tests on every appliance, performed by trained, current-certified testers.' },
      { title: 'Tagging and digital register', body: 'Each item tagged with date tested, next due date, and tester ID. A digital register is provided so you can prove compliance at any audit or insurance review.' },
      { title: 'Sector-appropriate intervals', body: 'Test cycles set against your environment per AS/NZS 3760: 12 months for offices, 6 months for factories and workshops, 3 months for construction and high-risk sites.' },
      { title: 'RCD push-button and trip-time testing', body: 'Switchboard RCDs and portable RCDs tested for trip current and trip time. Failed devices flagged and replacement quoted on the spot.' },
      { title: 'Bundled with security service', body: 'For clients on a Ktronics maintenance contract, test and tag can be folded into the scheduled service visit. One site visit, one tech, one invoice.' },
      { title: 'Standalone visits', body: "If you don't have a security contract with us, we still take on standalone test and tag jobs across Sydney metro. Quoted per item or per site, depending on volume." },
    ],
    faqs: [
      {
        question: 'How often does test and tag need to be done?',
        answer:
          'It depends on the environment. AS/NZS 3760 sets the cycles: 3 months for construction and demolition sites, 6 months for factories, workshops and warehouses (where damage is reasonably likely), and 12 months for typical office and commercial environments. Hire equipment is 3 months. Microwaves require additional radiation leakage testing every 12 months. We set the cycle in your service plan and remind you when each round is due.',
      },
      {
        question: 'Is test and tag a legal requirement?',
        answer:
          "Test and tag is mandatory in some sectors (construction, demolition, and mining sites under WHS regulations) and a recommended best-practice in most other commercial environments. Even where it's not strictly mandated, your insurer or WHS auditor will typically expect a compliant register. If something fails and there's no record of testing, that becomes a problem.",
      },
      {
        question: 'Do you provide a digital register or just paper tags?',
        answer:
          "Both. Each appliance gets a physical compliance tag (date tested, next test due, tester ID) and we provide a digital register (CSV or PDF) listing every item, its location, last tested date, next due date, and pass/fail result. The register is what your insurer or auditor will ask for.",
      },
      {
        question: 'What happens if an item fails?',
        answer:
          "Failed items get a 'Do Not Use' tag, are recorded in the register, and we flag them to your nominated contact on the day. Where the fix is straightforward (lead replacement, RCD swap), we can quote and complete the repair on the spot. Items beyond economic repair are recommended for retirement.",
      },
    ],
    order: 1,
  },

  {
    slug: 'structured-data-cabling',
    label: 'Structured Data Cabling',
    pageTitle: 'Commercial Structured Data Cabling Sydney',
    shortDescription:
      'Cat 6, Cat 6A, and fibre cabling for offices, warehouses, and comms rooms. Designed and installed to AS/CA S009. Comms rack fit-out and certification included.',
    heroLead:
      "We do all our own cabling for security installs, which means data cabling is core trade for us, not a sub-contracted afterthought. Whether it's a fresh office fit-out, a warehouse network, or a comms room consolidation, we design, install, and certify structured cabling to the relevant Australian standards. Cat 6, Cat 6A, single-mode and multi-mode fibre, full comms rack fit-out, and a documented patch schedule for handover.",
    icon: '/images/icons/data-cabling.png',
    capabilities: [
      { title: 'Cat 6 and Cat 6A copper', body: 'Full structured cabling installs to support gigabit and 10-gigabit ethernet across office and warehouse environments. Tested and certified at handover.' },
      { title: 'Single-mode and multi-mode fibre', body: 'Fibre backbones between buildings, comms rooms, and floors. OS2 single-mode for distance, OM3/OM4 multi-mode for in-building runs. Fusion splicing on-site.' },
      { title: 'Comms rack design and fit-out', body: 'Floor-standing and wall-mount cabinets specified, installed, and populated. Patch panels, cable management, power, ventilation, and the kind of tidy lacing that holds up at audit.' },
      { title: 'Voice and data points', body: 'Outlet installation across desks, meeting rooms, reception, and operational areas. Modular plates, labelled to the patch schedule.' },
      { title: 'Site certification and as-built docs', body: 'Every link tested with a calibrated certifier. As-built drawings, cable schedule, and test reports provided at handover. Ready for your IT team or your auditor.' },
      { title: 'Bundled with security install', body: "If we're already installing access control or CCTV at your site, the data cabling for those systems plus your separate office network can be done as one coordinated project. One trade, one invoice, one set of as-builts." },
    ],
    faqs: [
      {
        question: 'What cabling category should we use for a new office fit-out?',
        answer:
          "Cat 6 is the practical default for new office cabling in 2026: it supports gigabit ethernet over the typical horizontal run length, and most commercial network gear runs at gigabit. Cat 6A is the right choice if you're running 10-gigabit ethernet (typically backbone or to high-density wireless access points), if you want to future-proof for the next 10 years, or where Power over Ethernet+ (PoE+) heat dissipation matters. We'll recommend the right category for your specific scenario at design.",
      },
      {
        question: 'Do you install fibre as well as copper?',
        answer:
          'Yes. Fibre is the standard choice for backbone runs (between comms rooms, between buildings on a campus, or for runs longer than 90 metres). We install OS2 single-mode for distance and external runs, OM3/OM4 multi-mode for in-building. Fusion splicing and termination done on-site.',
      },
      {
        question: 'Can you take over an existing cabling install and certify it?',
        answer:
          "Yes. We're regularly asked to test, document, and certify legacy cabling that was installed without proper records. We test every link, identify any that don't meet category specification, and produce an as-built drawing plus a test report. Failed links are flagged with options (recertify after correction, replace, or accept as out-of-spec).",
      },
      {
        question: 'Are your cablers ACMA registered?',
        answer:
          "Yes. Anyone connecting cabling to the public network in Australia must hold ACMA Cabler Registration. Our installers hold current ACMA registration at the appropriate level for the work performed (Open Cabling for telephony and data, plus the relevant endorsements for fibre, structured cabling, and coax).",
      },
    ],
    order: 2,
  },
];

/** Helper: get one service by slug. Throws if not found. */
export function getAdditionalService(slug: string): AdditionalService {
  const found = additionalServices.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown additional service slug: ${slug}`);
  return found;
}

/** Helper: all services sorted by display order. */
export function allAdditionalServices(): AdditionalService[] {
  return [...additionalServices].sort((a, b) => a.order - b.order);
}
