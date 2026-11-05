// One self-contained HTML file of the dashboard (CROPS: download it, open it anywhere, it reads Arkiv directly;
// no server of ours, no domain of ours). Output: dist-single/tremor-witness-viewer.html
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: { target: "es2022", outDir: "dist-single", emptyOutDir: true, rollupOptions: { input: resolve(__dirname, "dashboard.html") } },
});
