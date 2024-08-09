import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/preline/dist/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        primary: {
          50: "#E5EAF5",
          100: "#BCC9E0",
          200: "#8A9BCC",
          300: "#6C7DB8",
          400: "#3C5DAC",
          500: "#004AAD",
          600: "#003D9B",
          700: "#00307F",
          800: "#002563",
          900: "#001A4C"
        }
      }
    }
  },
  plugins: [require("preline/plugin")]
};
export default config;
