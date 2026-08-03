import type { Config } from "tailwindcss";

// Visual language ported from the Fit Factory dashboard family
// (fit-factory-dashboard / fit-factory-front-desk-dashboard) — same
// near-black background, card, and border colors — so this app reads as
// part of the same product family. Separate token definition, nothing
// imported across repos.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b0f14",
          panel: "#121820",
          card: "#161d27",
          cardHover: "#1a2230",
          border: "#232c38",
        },
        status: {
          green: "#22c55e",
          amber: "#f59e0b",
          red: "#ef4444",
          neutral: "#64748b",
          blue: "#38bdf8",
        },
        brand: {
          amber: "#f59e0b",
        },
        team: {
          frontdesk: "#38bdf8",
          leads: "#f59e0b",
          coaches: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
