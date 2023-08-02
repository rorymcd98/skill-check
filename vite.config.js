import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

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
