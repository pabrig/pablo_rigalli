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
        ink: "#ddd9ef",
        muted: "#6e6c7e",
        line: "rgba(221, 217, 239, 0.065)",
        accent: "#5a43ef",
        soft: "#8f87b8",
        canvas: "#020208",
        elevated: "#060510",
        panel: "#04030c"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
