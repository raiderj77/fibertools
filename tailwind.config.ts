import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FDFCF9",
          100: "#FAF6F1",
          200: "#F5EDE3",
          300: "#EDE0D0",
          400: "#E0CEBC",
          500: "#CAAE94",
        },
        plum: {
          50:  "#F7F0F5",
          100: "#EDD9E8",
          200: "#D9B3CF",
          300: "#C48DB5",
          400: "#A8669A",
          500: "#7C5A6D",
          600: "#634858",
          700: "#4A3642",
          800: "#32242C",
          900: "#1A1216",
        },
        amber: {
          50:  "#FDF8F0",
          100: "#FAF0DC",
          200: "#F5DFB3",
          300: "#EEC87A",
          400: "#E5AB47",
          500: "#D4915E",
          600: "#B8723E",
          700: "#8F5429",
          800: "#663A18",
          900: "#3D200A",
        },
        sage: {
          50:  "#F2F7F2",
          100: "#E0EDE0",
          200: "#C0DAC0",
          300: "#8FAE8B",
          400: "#6B8F67",
          500: "#4D7149",
          600: "#3A5737",
          700: "#283D25",
          800: "#162314",
          900: "#0A1209",
        },
        bark: {
          50:  "#FAF7F4",
          100: "#F0E9E0",
          200: "#D9C9B8",
          300: "#BFA38A",
          400: "#9A7B5C",
          500: "#6B5A45",
          600: "#524434",
          700: "#3A3025",
          800: "#2D2A2E",
          900: "#1A1714",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)",    "Nunito",           "system-ui", "sans-serif"],
        display: ["var(--font-display)", "DM Serif Display", "Georgia",   "serif"],
        mono:    ["var(--font-mono)",    "JetBrains Mono",   "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
