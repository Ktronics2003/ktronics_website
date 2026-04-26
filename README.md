# Ktronics website

Astro + Tailwind + Decap CMS rebuild of [ktronics.com.au](https://www.ktronics.com.au).

This repository implements the spec in `handover/` (project brief, tech spec, design system, sitemap, SEO requirements, content inventory, launch checklist).

## Status

- [x] Project scaffold (Astro 5, Tailwind, TypeScript)
- [x] Design tokens + global stylesheet
- [x] Base + Page layouts with SEO + JSON-LD
- [x] Header (sticky + mobile overlay) and Footer
- [x] Reusable UI components (Logo, Button, Eyebrow, SectionHeader)
- [x] Homepage section components (Hero, Stats, Solutions, Feature, Industries, Testimonial, Process, CTA)
- [x] Homepage page wired up
- [x] Real Ktronics install photography wired into Hero + Featured Project
- [x] `robots.txt` (AI crawlers allowed), `llms.txt`, `netlify.toml` with redirect map

## Next milestones

- [ ] Solution detail template (`/solutions/[slug]/`)
- [ ] Industry detail template (`/industries/[slug]/`)
- [ ] Location detail template (`/locations/[slug]/`)
- [ ] Case study detail template (`/case-studies/[slug]/`)
- [ ] Generic content page template (About, Careers, Privacy, Terms)
- [ ] Hub / index page template
- [ ] Contact page + Netlify Form
- [ ] Decap CMS configuration (`/public/admin/`)
- [ ] Astro content collections + Zod schemas
- [ ] Self-hosted fonts (Geist, Fraunces, JetBrains Mono) in `/public/fonts/`
- [ ] OG image (`/public/images/og/og-default.jpg`)
- [ ] Replace placeholder testimonial with a real one
- [ ] Confirm hours discrepancy with Karl/Lesley (see content inventory)

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serve ./dist locally
```

Node 20+ required (see `.nvmrc`).

## Project layout

```
public/                Static, served as-is
  fonts/               Self-hosted WOFF2 (drop files in — see /src/styles/global.css for @font-face declarations)
  images/og/           OG / social images
  admin/               Decap CMS config (TODO)
  robots.txt
  llms.txt
  favicon.svg

src/
  assets/images/       Source images (run through Astro's <Image /> for AVIF/WebP)
  components/
    ui/                Logo, Button, Eyebrow, SectionHeader
    layout/            Header, Footer
    sections/          Hero, StatsBar, SolutionsGrid, FeatureCaseStudy,
                       IndustriesList, Testimonial, Process, CtaBlock
  content/             Astro content collections (TODO)
  layouts/             BaseLayout (HTML shell + meta), PageLayout (+ Header/Footer)
  lib/
    site.ts            Single source of truth for company facts
    schema.ts          JSON-LD generators
    seo.ts             Meta tag resolver
  pages/
    index.astro        Homepage
  styles/
    global.css         Design tokens + base + buttons + scroll reveal

netlify.toml           Build config + 301 redirect map (per handover/04)
astro.config.mjs       Astro + integrations
tailwind.config.mjs    Brand tokens (ktx-*) + font families
tsconfig.json          Strict, with @/* path aliases
```

## Path aliases

```ts
import Hero from '@components/sections/Hero.astro';
import { site } from '@lib/site';
import '@styles/global.css';
```

## Brand facts

All company data (phone, address, hours, social URLs, licence number) is held in **`src/lib/site.ts`**. Update there once and it propagates to header, footer, schema, and meta tags.

## SEO

Every page that uses `PageLayout` automatically renders:

- `<title>`, meta description, canonical
- Open Graph + Twitter card
- Robots directive
- JSON-LD: Organization + LocalBusiness (always)

Add page-specific schema by passing `schemaBlocks` to the layout. Helpers in `src/lib/schema.ts` cover Service, BreadcrumbList, FAQPage.

## Photography

Real Ktronics install photography lives in `src/assets/images/`. Always use Astro's `<Image />` component (it emits responsive `srcset`, AVIF/WebP, lazy-loads by default). Use `loading="eager"` and `decoding="async"` only on the LCP image (currently the hero).

Per the design system: real photos only — no stock, no AI-generated shots, no abstract gradients.
