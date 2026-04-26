/**
 * JSON-LD schema generators.
 * Each function returns a plain object that is JSON.stringified into a
 * <script type="application/ld+json"> tag in the page <head>.
 *
 * Validate at https://validator.schema.org/ before launch (see 05-seo-requirements.md).
 */

import { site } from './site';

const ORG_ID = `${site.url}/#organization`;
const LOCAL_ID = `${site.url}/#localbusiness`;

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: site.address.streetAddress,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
});

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.legalName,
    alternateName: site.alternateName,
    url: site.url,
    logo: `${site.url}/images/og/ktronics-logo.png`,
    telephone: site.contact.phoneTel,
    email: site.contact.email,
    foundingDate: site.founded,
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.linkedin,
      site.social.youtube,
    ],
    address: postalAddress(),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': LOCAL_ID,
    name: site.legalName,
    image: `${site.url}${site.defaultOgImage}`,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    telephone: site.contact.phoneTel,
    email: site.contact.email,
    url: site.url,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...site.hours.days],
        opens: site.hours.open,
        closes: site.hours.close,
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Sydney' },
      { '@type': 'AdministrativeArea', name: 'New South Wales' },
    ],
    priceRange: '$$',
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string; // omit on the final/current crumb
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
      };
      if (item.url) entry.item = item.url;
      return entry;
    }),
  };
}

export interface ServiceSchemaInput {
  serviceType: string;
  description: string;
  url: string;
}

export function serviceSchema({ serviceType, description, url }: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    description,
    url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: 'Sydney' },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}
