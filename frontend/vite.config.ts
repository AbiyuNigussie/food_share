import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: process.env.VITE_BASE_PATH,

  server: {
    proxy: {
      "/api": {
        target: process.env.BASE_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
