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
          50: "#FEFDFB",
          100: "#FDF9F3",
          200: "#FAF0E4",
          300: "#F5E6D3",
          400: "#EDD5B8",
          500: "#E2C49E",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E6EDE6",
          200: "#CADACA",
          300: "#A8C1A8",
          400: "#7FA67F",
          500: "#5E8A5E",
          600: "#4A6F4A",
          700: "#3A5A3A",
          800: "#2E472E",
          900: "#243824",
        },
        rose: {
          50: "#FDF5F5",
          100: "#FAE8E8",
          200: "#F5CCCC",
          300: "#EDA8A8",
          400: "#E07C7C",
          500: "#C96B6B",
          600: "#A85555",
          700: "#884444",
          800: "#6B3636",
          900: "#562C2C",
        },
        amber: {
          50: "#FFF9F0",
          100: "#FFF0D9",
          200: "#FFDFA8",
          300: "#FFCB6B",
          400: "#FFB733",
          500: "#E89E1A",
          600: "#C28212",
          700: "#9A670E",
          800: "#7A520B",
          900: "#634209",
        },
        bark: {
          50: "#F7F5F3",
          100: "#EDE8E3",
          200: "#DDD5CC",
          300: "#C5B8AA",
          400: "#A89888",
          500: "#8D7B6A",
          600: "#746454",
          700: "#5D5044",
          800: "#4A4037",
          900: "#3D352E",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
