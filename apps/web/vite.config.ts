import { defineConfig } from "vite";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
// Build label shown in the footer, so a phone can be checked against the dashboard ("reload if they differ").
const BUILD = `${(() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch { return "dev"; } })()} · ${new Date().toISOString().slice(5, 16).replace("T", " ")}Z`;
export default defineConfig({
  define: { __BUILD__: JSON.stringify(BUILD) },
  server: { host: true },
  build: {
    target: "es2022",
    rollupOptions: { input: { main: resolve(__dirname, "index.html"), dashboard: resolve(__dirname, "dashboard.html"), report: resolve(__dirname, "report.html") } },
  },
});
