/**
 * Single source of truth for company facts that appear in:
 * - meta tags
 * - footer
 * - JSON-LD schema
 * - llms.txt
 *
 * If something here is wrong, fix it once. Everything that uses
 * the site reads from this file.
 */

export const site = {
  name: 'Ktronics',
  legalName: 'Ktronics Pty Ltd',
  alternateName: 'Ktronics Electronic Security Solutions',
  tagline: 'Commercial Electronic Security Sydney',
  url: 'https://www.ktronics.com.au',
  defaultOgImage: '/images/og/og-default.jpg',
  founded: '2003',

  contact: {
    phone: '1300 621 060',
    phoneTel: '+61-1300-621-060',
    emergencyPhone: '1300 621 006',
    emergencyPhoneTel: '+61-1300-621-006',
    email: 'sales@ktronics.com.au',
    serviceEmail: 'service@ktronics.com.au',
  },

  address: {
    streetAddress: 'Unit 11, 84 Old Pittwater Road',
    locality: 'Brookvale',
    region: 'NSW',
    postalCode: '2100',
    country: 'AU',
    countryName: 'Australia',
    poBox: 'PO Box 147, Narrabeen NSW 2101',
  },

  // Pre-launch: confirm with Karl/Lesley. Currently aligned to footer copy
  // (Mon-Fri 8:00 - 15:30). See 06-content-inventory.md "Hours discrepancy".
  hours: {
    open: '07:00',
    close: '15:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const,
    display: 'Office hours: Mon–Fri 7am – 3:00pm',
    emergencyDisplay: '24/7 emergency for monitored clients',
  },

  geo: {
    latitude: -33.7635,
    longitude: 151.2697,
  },

  credentials: {
    nswMasterLicence: '102039',
    asial: 'ASIAL Gold Member',
    abn: null as string | null, // TBC — fill in before launch
  },

  social: {
    facebook: 'https://www.facebook.com/ktronics.com.au',
    instagram: 'https://instagram.com/ktronics.com.au',
    linkedin: 'https://www.linkedin.com/in/karl-lamb-ab33563',
    youtube: 'https://www.youtube.com/@Ktronics-Electronic-Security',
  },

  primaryNav: [
    { label: 'Solutions', href: '/solutions/' },
    { label: 'Industries', href: '/industries/' },
    { label: 'Work', href: '/case-studies/' },
    { label: 'About', href: '/about/' },
    { label: 'Resources', href: '/resources/' },
    { label: 'Contact', href: '/contact/' },
  ] as const,
} as const;

export type Site = typeof site;
