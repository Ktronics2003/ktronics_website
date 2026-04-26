/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ktx: {
          red: '#E51838',
          'red-hover': '#C8142F',
          'red-tint': '#FFE9ED',
          ink: '#1E1A1B',
          'ink-soft': '#3A3537',
          paper: '#FAFAF7',
          'paper-2': '#F2F1ED',
          line: '#D9D7D2',
          mute: '#8A8682',
          black: '#0A0908',
        },
      },
      fontFamily: {
        // Mirrors the CSS vars in src/styles/global.css (--font-*).
        // Change in BOTH places when swapping the type system.
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1280px',
        prose: '65ch',
      },
      spacing: {
        gutter: 'clamp(24px, 5vw, 96px)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        'mono-eyebrow': '0.12em',
      },
      fontSize: {
        // Keep semantic sizes available — most type uses CSS vars in global.css
        eyebrow: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      transitionTimingFunction: {
        'industrial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
