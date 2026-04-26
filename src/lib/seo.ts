/**
 * Per-page SEO metadata helper.
 * Pass a partial SEO object into BaseLayout. Defaults applied here.
 */

import { site } from './site';

export interface PageSEO {
  /** Window title — appears verbatim in <title>. Don't append " | Ktronics" yourself. */
  title: string;
  /** Meta description — 150-160 chars recommended. */
  description: string;
  /** Path of the current page, e.g. '/solutions/access-control/'. Used to build canonical + og:url. */
  path: string;
  /** OG image path. Defaults to site.defaultOgImage. */
  ogImage?: string;
  /** Override the og:type. Default is 'website'; use 'article' for blog posts. */
  ogType?: 'website' | 'article';
  /** Tell crawlers not to index this page. Default false. */
  noindex?: boolean;
}

export interface ResolvedSEO {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: string;
  twitterImage: string;
  robots: string;
  themeColor: string;
}

export function resolveSEO(seo: PageSEO): ResolvedSEO {
  const path = seo.path.startsWith('/') ? seo.path : `/${seo.path}`;
  const canonical = `${site.url}${path}`;
  const ogImage = `${site.url}${seo.ogImage ?? site.defaultOgImage}`;

  // Append " | Ktronics" only if the title doesn't already contain the brand
  const title = seo.title.toLowerCase().includes('ktronics')
    ? seo.title
    : `${seo.title} | ${site.name}`;

  return {
    title,
    description: seo.description,
    canonical,
    ogTitle: title,
    ogDescription: seo.description,
    ogUrl: canonical,
    ogImage,
    ogType: seo.ogType ?? 'website',
    twitterImage: ogImage,
    robots: seo.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1',
    themeColor: '#1E1A1B',
  };
}
