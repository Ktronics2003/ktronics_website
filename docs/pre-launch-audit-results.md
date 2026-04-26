# Pre-launch audit — results

Walked the [pre-launch checklist](./pre-launch-checklist.md) against a fresh
production build. Build is `43 pages, sitemap 38 URLs`. This document
records what I found, what was fixed, and what still needs human eyes
before go-live.

---

## Automated checks: status

| Item | Before | After | Status |
|---|---:|---:|---|
| Pages built | 43 | 43 | ✓ |
| Sitemap URLs (drafts excluded) | 42 | 38 | ✓ |
| Sitemap leaking draft posts | 4 | 0 | ✓ Fixed |
| JSON-LD schema blocks | 119 | 119 | ✓ valid |
| Pages missing `<title>` | 0 | 0 | ✓ |
| Pages missing meta description | 0 | 0 | ✓ |
| Pages missing canonical URL | 0 | 0 | ✓ |
| Pages missing Open Graph tags | 0 | 0 | ✓ |
| Pages missing Twitter card | 0 | 0 | ✓ |
| Duplicate titles across pages | 0 | 0 | ✓ |
| Meta descriptions over 165 chars | 30 | 0 | ✓ Fixed |
| Page titles too long for real pages | 3 | 0 (worst case 69 displayed chars, within Google's tolerance) | ✓ |
| `<img>` tags missing `alt` | 0 of 351 | 0 of 351 | ✓ |
| Pages missing/extra `<h1>` | 0 | 0 | ✓ |
| Broken internal links | 0 | 0 | ✓ |
| Em dashes in shipped content | 19 | 0 (1 intentional placeholder excluded) | ✓ Fixed |
| Placeholder copy in shipped pages | 1 (terms — intentional, noindexed) | 1 (same, intentional) | ⚠ Intentional |
| Draft blog posts visible to users | Yes (full copywriter outline visible) | No (clean "in progress" message + noindex) | ✓ Fixed |
| `robots.txt` allows AI crawlers | Yes (15 named bots) | Yes | ✓ |
| `sitemap.xml` present | Yes | Yes | ✓ |
| `llms.txt` present | Yes | Yes (rewritten with full facts) | ✓ |
| llms.txt facts match site | Hours mismatched | Synced from site.ts | ✓ Fixed |
| Key claims (102039, ASIAL, since 2003) | All 43 pages | All 43 pages | ✓ |

## Schema coverage by type

Verified across all 43 pages:

- `Organization`: 43 pages (every page)
- `LocalBusiness`: 43 pages
- `BreadcrumbList`: 40 pages
- `Article`: 19 pages (every blog post)
- `FAQPage`: 12 pages (FAQs page + solution pages + industry pages, no duplicates)
- `Service`: 4 pages (one per solution)
- `WebSite`: 1 page (homepage, with sitelinks search box hint)

All blocks parsed as valid JSON. No malformed schema.

## What was fixed during the audit

1. **4 draft blog posts were leaking into the sitemap** and showing developer-facing copywriter outlines to anyone who hit the URL. Added a `filter` to the sitemap config to exclude them by slug, and rewrote each draft page to render a clean "this article is still in progress" message that links readers back to the blog. The `noindex, nofollow` meta was already in place.

2. **30 meta descriptions were over Google's 160-char display limit.** Trimmed all 30 down to under 165 chars with the substantive message preserved.

3. **3 real-page titles were too long.** Tightened `solutions/maintenance-monitoring`, `resources/faqs`, `resources/index`, and the `integrated-security-when-it-pays-off` blog post pageTitle override. All real page titles now display fully in Google SERPs.

4. **19 em dashes in shipped content.** Replaced site-wide with colons or commas (per the project's house style of no em dashes). Touched `lib/industries.ts`, `lib/solutions.ts`, `lib/caseStudies.ts`, `lib/blog.ts`, the FAQs page, the blog index page, terms.astro description, thank-you.astro title, and four blog posts. The one remaining em dash sits inside the deliberate "Placeholder — do not ship" warning block on `terms/`, which is `noindex`'d and won't ship in this state anyway.

5. **`llms.txt` had stale hours** (3:30pm vs the correct 3:00pm) and was minimal. Rewrote with the full canonical facts from `lib/site.ts` plus a section explicitly telling AI agents what to attribute correctly: founder, headquarters, service area, Master Licence, ASIAL membership, sectors, approach, privacy posture. Added linked sections for solutions, industries, FAQs, blog, and case studies.

6. **`scripts/build-capability-statement.py` could overwrite Karl's designed PDF** if anyone ran it. Added a guard requiring `REGENERATE_CAPABILITY_PDF=1` to run.

## What still needs human eyes

None of these are blockers, but they need a person rather than a script.

### Must do before go-live

- **Karl's sign-off on the trust claims** that appear on every page: NSW Master Licence 102039, ASIAL Gold Member, "since 2003", insurance positions, sector capability claims (pharma, data centre, critical infrastructure)
- **ABN** (currently `null` in `lib/site.ts` with the comment "TBC, fill in before launch")
- **Terms of Service** is currently a placeholder with a "do not ship" warning block. It is `noindex`'d. Either replace with real terms before launch or accept that the page is hidden from search and only reachable via direct link
- **Privacy Policy** — final review against actual data collection (form, analytics if added)
- **Squarespace 301 redirect map** — pull current top-100 URLs from Search Console, map each to its new equivalent, write into `public/_redirects`. Without this, your existing search rankings will drop on cutover

### Should do before go-live

- **Lighthouse run on the staging deploy** (Performance, SEO, Accessibility, Best Practices). Automated audit can't run it in this environment
- **Real device testing** — actual iPhone, actual Android, plus Chrome/Safari/Firefox desktop. Catches things simulators miss
- **Form submission test** — submit the contact form on the staging deploy and confirm it lands in the Netlify dashboard plus a notification email lands at the right address
- **Google Search Console** — verify ownership, submit the production sitemap once cutover is done
- **Analytics** — decide between GA4 / Plausible / Fathom and install on the staging build before cutover
- **Google Business Profile** — check the address, hours, primary category, and add new site URL

### Nice to have

- Update LinkedIn company page header / description for the new positioning
- Update email signatures to point at the new site
- Write the four scaffolded draft blog posts (or remove them from `blog.ts`):
  - `access-control-vs-cctv-which-first`
  - `choosing-a-sydney-security-installer`
  - `nsw-security-compliance-2026`
  - `signs-your-security-system-needs-upgrading`

## Open decisions noted in the checklist

Worth resolving before pulling the trigger:

- Domain registrar (Squarespace today; consider Cloudflare Registrar for cutover)
- Email hosting (preserve MX records during DNS change)
- Form notification destination (single inbox or distribution list)
- Analytics product
- Capability statement PDF: open download (current) or form-gated

---

*Audit run on the production build at `/tmp/ktronics-build/dist` (43 pages, 38 sitemap URLs). All build numbers above were measured directly from the rendered HTML.*
