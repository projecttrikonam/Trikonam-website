import type { Config } from 'tailwindcss';

// Design tokens from the handoff document (Section 4). These are the SINGLE source
// of truth for colour and type — never hardcode hex values or font stacks inside
// components. The CSS custom properties themselves are declared in globals.css so
// they are available to raw CSS too; here we map them into Tailwind's theme.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Tokens are RGB channel triplets in globals.css, wrapped here so Tailwind's
        // opacity modifiers work everywhere (e.g. text-moss/20, ring-gold/15).
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        'bg-alt': 'rgb(var(--color-bg-alt) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        moss: {
          DEFAULT: 'rgb(var(--color-accent-moss) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-moss-dark) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--color-accent-gold) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-gold-dark) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        focus: 'rgb(var(--color-focus-ring) / <alpha-value>)',
      },
      fontFamily: {
        // Fraunces = display serif; Karla = body/UI sans. Both loaded via
        // next/font/google in layout.tsx, which sets these CSS variables.
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-karla)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale (Section 4.3). Each token carries a sensible line-height /
        // tracking default; responsive sizing is handled with clamp() in globals.css
        // utility classes rather than duplicating breakpoints here.
        'display': ['clamp(2.25rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'h1': ['clamp(1.875rem, 3.5vw, 2.75rem)', { lineHeight: '1.1' }],
        'h2': ['clamp(1.625rem, 2.6vw, 2rem)', { lineHeight: '1.2' }],
        'h3': ['clamp(1.1875rem, 1.6vw, 1.375rem)', { lineHeight: '1.3' }],
        'body-lg': ['clamp(1.0625rem, 1.2vw, 1.125rem)', { lineHeight: '1.7' }],
        'body': ['clamp(0.9375rem, 1vw, 1rem)', { lineHeight: '1.7' }],
        'label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        prose: '65ch',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        'soft-lift': 'var(--shadow-lift)',
        float: 'var(--shadow-float)',
      },
      borderRadius: {
        card: '6px',
      },
      spacing: {
        section: '96px',
        'section-sm': '56px',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
