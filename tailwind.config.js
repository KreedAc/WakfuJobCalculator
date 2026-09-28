/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Semantic colors backed by the CSS variables in src/index.css
      // (dark by default, light under [data-theme="light"]).
      colors: {
        bg: token('bg'),
        bg2: token('bg2'),
        surface: token('surface'),
        surface2: token('surface2'),
        line: token('line'),
        'line-strong': token('line-strong'),
        fg: token('fg'),
        muted: token('muted'),
        subtle: token('subtle'),
        primary: { DEFAULT: token('primary'), strong: token('primary-strong') },
        'on-primary': token('on-primary'),
        accent: { DEFAULT: token('accent'), strong: token('accent-strong') },
        'on-accent': token('on-accent'),
        success: token('success'),
        warning: token('warning'),
        danger: token('danger'),
        rarity: {
          rare: token('rarity-rare'),
          mythic: token('rarity-mythic'),
          legendary: token('rarity-legendary'),
          relic: token('rarity-relic'),
          souvenir: token('rarity-souvenir'),
          epic: token('rarity-epic'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
    },
  },
  plugins: [],
};
