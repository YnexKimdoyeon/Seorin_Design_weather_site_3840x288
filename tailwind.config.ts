import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        good1: "url('/images/backgrounds/b-good1.png')",
        good2: "url('/images/backgrounds/b-good2.png')",
        rain: "url('/images/backgrounds/b-rain.png')",
        snow: "url('/images/backgrounds/b-snow.png')",
        snowandrain: "url('/images/backgrounds/b-snowandrain.png')",
        temprain: "url('/images/backgrounds/b-temprain.png')",
        sad: "url('/images/backgrounds/b-sad.png')", // 흐림 추가
      },
    },
  },
  plugins: [],
} satisfies Config;
