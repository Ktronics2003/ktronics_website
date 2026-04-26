// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ktronics.com.au',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false, // we own base styles in src/styles/global.css
    }),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Exclude draft blog posts (kept in source so the slug doesn't 404 on
      // any inbound links, but they shouldn't be indexed). The 4 stub posts
      // also carry <meta name="robots" content="noindex"> at page level.
      filter: (page) => {
        const draftSlugs = [
          'access-control-vs-cctv-which-first',
          'choosing-a-sydney-security-installer',
          'nsw-security-compliance-2026',
          'signs-your-security-system-needs-upgrading',
        ];
        return !draftSlugs.some((slug) => page.includes(`/resources/blog/${slug}/`));
      },
    }),
  ],
  image: {
    // Astro auto-includes sharp; no extra config needed for defaults.
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
