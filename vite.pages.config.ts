import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/rental-electricity-receipts/",
  plugins: [react()],
  build: { outDir: "dist-pages", emptyOutDir: true },
});
