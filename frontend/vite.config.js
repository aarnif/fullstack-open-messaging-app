import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import config from "../backend/config.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      VITE_APOLLO_URI: config.VITE_APOLLO_URI,
      VITE_APOLLO_WS_URI: config.VITE_APOLLO_WS_URI,
      VITE_IMGBB_API_KEY: config.VITE_IMGBB_API_KEY,
    },
  },
  base: "/",
  root: "frontend",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js",
  },
});
