import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        soft: "var(--soft)",
        canvas: "var(--canvas)",
        elevated: "var(--elevated)",
        panel: "var(--panel)",
        "on-accent": "var(--on-accent)",
        glass: "var(--glass)",
        "glass-strong": "var(--glass-strong)",
        "glass-lift": "var(--glass-lift)",
        "glass-hover": "var(--glass-hover)",
        watermark: "var(--watermark)",
        dot: "var(--dot)",
        "dot-strong": "var(--dot-strong)"
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
