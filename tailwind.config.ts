import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        paper: "#f7f3ed",
        clay: "#b94d30",
        moss: "#586b4f",
        gold: "#d7aa45"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(20, 20, 20, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
