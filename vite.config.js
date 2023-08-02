import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
require("dotenv").config({ path: __dirname + ".env" });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "frontend",
  server: {
    proxy: {
      "/api/v1": "http://localhost:3001",
    },
  },
});
