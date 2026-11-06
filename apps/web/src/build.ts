// Shows the build label in each page's footer (set at build time by vite.config.ts).
declare const __BUILD__: string;
export function showBuild() {
  const el = document.createElement("p");
  el.className = "status small";
  el.style.textAlign = "center";
  el.textContent = `build ${typeof __BUILD__ === "string" ? __BUILD__ : "dev"} · if a phone shows a different build than the dashboard, reload it`;
  document.querySelector("main")?.appendChild(el);
}
