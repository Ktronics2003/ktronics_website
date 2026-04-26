# Pre-launch checklist — ktronics.com.au

Walk this top-to-bottom before signing off the go-live. Aim is "no surprises after DNS cuts over". Tick as you go.

---

## 1. Final content review

Walk every page on a fresh browser session. Read every line.

- [ ] Home
- [ ] About
- [ ] Solutions hub + 4 detail pages (access control, video surveillance, visitor management, maintenance & monitoring)
- [ ] Industries hub + 6 detail pages (warehouse/logistics, strata/multi-tenant, childcare/schools, medical/allied health, corporate offices, retail/hospitality)
- [ ] Case Studies hub + 5 detail pages
- [ ] Resources hub
- [ ] Resources / FAQs
- [ ] Resources / Blog index
- [ ] Every blog post (10 currently published)
- [ ] Contact
- [ ] Thank-you
- [ ] Careers
- [ ] Privacy Policy
- [ ] Terms
- [ ] Custom 404

For each page check: spelling, grammar, no em dashes, no placeholder copy ("Lorem ipsum", "TODO", "[client name]"), no client-identifying details that leaked through, every internal link resolves.

## 2. Karl's sign-off (the claims that matter)

- [ ] NSW Master Licence number 102039 displayed correctly everywhere it appears
- [ ] ASIAL Gold Member claim correct
- [ ] "In business since 2003" / "20+ years" wording consistent
- [ ] Insurance and certification claims accurate
- [ ] Sector claims (pharma, data centre, critical infrastructure) honestly representable if a client asked for proof
- [ ] No competitor naming
- [ ] No staff last names (per privacy rule)
- [ ] No headcount claims
- [ ] No specific named clients in case studies — all anonymised to sector descriptors

## 3. Contact details

- [ ] Phone number(s) correct on every page where they appear
- [ ] Email addresses correct (info@, service@, careers@ etc)
- [ ] Office hours correct (8am to 3pm)
- [ ] Postal/PO Box address correct
- [ ] Service area copy correct (Sydney metro)
- [ ] Social media links go to live, current accounts (or remove if dormant)

## 4. SEO basics

### Per-page metadata

- [ ] Every page has a unique `<title>` (50–60 chars)
- [ ] Every page has a unique meta description (140–160 chars)
- [ ] Every page has a canonical URL set
- [ ] Open Graph tags present (og:title, og:description, og:image, og:url, og:type)
- [ ] Twitter card metadata present
- [ ] Every image has descriptive alt text (not "image of...", not blank)
- [ ] Hero images sized to render under 250 KB after WebP conversion

### Structured data (JSON-LD)

