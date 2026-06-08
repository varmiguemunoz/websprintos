/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        /* ── Surfaces ─────────────────────────────────── */
        background:        '#0e0e10',
        surface:           '#131315',
        'surface-low':     '#1b1b1d',
        'surface-container': '#19191c',
        'surface-high':    '#2a2a2c',
        'surface-bright':  '#2c2c2f',
        'surface-muted':   '#353437',

        /* ── Text ─────────────────────────────────────── */
        'on-surface':        '#e5e1e4',
        'on-surface-variant':'#cac4d3',
        'on-surface-muted':  '#948e9c',

        /* ── Borders ──────────────────────────────────── */
        outline:       '#494551',
        'outline-ghost': 'rgba(255,255,255,0.07)',

        /* ── Primary (Nebula Purple) ──────────────────── */
        primary:           '#b79fff',
        'primary-dim':     '#cebdff',
        'primary-container':'#ab8ffe',
        'on-primary':      '#371d77',

        /* ── Secondary (Emerald) ──────────────────────── */
        secondary:         '#4edea2',
        'secondary-dim':   '#6ffbbd',
        emerald:           '#69f6b8',
        'on-secondary':    '#003824',

        /* ── Semantic ─────────────────────────────────── */
        error:   '#ffb4ab',
        warning: '#ffbd2e',
      },

      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'display-2xl': ['72px', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl':  ['60px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg':  ['48px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md':  ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':     ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm':     ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg':    ['14px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-md':    ['13px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm':    ['11px', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '600' }],
        'mono-md':     ['13px', { lineHeight: '1.6', fontWeight: '400' }],
        'mono-sm':     ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },

      borderRadius: {
        sm:   '0.25rem',
        md:   '0.375rem',
        DEFAULT: '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      boxShadow: {
        sm:       '0 1px 3px rgba(0,0,0,0.4)',
        md:       '0 4px 16px rgba(0,0,0,0.5)',
        lg:       '0 20px 40px rgba(0,0,0,0.6)',
        nebula:   '0 20px 60px rgba(183,159,255,0.12)',
        glow:     '0 0 32px rgba(183,159,255,0.08)',
        terminal: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        'nebula-btn': '0 16px 40px rgba(183,159,255,0.25)',
      },

      backgroundImage: {
        'nebula-gradient':   'linear-gradient(135deg, #b79fff 0%, #ab8ffe 100%)',
        'emerald-gradient':  'linear-gradient(135deg, #4edea2 0%, #69f6b8 100%)',
        'glow-top':          'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(183,159,255,0.15) 0%, transparent 70%)',
        'glow-center':       'radial-gradient(circle at 50% 50%, rgba(183,159,255,0.08) 0%, transparent 60%)',
        'surface-gradient':  'linear-gradient(180deg, #0e0e10 0%, #131315 100%)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.3' },
        },
        'slide-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'pulse-dot':      'pulse-dot 2s ease-in-out infinite',
        'slide-in-up':    'slide-in-up 0.5s cubic-bezier(0,0,0.2,1) forwards',
        float:            'float 4s ease-in-out infinite',
      },

      transitionTimingFunction: {
        'ease-out-quad': 'cubic-bezier(0.4,0,0.2,1)',
      },

      zIndex: {
        navbar:  '100',
        overlay: '200',
        modal:   '300',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
};
