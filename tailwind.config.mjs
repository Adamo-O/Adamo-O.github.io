import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        fg: "rgb(var(--c-fg) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          strong: "rgb(var(--c-accent-strong) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        badge: {
          review: "rgb(var(--c-badge-review) / <alpha-value>)",
          accepted: "rgb(var(--c-badge-accepted) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ['"PP Neue Montreal"', ...defaultTheme.fontFamily.sans],
        mono: ['"PP Supply Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2: ["var(--text-h2)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        pill: "var(--radius-pill)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        DEFAULT: "var(--dur)",
        slow: "var(--dur-slow)",
      },
      transitionTimingFunction: {
        DEFAULT: "var(--ease)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
