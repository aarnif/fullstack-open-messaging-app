import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import config from "../backend/config.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_APOLLO_URI": JSON.stringify(config.VITE_APOLLO_URI),
    "import.meta.env.VITE_APOLLO_WS_URI": JSON.stringify(
      config.VITE_APOLLO_WS_URI
    ),
    "import.meta.env.VITE_IMGBB_API_KEY": JSON.stringify(
      config.VITE_IMGBB_API_KEY
    ),
  },
  base: "/",
  root: "frontend",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js",
  },
});
