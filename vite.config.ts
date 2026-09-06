import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project is served from https://hubert9917.github.io/faso-market/
export default defineConfig({
  base: "/faso-market/",
  plugins: [react()],
});
