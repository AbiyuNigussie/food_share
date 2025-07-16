import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: process.env.VITE_BASE_PATH || "/food_share",

  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BASE_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