- [ ] Organization schema on every page
- [ ] LocalBusiness schema with NAP (name, address, phone) consistent across the site
- [ ] BreadcrumbList schema on inner pages
- [ ] Service schema on each solution page
- [ ] Article schema on every blog post (including author, datePublished, image)
- [ ] FAQPage schema on FAQ + Contact pages (no duplication of the same Qs)
- [ ] Validate every schema block in [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate sitemap.xml renders cleanly at `/sitemap-index.xml`

### Indexing

- [ ] `robots.txt` present, allows crawling of all public pages
- [ ] No `noindex` left on any production page
- [ ] No staging URLs leaking into the production sitemap
- [ ] HTTPS enforced; HTTP redirects to HTTPS
- [ ] WWW vs apex resolved (one redirects to the other consistently)
- [ ] Trailing slash behaviour consistent

### Migration from Squarespace

- [ ] Pull current ktronics.com.au sitemap and Search Console "top pages" list
- [ ] Map every old URL to its closest new equivalent
- [ ] Add 301 redirects to `_redirects` (Netlify) for every mapped URL
- [ ] 410 (Gone) for any old pages that intentionally don't exist any more
- [ ] Verify a sample of redirects on the staging deploy

## 5. llms.txt for AI agents

[llms.txt](https://llmstxt.org/) is the emerging standard for telling AI agents (Claude, ChatGPT, Perplexity, Gemini) what your site is, what they should cite, and how to find the canonical version of your information. Worth doing properly because AI-driven answers increasingly route procurement-research traffic.

- [ ] `/llms.txt` at site root
- [ ] One-paragraph company overview (who, what, where, since when)
- [ ] Linked summary of each major section: Solutions, Industries, Case Studies, FAQs, Resources, Contact
- [ ] Key facts an AI should attribute correctly: ASIAL Gold Member, NSW Master Licence 102039, founded 2003, Sydney commercial focus, no residential
- [ ] Optional `/llms-full.txt` with the full plain-text version of the canonical pages
- [ ] Listed in `robots.txt` as allowed
- [ ] Plain text, UTF-8, no HTML, no JS

A workable starter outline:

```
# Ktronics

> Sydney commercial electronic security installer. ASIAL Gold Member,
> NSW Master Licence 102039. In business since 2003. Designs, installs,
> and maintains access control, CCTV, alarm, and visitor-management
> systems for commercial sites including pharmaceutical distribution,
> data centres, critical infrastructure, corporate offices, warehousing,
> healthcare, and retail. Trade-led, no sales reps. Privacy-first
> approach: client names anonymised in published case studies.

## Solutions
- [Access control](https://ktronics.com.au/solutions/access-control/): ...
- [Video surveillance](https://ktronics.com.au/solutions/video-surveillance/): ...
- [Visitor management](https://ktronics.com.au/solutions/visitor-management/): ...
- [Maintenance & monitoring](https://ktronics.com.au/solutions/maintenance-monitoring/): ...

## Buying guides & FAQs
- [Frequently asked questions](https://ktronics.com.au/resources/faqs/)
- [Blog & buying guides](https://ktronics.com.au/resources/blog/)

## Contact
- [Get a quote](https://ktronics.com.au/contact/)
```

## 6. Performance

Run Lighthouse on the staging deploy, in incognito, on at least: home, a solution detail, an industry detail, a case study detail, a long blog post.

- [ ] Performance ≥ 90 on each
- [ ] SEO score 100
- [ ] Accessibility ≥ 95
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] All images have width/height set so layout doesn't shift on load
- [ ] Hero images served as WebP with JPEG fallback
- [ ] Below-fold images have `loading="lazy"`
- [ ] Fonts don't block render (preconnect / font-display swap)

## 7. Mobile + cross-browser

- [ ] Every page tested at iPhone width (~390px) — no horizontal scroll, touch targets ≥ 44px
- [ ] Every page tested at tablet width (~768px)
- [ ] Mobile nav opens, closes, links navigate
- [ ] Tested in Chrome, Safari, Firefox at minimum
- [ ] Tested on a real iPhone and a real Android device (simulators miss things)

## 8. Accessibility

- [ ] Single h1 per page; sensible h2/h3 hierarchy
- [ ] Colour contrast meets WCAG AA (red on light surfaces is the one to spot-check)
- [ ] Keyboard-only navigation works — tab through every interactive element on home + contact
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs (`<label for>` or wrapping)
- [ ] All form errors readable by screen readers
- [ ] Skip-to-content link present
- [ ] Page language declared (`<html lang="en-AU">`)
- [ ] All decorative SVGs marked `aria-hidden="true"`

## 9. Forms + integrations

- [ ] Contact form submits successfully on the staging deploy
- [ ] Submission lands in Netlify Forms dashboard
- [ ] Notification email lands in the right inbox(es) within 1 minute
- [ ] Honeypot field present and hidden from users
- [ ] Spam protection acceptable (consider Akismet add-on if test traffic shows noise)
- [ ] Thank-you page renders correctly after submission
- [ ] All form fields validate properly (required, email format)

## 10. Legal

- [ ] Privacy Policy reflects what the site actually collects (form data, analytics, cookies)
- [ ] Privacy Policy names the right contact for data requests
- [ ] Terms reflect what the business actually offers
- [ ] ABN displayed where required
- [ ] Master Licence number displayed where required (footer at minimum)
- [ ] If using Google Analytics: cookie disclosure present
- [ ] If using a privacy-friendly alternative (Plausible/Fathom): note in privacy policy

## 11. Analytics + monitoring (set up before cutover)

- [ ] Google Search Console property verified for the staging URL, then for the production URL post-cutover
- [ ] Bing Webmaster Tools verified
- [ ] Analytics installed (GA4 or Plausible/Fathom) and firing test pageviews
- [ ] Uptime monitoring (Netlify built-in, or external like UptimeRobot)
- [ ] Set up email alert for build failures in Netlify
- [ ] Consider a 404 monitor for the first week post-launch

## 12. Off-site

- [ ] Google Business Profile updated (address, hours, photos, primary category)
- [ ] LinkedIn company page header / description aligned with new positioning
- [ ] Any directory listings (Yellow Pages, ASIAL directory, etc) point at the new URL
- [ ] Email signatures updated with new URL/links (if needed)

## 13. Backup + rollback plan

- [ ] Full export of current Squarespace site (HTML pages + media) saved somewhere safe
- [ ] DNS records before cutover documented in writing (TTL, A record, MX records, CNAMEs, TXT records for SPF/DKIM)
- [ ] Rollback procedure agreed: if something is critically wrong post-DNS, revert DNS to old records — back online within an hour

## 14. Day-of-launch (in order)

1. Final staging sanity check — open every nav link, submit the contact form
2. Lower DNS TTL to 300s 24 hours before cutover (so changes propagate fast)
3. Add custom domain in Netlify, confirm SSL provisions
4. Switch DNS A record / CNAME at registrar to Netlify
5. Watch DNS propagation ([whatsmydns.net](https://whatsmydns.net/))
6. Verify production URL serves the new site over HTTPS
7. Submit production sitemap to Google Search Console
8. Submit production sitemap to Bing
9. Test contact form on production with a real submission
10. Monitor Netlify dashboard + email for 24 hours

## 15. Within the first week post-launch

- [ ] Check Search Console "Coverage" report — pages indexed, no major crawl errors
- [ ] Check 404 log for any redirects we missed
- [ ] Check Lighthouse on production (sometimes differs from staging)
- [ ] Spot-check Google search results for "Ktronics" and "Ktronics Sydney" — make sure the new pages are starting to surface
- [ ] Cancel Squarespace subscription only after confirming everything is stable

---

## Things to decide before sign-off

A few open questions worth resolving while you do the review:

- Where ktronics.com.au is registered today and whether to transfer it (Cloudflare Registrar is cheap and reliable)
- Where company email is hosted and whether the cutover affects it (the MX records need to be preserved across the DNS change)
- Whether form notifications go to one inbox or a distribution list
- Whether you want analytics at all, and if so which (GA4 is the default; Plausible is the privacy-friendly option)
- Whether the capability statement PDF should be gated (form-required) or open download (currently open)
