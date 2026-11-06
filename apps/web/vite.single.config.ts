// One self-contained HTML file of the dashboard (CROPS: download it, open it anywhere, it reads Arkiv directly;
// no server of ours, no domain of ours). Output: dist-single/tremor-witness-viewer.html
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
const BUILD = `${(() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch { return "dev"; } })()} · offline viewer`;
export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  base: "./",
  plugins: [viteSingleFile()],
  build: { target: "es2022", outDir: "dist-single", emptyOutDir: true, rollupOptions: { input: resolve(__dirname, "dashboard.html") } },
});
