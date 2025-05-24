/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      "node_modules",
      "e2e",
      "e2e-results",
      "src/lib/hooks/**",
      "src/components/comments/tests/**",
    ],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
