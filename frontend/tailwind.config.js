/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        mobile: "0.95rem",
      },
    },
  },
  plugins: [],
};
