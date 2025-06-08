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
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0px)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
