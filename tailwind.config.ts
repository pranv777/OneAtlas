import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#101C2B", soft: "#3B4A5E", mute: "#6B7A8E" },
        paper: { DEFAULT: "#EEF1F5", raised: "#FFFFFF", sunk: "#E4E9EF" },
        line: { DEFAULT: "#D3DAE3", strong: "#B3BECC" },
        cobalt: { DEFAULT: "#2447E8", dark: "#1A35B8", tint: "#E3E9FD" },
        good: "#13795B",
        warn: "#A5560B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "10px" },
    },
  },
  plugins: [],
};

export default config;
