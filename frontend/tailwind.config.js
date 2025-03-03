/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        mobile: "0.95rem",
      },
      backgroundImage: {
        light: "url('/images/background-light.svg')",
        dark: "url('/images/background-dark.svg')",
      },
    },
  },
  plugins: [],
};
