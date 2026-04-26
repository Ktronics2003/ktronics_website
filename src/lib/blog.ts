/**
 * Single source of truth for all blog post metadata.
 *
 * Body content lives in each post's individual .astro page file (long-form
 * prose is awkward to maintain in TypeScript template literals). This file
 * just carries the structured fields that drive listing pages, schema, and
 * cross-linking: slug, title, excerpt, date, author, hero image, draft flag.
 *
 * Adding a post:
 *   1. Append an entry below
 *   2. Create src/pages/resources/blog/{slug}.astro that imports the matching
 *      metadata via getPost(slug) and writes the body inline
 */

export interface BlogPost {
  slug: string;
  /** Short title for the card + breadcrumb */
  title: string;
  /** Full SEO title (defaults to title if omitted) */
  pageTitle?: string;
  /** SEO meta description */
  metaDescription: string;
  /** 1-2 sentence excerpt for the blog index */
  excerpt: string;
  /** ISO date string (YYYY-MM-DD) */
  publishDate: string;
  /** Optional last-updated date */
  updatedDate?: string;
  /** Author display name */
  author: string;
  /** Topical tag(s) — used for filtering later */
  tags: string[];
  /** Estimated read time, e.g. "8 min read" */
  readTime: string;
  /** Hero photo path under /public */
  heroImage: string;
  heroImageAlt: string;
  /** Display order on the blog index (newest first by default; can override) */
  order: number;
  /** Draft posts don't appear on the blog index or sitemap */
  draft: boolean;
}

