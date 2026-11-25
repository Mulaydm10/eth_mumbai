// Website takes for the explainer (real 60 fps captures of the live site). Usage: FULL=1 node shots/site.mjs <take>
const SK = process.env.HOME + "/.claude/skills/demo-video/scripts/";
const { launch, startCapture, mouseKit, at, scrollTo, docY, assemble, sleep, VIEW } = await import(SK + "rec.mjs");
const take = process.argv[2];
const BASE = "https://tremor-witness.vercel.app";
const URLS = { A1: "/home.html", A2a: "/home.html", A2d: "/home.html", A2e: "/home.html", A3: "/dashboard.html?site=ethmumbai-demo&recorded=1", Z: "/home.html", P0: "/home.html" };
const { browser, context, page } = await launch();
await page.goto(BASE + URLS[take], { waitUntil: "networkidle" });
await sleep(2500);
const m = mouseKit(page);
const tab = async (re) => { const p = await at(page.getByRole("button", { name: re }).first()); await m.glide(p.x, p.y, 700); await sleep(250); await m.click(); };
const stage = async (title) => { const p = await at(page.getByText(title, { exact: true }).first()); await m.glide(p.x, p.y, 600); await sleep(200); await m.click(); };
// pre-roll navigation that should not be on camera
if (take === "A2a" || take === "A2e") { await page.getByRole("button", { name: /Solution/ }).first().click(); await sleep(800); if (take === "A2e") { await page.getByText("Sign to Arkiv", { exact: true }).first().click(); await sleep(400); } }
if (take === "A2d") { await page.getByRole("button", { name: /Problem/ }).first().click(); await sleep(800); const y = await docY(page, page.getByText("Same edit, two records.").first()); await page.evaluate((y) => scrollTo(0, y - 140), y); await sleep(1500); }
if (take === "P0") { await page.getByRole("button", { name: /Problem/ }).first().click(); await sleep(600); const y = await docY(page, page.getByText(/LIVE SIMULATION/).first()); await page.evaluate((y) => scrollTo(0, y - 60), y); await sleep(700); }
if (take === "A3") { await page.locator("#recBanner").waitFor({ state: "visible", timeout: 30000 }); await sleep(2500); }
const cap = await startCapture(context, page, take);
const T0 = Date.now() / 1000; let note = "ok";
try {
  await m.set(VIEW.width * 0.62, VIEW.height * 0.55);
  if (take === "A1") { await sleep(1800); const p = await at(page.getByRole("button", { name: /Crack the air/ }).first()); await m.glide(p.x, p.y, 1100); await sleep(400); await m.click(); await sleep(2600); await m.glide(VIEW.width * 0.7, VIEW.height * 0.45, 2500); await sleep(800); await m.click(); await sleep(2600); }
  if (take === "A2a") { await sleep(5400); await stage("Reject the hand"); await sleep(4600); }
  if (take === "A2d") { await sleep(11000); }
  if (take === "A2e") { await sleep(2600); for (const s of ["ENS as-of gate", "Quorum", "Seal to Swarm", "Kill the backend"]) { await stage(s); await sleep(2300); } await sleep(1200); }
  if (take === "A3") {
    await sleep(3000);
    await scrollTo(page, (await docY(page, page.locator("#replay"))) - 120, 1800); await sleep(5200);
    await scrollTo(page, (await docY(page, page.locator("#refusals"))) - 160, 1600); await sleep(4200);
    await scrollTo(page, (await docY(page, page.locator("#heat"))) - 300, 1400); await sleep(3600);
  }
  if (take === "Z") { await sleep(9000); }
  if (take === "P0") { await sleep(10500); }
} catch (e) { note = "STOP: " + e.message.slice(0, 160); }
await cap.stop(); const T1 = Date.now() / 1000; await browser.close();
console.log(JSON.stringify({ out: assemble({ name: take, frames: cap.frames, toolbar: [], t0: T0, t1: T1 }), note }));
