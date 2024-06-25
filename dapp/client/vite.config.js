import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      cache: false,
      include: "src/**/*.js", // Include solo i file del frontend
      exclude: ["node_modules", "dist", "server/**"], // Esclude i file del backend
    }),
  ],
  build: {
    sourcemap: false,
  },
  server: {
    sourcemap: false,
  },
});
