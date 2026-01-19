import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter Tight Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primaryBlue: '#344f97',
        primaryBlueDark: '#324372',
        primaryBlueLight: '#7690d6',
        primaryBlueBackground: '#23262d',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        animatedgradient: {
          to: { backgroundPosition: '150% 50%'},
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: 'animatedgradient 6s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}