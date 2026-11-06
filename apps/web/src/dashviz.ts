// Dashboard visual layer: status hero + quorum meter, live timeline (phones × time), phone chips.
// Pure presentation: it only draws what dashboard.ts already computed (computeQuorum result, readings, ENS phones).
import type { Trigger, computeQuorum } from "@tw/core";

type QResult = ReturnType<typeof computeQuorum>;
export interface VizState {
  site: string;
  sinceMs: number;
  k: number;
  windowMs: number;
  triggers: Trigger[]; // clock-corrected
  res: QResult;
  phones: { label: string; mesh: boolean }[];
  sealed: (eventId: string) => "sealed" | "sealing" | "error" | "none";
  eventIdOf: (memberIds: string[]) => string;
  ok: boolean; // last Arkiv read succeeded
}

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const hhmmss = (ms: number) => new Date(ms).toLocaleTimeString("en-IN", { hour12: false });
const ago = (ms: number) => {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)} min ago` : `${Math.floor(s / 3600)} h ago`;
};
const C = { ok: "#4cc38a", bad: "#e5534b", idle: "#8b93a3", line: "#262a33", grid: "#1a1e26", text: "#e8eaee", muted: "#8b93a3", accent: "#f2a541" };

let state: VizState | null = null;
let spanMs = 600_000;
let lastEventId: string | null | undefined; // undefined = first render (no flash)
let dots: { x: number; y: number; r: number; t: Trigger; res: string }[] = [];

export function renderViz(s: VizState) {
  state = s;
  renderHero(s);
  renderChips(s);
  drawTimeline();
}

function resultOf(s: VizState) {
  const inEvent = new Set(s.res.events.flatMap((e) => e.members.map((m) => m.id)));
  const rejected = new Map(s.res.rejected.map((r) => [r.trigger.id, r.reason as string]));
  return (id: string) => (inEvent.has(id) ? "event" : rejected.has(id) ? `rejected: ${rejected.get(id)}` : "waiting");
}

function renderHero(s: VizState) {
  const pill = $("livePill");
  pill.classList.toggle("down", !s.ok);
  pill.lastChild!.textContent = s.ok ? "live" : "offline";

  const hero = $("hero");
  const ev = [...s.res.events].sort((a, b) => a.tMs - b.tMs).at(-1);
  if (ev) {
    const id = s.eventIdOf(ev.members.map((m) => m.id));
    const st = s.sealed(id);
    const seal = st === "sealed" ? '<span class="ok">sealed on Swarm ✓</span>' : st === "sealing" ? "sealing to Swarm…" : st === "error" ? '<span class="bad">seal failed</span>' : "not sealed yet";
    $("heroTitle").innerHTML = `<span class="ok">✓ Event confirmed</span> · ${ev.sensors.length} phones agreed`;
    $("heroSub").innerHTML = `${hhmmss(ev.tMs)} (${ago(ev.tMs)}) · PPV ${ev.ppvMinMmS.toFixed(2)}–${ev.ppvMaxMmS.toFixed(2)} mm/s · ${esc(ev.sensors.join(", "))} · ${seal} · ${s.res.events.length} in this window`;
    hero.classList.add("event");
    if (lastEventId !== undefined && lastEventId !== id) {
      hero.classList.remove("fresh");
      void hero.offsetWidth; // restart the animation
      hero.classList.add("fresh");
      setTimeout(() => hero.classList.remove("fresh"), 4000);
    }
    lastEventId = id;
  } else {
    $("heroTitle").innerHTML = s.triggers.length ? "Listening · no confirmed event" : "Quiet · no readings yet";
    $("heroSub").textContent = `An event needs ${s.k} registered phones to feel it within ${s.windowMs} ms. Single-phone shakes are refused.`;
    hero.classList.remove("event");
    if (lastEventId === undefined) lastEventId = null;
  }

  // Quorum meter: the newest burst (readings within windowMs of the newest reading).
  const newest = s.triggers.reduce((m, t) => Math.max(m, t.tMs), 0);
  const burst = newest ? s.triggers.filter((t) => t.tMs >= newest - s.windowMs) : [];
  const inBurst = new Set(burst.map((t) => t.sensor));
  const lanes = s.phones.length ? s.phones.map((p) => p.label) : [...new Set(s.triggers.map((t) => t.sensor))];
  const n = lanes.filter((l) => inBurst.has(l)).length;
  $("meter").innerHTML = lanes.map((l, i) => `<span class="pip ${inBurst.has(l) ? "on" : i < s.k && !n ? "need" : ""}" title="${esc(l)}">${esc(l.length > 10 ? l.slice(0, 9) + "…" : l)}</span>`).join("") || '<span class="muted small">no phones yet</span>';
  $("meterLabel").textContent = newest && Date.now() - newest < 120_000 ? "Agreeing right now" : "Latest burst";
  $("meterSub").innerHTML = newest
    ? `Newest burst ${hhmmss(newest)} (${ago(newest)}): <b class="${n >= s.k ? "ok" : ""}">${n} of ${s.k}</b> needed`
    : `${s.k} of ${lanes.length || "–"} phones must agree`;
}

function renderChips(s: VizState) {
  const lanes = s.phones.length ? s.phones : [...new Set(s.triggers.map((t) => t.sensor))].map((label) => ({ label, mesh: false }));
  $("chips").innerHTML = lanes
    .map((p) => {
      const mine = s.triggers.filter((t) => t.sensor === p.label);
      const last = mine.reduce((m, t) => Math.max(m, t.tMs), 0);
      const hot = last && Date.now() - last < 120_000;
      return `<span class="pchip ${hot ? "hot" : ""}"><i></i><b>${esc(p.label)}</b>${p.mesh ? ' <span class="tag">mesh</span>' : ""}<span class="muted">${mine.length} readings${last ? ` · last ${ago(last)}` : ""}</span></span>`;
    })
    .join("");
}

function drawTimeline() {
  const s = state;
  const cv = document.getElementById("timeline") as HTMLCanvasElement | null;
  if (!s || !cv) return;
  const lanes = [...new Set([...s.phones.map((p) => p.label), ...s.triggers.map((t) => t.sensor)])];
  const registered = new Set(s.phones.map((p) => p.label));
  const LANE = 34, TOP = 10, AXIS = 24, LEFT = Math.min(130, Math.max(80, 7 * Math.max(0, ...lanes.map((l) => l.length)) + 16));
  const cssW = cv.clientWidth || 800;
  const cssH = TOP + Math.max(1, lanes.length) * LANE + AXIS;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) {
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssH * dpr);
    cv.style.height = `${cssH}px`;
  }
  const g = cv.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, cssW, cssH);
  const now = Date.now();
  const t0 = spanMs ? Math.max(s.sinceMs, now - spanMs) : s.sinceMs;
  const W = cssW - LEFT - 12;
  const x = (t: number) => LEFT + ((t - t0) / (now - t0)) * W;
  const yOf = (l: string) => TOP + lanes.indexOf(l) * LANE + LANE / 2;

  // lanes
  g.font = "12px system-ui, sans-serif";
  g.textBaseline = "middle";
  lanes.forEach((l, i) => {
    const y = TOP + i * LANE;
    if (i % 2 === 0) { g.fillStyle = "#0e1116"; g.fillRect(LEFT, y, W, LANE); }
    g.fillStyle = registered.has(l) ? C.text : C.bad;
    g.fillText(l.length > 16 ? l.slice(0, 15) + "…" : l, 8, y + LANE / 2);
  });
  if (!lanes.length) { g.fillStyle = C.muted; g.fillText("No phones or readings yet", LEFT + 8, TOP + LANE / 2); }

  // time grid
  const span = now - t0;
  const step = [5e3, 10e3, 30e3, 60e3, 120e3, 300e3, 600e3, 1800e3, 3600e3].find((st) => span / st <= 8) ?? 3600e3;
  g.strokeStyle = C.grid;
  g.fillStyle = C.muted;
  g.textAlign = "center";
  for (let t = Math.ceil(t0 / step) * step; t <= now; t += step) {
    const X = x(t);
    g.beginPath(); g.moveTo(X, TOP); g.lineTo(X, cssH - AXIS); g.stroke();
    g.fillText(new Date(t).toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", ...(step < 60e3 ? { second: "2-digit" } : {}) }), X, cssH - AXIS / 2);
  }
  g.textAlign = "left";

  // quorum bands
  for (const e of s.res.events) {
    const ts = e.members.map((m) => m.tMs);
    const a = Math.min(...ts), b = Math.max(...ts);
    if (b < t0) continue;
    const xa = Math.max(LEFT, x(a) - 6), xb = Math.max(xa + 12, x(b) + 6);
    g.fillStyle = "rgba(76,195,138,0.16)";
    g.strokeStyle = "rgba(76,195,138,0.7)";
    g.fillRect(xa, TOP, xb - xa, lanes.length * LANE);
    g.strokeRect(xa + 0.5, TOP + 0.5, xb - xa - 1, lanes.length * LANE - 1);
    // connect the members
    g.beginPath();
    e.members.slice().sort((m, n) => yOf(m.sensor) - yOf(n.sensor)).forEach((m, i) => (i ? g.lineTo(x(m.tMs), yOf(m.sensor)) : g.moveTo(x(m.tMs), yOf(m.sensor))));
    g.stroke();
    g.fillStyle = C.ok;
    g.font = "bold 11px system-ui, sans-serif";
    g.fillText(`${e.sensors.length}/${s.k}`, xa + 2, TOP + 9);
    g.font = "12px system-ui, sans-serif";
  }

  // readings
  const res = resultOf(s);
  dots = [];
  for (const t of s.triggers) {
    if (t.tMs < t0) continue;
    const r = 3 + Math.min(7, Math.sqrt(Math.max(0, t.ppvMmS)) * 2.5);
    const st = res(t.id);
    const X = x(t.tMs), Y = yOf(t.sensor);
    g.beginPath();
    g.arc(X, Y, r, 0, Math.PI * 2);
    g.fillStyle = st === "event" ? C.ok : st.startsWith("rejected") ? C.bad : C.idle;
    g.globalAlpha = 0.9;
    g.fill();
    g.globalAlpha = 1;
    dots.push({ x: X, y: Y, r, t, res: st });
  }
  // "now" line
  g.strokeStyle = C.accent;
  g.setLineDash([3, 4]);
  g.beginPath(); g.moveTo(LEFT + W, TOP); g.lineTo(LEFT + W, cssH - AXIS); g.stroke();
  g.setLineDash([]);
}

export function initViz() {
  document.querySelectorAll<HTMLButtonElement>("button[data-span]").forEach((b) =>
    b.addEventListener("click", () => {
      spanMs = Number(b.dataset.span);
      document.querySelectorAll("button[data-span]").forEach((x) => x.classList.toggle("active", x === b));
      drawTimeline();
    }),
  );
  const cv = document.getElementById("timeline") as HTMLCanvasElement;
  const tip = $("tlTip");
  cv.addEventListener("mousemove", (ev) => {
    const r = cv.getBoundingClientRect();
    const mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const hit = dots.reduce<(typeof dots)[number] | null>((best, d) => {
      const dd = Math.hypot(d.x - mx, d.y - my);
      return dd <= d.r + 5 && (!best || dd < Math.hypot(best.x - mx, best.y - my)) ? d : best;
    }, null);
    if (!hit) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.innerHTML = `<b>${esc(hit.t.sensor)}</b> · ${hhmmss(hit.t.tMs)}<br>${hit.t.ppvMmS.toFixed(2)} mm/s · ${hit.t.fDomHz.toFixed(1)} Hz · ${esc(String(hit.t.label))}<br><span class="${hit.res === "event" ? "ok" : hit.res.startsWith("rejected") ? "bad" : "muted"}">${esc(hit.res === "event" ? "in a confirmed event" : hit.res)}</span>`;
    tip.style.left = `${Math.min(mx + 12, r.width - 200)}px`;
    tip.style.top = `${my + 12}px`;
  });
  cv.addEventListener("mouseleave", () => (tip.hidden = true));
  window.addEventListener("resize", drawTimeline);
  setInterval(drawTimeline, 1000); // slide "now"
}
