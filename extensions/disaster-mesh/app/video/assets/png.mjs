// Renders an HTML file to a 1920x1080 PNG with the demo-video skill's playwright-core (set DEMO_SKILL to its folder).
import { homedir } from "node:os";
const skill = process.env.DEMO_SKILL || homedir() + "/.claude/skills/demo-video";
const { chromium } = await import(skill + "/node_modules/playwright-core/index.mjs");
const [, , html, png] = process.argv;
const b = await chromium.launch({ executablePath: process.env.DEMO_CHROME || undefined });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("file://" + html); await p.screenshot({ path: png }); await b.close();
