import { chromium } from "/Users/mulaydm10/.claude/skills/demo-video/node_modules/playwright-core/index.mjs";
const b = await chromium.launch({ executablePath: process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1252/chrome-headless-shell-mac-arm64/chrome-headless-shell" });
const P = [
  ["n1", "https://www.asianage.com/metros/mumbai/071017/vibrations-less-than-14th-of-permissible-limit-mmrc.html"],
  ["n2", "https://www.freepressjournal.in/amp/mumbai/mumbai-news-heritage-wall-near-gateway-of-india-develops-cracks-after-colaba-jetty-drilling-residents-demand-structural-audit-and-vibration-monitoring"],
  ["n3", "https://www.mumbailive.com/en/infrastructure/supreme-court-asks-mmrc-to-present-report-on-south-mumbai-station-after-two-mahim-buildings-tilt-42146"],
];
for (const [n, u] of P) {
  const p = await b.newPage({ viewport: { width: 1100, height: 1400 }, deviceScaleFactor: 2, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36" });
  try {
    await p.goto(u, { waitUntil: "domcontentloaded", timeout: 45000 }); await p.waitForTimeout(4000);
    await p.evaluate(() => document.querySelectorAll("iframe, [id*=ad], [class*=ad-], [class*=popup], [class*=consent], [class*=sticky], header nav").forEach((e) => { try { e.remove(); } catch {} }));
    const h = p.locator("h1").first(); await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    const bb = await h.boundingBox(); const txt = (await h.innerText()).trim();
    await p.screenshot({ path: `${n}.png`, clip: { x: Math.max(0, bb.x - 24), y: Math.max(0, bb.y - 24), width: Math.min(1100 - Math.max(0, bb.x - 24), bb.width + 48), height: Math.min(560, bb.height + 200) } });
    await p.screenshot({ path: `${n}-page.png` });
    console.log(n, "OK", JSON.stringify(txt).slice(0, 160));
  } catch (e) { console.log(n, "FAIL", e.message.slice(0, 120)); }
  await p.close();
}
await b.close();