export const posts: BlogPost[] = [
  {
    slug: 'commercial-cctv-cost-sydney-2026',
    title: 'How much does a commercial CCTV system cost in Sydney? (2026 guide)',
    pageTitle: 'Commercial CCTV Cost in Sydney: 2026 Pricing Guide',
    metaDescription:
      "What commercial CCTV actually costs in Sydney in 2026. Real price ranges by site type, what drives the cost, and what to ask any installer before signing.",
    excerpt:
      "What does commercial CCTV actually cost in Sydney in 2026? Real price ranges by site type, what drives the cost, and what to look for in a quote.",
    publishDate: '2026-04-25',
    author: 'The Ktronics team',
    tags: ['CCTV', 'Pricing', 'Buying guides'],
    readTime: '8 min read',
    heroImage: '/images/details/warehouse-cctv-cameras-and-sensors.jpg',
    heroImageAlt: 'Commercial CCTV cameras and PIR sensors mounted to a warehouse ceiling',
    order: 1,
    draft: false,
  },

  /* --- Drafts: scaffolded routes, content to be written ------------------- */
  {
    slug: 'access-control-vs-cctv-which-first',
    title: 'Access control vs CCTV: which does your business need first?',
    metaDescription:
      "Most commercial sites need both eventually. If budget forces a choice, which one delivers more value first? A practical comparison for Sydney businesses.",
    excerpt: 'Most commercial sites need both eventually. If budget forces a choice, which one delivers more value first?',
    publishDate: '2026-04-26',
    author: 'The Ktronics team',
    tags: ['Access control', 'CCTV', 'Buying guides'],
    readTime: '6 min read',
    heroImage: '/images/details/detail-access-control-board-din-rail.jpg',
    heroImageAlt: 'Commercial access control board on DIN rail',
    order: 2,
    draft: true,
  },
  {
    slug: 'nsw-security-compliance-2026',
    title: 'NSW security industry compliance: what businesses need to know in 2026',
    metaDescription:
      "Commercial security regulations in NSW: Master Licence, ASIAL, sector frameworks (NQS, OLGR, APP), and what to expect from a compliant installer.",
    excerpt: 'Master Licence, ASIAL, sector-specific frameworks. The compliance checklist for any Sydney business buying commercial security in 2026.',
    publishDate: '2026-04-27',
    author: 'The Ktronics team',
    tags: ['Compliance', 'Regulation'],
    readTime: '7 min read',
    heroImage: '/images/details/detail-alarm-intrusion-control-panel.jpg',
    heroImageAlt: 'Alarm and intrusion control panel with backup battery',
    order: 3,
    draft: true,
  },
  {
    slug: 'signs-your-security-system-needs-upgrading',
    title: '5 signs your commercial security system needs upgrading',
    metaDescription:
      "Cameras going offline, false alarms accumulating, panels you can't get parts for. Five concrete signs your commercial security system has reached end-of-life.",
    excerpt: 'Cameras going offline, false alarms, panels you can\u2019t get parts for. The signs your system has reached end-of-life.',
    publishDate: '2026-04-28',
    author: 'The Ktronics team',
    tags: ['Maintenance', 'Upgrades'],
    readTime: '5 min read',
    heroImage: '/images/details/detail-comms-rack-fitout.jpg',
    heroImageAlt: 'Comms rack ready for an upgrade',
    order: 4,
    draft: true,
  },
  {
    slug: 'choosing-a-sydney-security-installer',
    title: 'What to look for in a Sydney security installer (and what to avoid)',
    metaDescription:
      "Choosing a commercial electronic security installer in Sydney: the questions to ask, the credentials to check, and the red flags that should rule out a quote.",
    excerpt: 'Questions to ask. Credentials to check. Red flags that should rule out a quote before you sign anything.',
    publishDate: '2026-04-29',
    author: 'The Ktronics team',
    tags: ['Buying guides'],
    readTime: '6 min read',
    heroImage: '/images/case-studies/corporate-office-comms-rack-sydney.jpg',
    heroImageAlt: 'Comms rack supporting a Sydney corporate office security platform',
    order: 5,
    draft: true,
  },

  /* --- News / Events posts (migrated from legacy /events page) ---------- */

  {
    slug: 'sectech-roadshow-2026',
    title: 'Ktronics is exhibiting at the SecTech Roadshow 2026',
    metaDescription:
      "Ktronics is exhibiting at the SecTech Roadshow 2026 across five Australian cities this May. Brisbane, Sydney, Melbourne, Adelaide, and Perth dates and venues.",
    excerpt: 'Five cities, five dates. We&apos;re booking meetings with commercial operators across Brisbane, Sydney, Melbourne, Adelaide, and Perth this May.',
    publishDate: '2026-04-15',
    author: 'The Ktronics team',
    tags: ['Events', 'News'],
    readTime: '4 min read',
    heroImage: '/images/events/sectech-2026.jpg',
    heroImageAlt: 'Karl Lamb arriving at the SecTech Roadshow 2026 with kit bag, branded SecTech banner behind',
    order: 6,
    draft: false,
  },
  {
    slug: 'sectech-nz-2025',
    title: 'Karl at SecTech New Zealand 2025',
    metaDescription:
      "Why Karl Lamb attended SecTech New Zealand 2025: keeping pace with international commercial security technology and supplier-side product development.",
    excerpt: 'Why Karl crossed the Tasman to walk the SecTech NZ floor in 2025, and what it means for our Sydney commercial clients.',
    publishDate: '2025-10-20',
    author: 'The Ktronics team',
    tags: ['Events', 'News'],
    readTime: '3 min read',
    heroImage: '/images/events/sectech-2025.jpg',
    heroImageAlt: 'Karl Lamb at the Ktronics Leaderboard stand at SecTech New Zealand 2025',
    order: 7,
    draft: false,
  },
  {
    slug: 'asial-sydney-2025',
    title: 'On the floor at the ASIAL Security Conference 2025',
    metaDescription:
      "Three takeaways from walking the ASIAL 2025 expo at ICC Sydney: AI-driven CCTV analytics, cloud-managed access control, integrated ICT platforms.",
    excerpt: 'We attended ASIAL 2025 at ICC Sydney as visitors this year. Three takeaways from the floor that will shape the systems we&rsquo;re quoting in 2026.',
    publishDate: '2025-08-22',
    author: 'The Ktronics team',
    tags: ['Events', 'News'],
    readTime: '3 min read',
    heroImage: '/images/events/asial-2025.jpg',
    heroImageAlt: 'The Ktronics team at the ASIAL Security Conference & Exhibition 2025 at ICC Sydney',
    order: 8,
    draft: false,
  },
  {
    slug: 'asial-sydney-2024',
    title: 'Recap: Ktronics at the ASIAL Security Conference 2024',
    metaDescription:
      "Recap of the 2024 ASIAL Security Conference at ICC Sydney where Ktronics ran the 'Fastest Tech in Sydney' challenge. Winning time: 2 min 10 sec.",
    excerpt: "A recap of the 2024 ASIAL Conference at ICC Sydney, including the winning time on our 'Fastest Tech in Sydney' challenge.",
    publishDate: '2024-08-22',
    author: 'The Ktronics team',
    tags: ['Events', 'News'],
    readTime: '3 min read',
    heroImage: '/images/events/asial-2024-challenge.jpg',
    heroImageAlt: "The 'Fastest Tech in Sydney' challenge running on the Ktronics stand at the ASIAL Security Conference 2024 at ICC Sydney",
    order: 9,
    draft: false,
  },
  {
    slug: 'ktronics-on-the-block-2020',
    title: 'On The Block 2020: a one-off in high-end residential',
    metaDescription:
      "Ktronics installed a custom security system for a 2020 Block house. A one-off media project that proved our commercial-grade standards travel up.",
    excerpt: 'In 2020 we installed a custom security system for one of the homes on The Block. A one-off media project that proved the same engineering standards travel up.',
    publishDate: '2020-11-18',
    author: 'The Ktronics team',
    tags: ['News', 'Media'],
    readTime: '3 min read',
    heroImage: '/images/events/the-block-2020.jpg',
    heroImageAlt: "Ktronics technician on-site during the 2020 series of The Block, captured by the Channel 9 production crew",
    order: 10,
    draft: false,
  },

  /* --- Buying-guide / explainer articles ---------------------------------- */

  {
    slug: 'cloud-vs-on-premise-access-control',
    title: 'Cloud-managed vs on-premise access control: which is right for your business in 2026?',
    pageTitle: 'Cloud vs On-Premise Access Control 2026: Which to Choose',
    metaDescription:
      "Cloud-managed vs on-premise access control: a 2026 comparison for Sydney commercial buyers. Five-year cost, internet dependency, multi-site, when each wins.",
    excerpt: "An honest comparison of cloud-managed and on-premise access control for Sydney commercial sites. Cost, control, internet dependency, and when each pattern actually wins.",
    publishDate: '2026-04-30',
    author: 'The Ktronics team',
    tags: ['Access control', 'Buying guides'],
    readTime: '8 min read',
    heroImage: '/images/details/detail-access-control-board-din-rail.jpg',
    heroImageAlt: 'Access control board on DIN rail with neat colour-coded cabling',
    order: 10,
    draft: false,
  },
  {
    slug: 'commercial-cctv-retention-nsw-2026',
    title: 'How long should commercial CCTV footage be kept? NSW retention guide (2026)',
    pageTitle: 'Commercial CCTV Retention Periods NSW 2026: Complete Guide',
    metaDescription:
      "How long commercial CCTV footage should be kept in NSW: sector-by-sector retention for liquor, aged care, pharma, healthcare, and general commercial.",
    excerpt: 'How long does commercial CCTV footage actually need to be kept in NSW? A sector-by-sector breakdown of legal minimums, insurance norms, and what we recommend in 2026.',
    publishDate: '2026-05-02',
    author: 'The Ktronics team',
    tags: ['CCTV', 'Compliance'],
    readTime: '7 min read',
    heroImage: '/images/details/warehouse-cctv-cameras-and-sensors.jpg',
    heroImageAlt: 'Commercial CCTV cameras mounted to a warehouse ceiling',
    order: 11,
    draft: false,
  },
  {
    slug: 'annual-security-service-visit-checklist',
    title: 'What does a proper annual commercial security service visit actually cover?',
    pageTitle: 'Annual Commercial Security Service Checklist (Sydney 2026)',
    metaDescription:
      "What's actually included in a commercial security annual maintenance visit. A buyer's checklist for auditing your installer, with red flags to watch for.",
    excerpt: 'Use this as a checklist when your current installer rolls up for the annual service. What good looks like, what most installers skip, and the red flags worth raising.',
    publishDate: '2026-05-04',
    author: 'The Ktronics team',
    tags: ['Maintenance', 'Buying guides'],
    readTime: '8 min read',
    heroImage: '/images/details/ktronics-monitoring-room.jpg',
    heroImageAlt: 'Ktronics technician on-site servicing security hardware at a Sydney commercial property',
    order: 12,
    draft: false,
  },
  {
    slug: 'integrated-security-when-it-pays-off',
    title: 'Integrated security: when combining access, CCTV, and alarms actually pays off',
    pageTitle: 'Integrated Security: When It Actually Pays Off',
    metaDescription:
      "Is integrated security worth the extra cost? An honest both-sides read on when one platform pays off vs separate systems.",
    excerpt: 'Integration sells well in pitches. Whether it actually delivers value depends on three things. An honest read on when integrated security pays off, and when it doesn\u2019t.',
    publishDate: '2026-05-06',
    author: 'The Ktronics team',
    tags: ['Access control', 'CCTV', 'Buying guides'],
    readTime: '9 min read',
    heroImage: '/images/details/detail-comms-rack-green-cabling.jpg',
    heroImageAlt: 'Tidy fibre patch supporting an integrated security platform',
    order: 13,
    draft: false,
  },
];

/** All published posts sorted by publish date descending (newest first). */
export function publishedPosts(): BlogPost[] {
  return [...posts]
    .filter((p) => !p.draft)
    .sort((a, b) => (b.publishDate.localeCompare(a.publishDate)));
}

/** Get one post by slug. Throws if missing. */
export function getPost(slug: string): BlogPost {
  const found = posts.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown blog post slug: ${slug}`);
  return found;
}

/** Other published posts, excluding the current. Used for "Related posts". */
export function relatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  return publishedPosts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);
}

/**
 * Tags that mark a post as a community/people/events piece (used to split
 * the blog into two streams on the Resources hub).
 */
const COMMUNITY_TAGS = new Set(['Events', 'News', 'Media']);

/** Posts about Ktronics in the community: people, events, expos. */
export function communityPosts(limit?: number): BlogPost[] {
  const list = publishedPosts().filter((p) =>
    p.tags.some((t) => COMMUNITY_TAGS.has(t)),
  );
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/** Posts that are general buying guides, articles, explainers (i.e. NOT community/events). */
export function articlePosts(limit?: number): BlogPost[] {
  const list = publishedPosts().filter(
    (p) => !p.tags.some((t) => COMMUNITY_TAGS.has(t)),
  );
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}
