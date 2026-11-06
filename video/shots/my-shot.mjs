// One shot = one script = one take. Copy to <project>/video/shots/<name>.mjs and edit the marked parts.
//   node shots/<name>.mjs            -> out/<name>.mp4 (1920x1080, constant 60 fps, browser toolbar on top)
//   FULL=1 node shots/<name>.mjs     -> no toolbar, page fills the frame
// Rules that make takes look real: real clicks (mouseKit), wait for the REAL result (a locator), never a fixed sleep
// for something the app does; glide the cursor to what the voice talks about and hold it there 2-4 s.
const SK = process.env.HOME + "/.claude/skills/demo-video/scripts/";
const { launch, startCapture, mouseKit, at, scrollTo, docY, assemble, sleep, VIEW, FULL } = await import(SK + "rec.mjs");
const { renderChrome, closeChrome } = await import(SK + "toolbar.mjs");

const name = "my-shot";                       // EDIT: take name -> out/<name>.mp4
const URL = "https://example.com";            // EDIT: page to record
const { browser, context, page } = await launch();
const tb = FULL ? [] : [{ t: Date.now() / 1000 - 1, png: await renderChrome(name, { title: "My App", url: URL, favicon: "m" }) }];
await page.goto(URL, { waitUntil: "load" });
await page.locator("body").waitFor();         // EDIT: wait for the element that means "page is ready"
await sleep(1200);                            // let fonts/animations settle BEFORE recording starts
const cap = await startCapture(context, page, name);
const m = mouseKit(page);
const T0 = Date.now() / 1000;
let note = "ok";
try {
  await m.set(VIEW.width - 220, 420);
  await sleep(1500);                                              // opening hold: viewers need a beat
  // EDIT: the action. Examples:
  // let p = await at(page.getByRole("button", { name: "Buy" })); await m.glide(p.x, p.y, 900); await sleep(600); await m.click();
  // await page.getByText("Payment confirmed").waitFor({ timeout: 120000 }); cap.mark("confirmed");
  // await scrollTo(page, (await docY(page, page.locator("#results"))) - 160, 2000);
  await scrollTo(page, 600, 2200); await sleep(2500);
} catch (e) { note = "STOP: " + e.message.slice(0, 160); }       // a failed take still renders, so you can see where it broke
await cap.stop();
const T1 = Date.now() / 1000;
await browser.close();
console.log(JSON.stringify({ out: assemble({ name, frames: cap.frames, toolbar: tb, t0: T0, t1: T1 }), marks: cap.marks.map((k) => ({ ...k, s: +(k.t - T0).toFixed(2) })), note }));
await closeChrome();
