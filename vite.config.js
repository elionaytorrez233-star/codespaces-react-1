import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    globals: true,
    environment: 'jsdom',
  base: '/codespaces-react-1/' //

