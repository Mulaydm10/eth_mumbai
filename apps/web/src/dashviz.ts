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
  nowMs?: number; // time base (recorded sessions use the session end)
  rawT?: Map<string, number>; // reading id → raw phone timestamp (before sound-sync correction)
  sync?: { chirp?: number; refMs: number; corrections: [string, number][] } | null;
  recorded?: boolean;
}

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const hhmmss = (ms: number) => new Date(ms).toLocaleTimeString("en-IN", { hour12: false });
let nowBase: number | undefined;
const NOW = () => nowBase ?? Date.now();
const ago = (ms: number) => {
  const s = Math.max(0, Math.round((NOW() - ms) / 1000));
  return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)} min ago` : `${Math.floor(s / 3600)} h ago`;
};
// v5 palette: black and white; red only for what a quorum witnessed.
const C = { ok: "#e63946", bad: "#8a8a8a", idle: "#4a4a4a", line: "#2c2c2c", grid: "#171717", text: "#f5f5f3", muted: "#9a9a9a", accent: "#f5f5f3" };
const MONO = "'JetBrains Mono', ui-monospace, monospace";

let state: VizState | null = null;
let spanMs = 600_000;
let lastEventId: string | null | undefined; // undefined = first render (no flash)
let dots: { x: number; y: number; r: number; t: Trigger; res: string }[] = [];

export function renderViz(s: VizState) {
  state = s;
  nowBase = s.nowMs;
  renderHero(s);
  renderChips(s);
  drawTimeline();
  renderRefusals(s);
  renderSync(s);
  drawHeat();
}

export function setSpan(ms: number) {
  spanMs = ms;
  document.querySelectorAll<HTMLButtonElement>("button[data-span]").forEach((x) => x.classList.toggle("active", Number(x.dataset.span) === ms));
}

function resultOf(s: VizState) {
  const inEvent = new Set(s.res.events.flatMap((e) => e.members.map((m) => m.id)));
  const rejected = new Map(s.res.rejected.map((r) => [r.trigger.id, r.reason as string]));
  return (id: string) => (inEvent.has(id) ? "event" : rejected.has(id) ? `rejected: ${rejected.get(id)}` : "waiting");
}

function renderHero(s: VizState) {
  const pill = $("livePill");
  pill.classList.toggle("down", !s.ok);
  pill.lastChild!.textContent = s.recorded ? "recorded" : s.ok ? "live" : "offline";

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
  $("meterLabel").textContent = newest && NOW() - newest < 120_000 ? "Agreeing right now" : "Latest burst";
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
      const hot = last && NOW() - last < 120_000;
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
  const now = NOW();
  const t0 = spanMs ? Math.max(s.sinceMs, now - spanMs) : s.sinceMs;
  const W = cssW - LEFT - 12;
  const x = (t: number) => LEFT + ((t - t0) / (now - t0)) * W;
  const yOf = (l: string) => TOP + lanes.indexOf(l) * LANE + LANE / 2;

  // lanes
  g.font = `12px ${MONO}`;
  g.textBaseline = "middle";
  lanes.forEach((l, i) => {
    const y = TOP + i * LANE;
    if (i % 2 === 0) { g.fillStyle = "#0d0d0d"; g.fillRect(LEFT, y, W, LANE); }
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
    g.fillStyle = "rgba(230,57,70,0.14)";
    g.strokeStyle = "rgba(230,57,70,0.75)";
    g.fillRect(xa, TOP, xb - xa, lanes.length * LANE);
    g.strokeRect(xa + 0.5, TOP + 0.5, xb - xa - 1, lanes.length * LANE - 1);
    // connect the members
    g.beginPath();
    e.members.slice().sort((m, n) => yOf(m.sensor) - yOf(n.sensor)).forEach((m, i) => (i ? g.lineTo(x(m.tMs), yOf(m.sensor)) : g.moveTo(x(m.tMs), yOf(m.sensor))));
    g.stroke();
    g.fillStyle = C.ok;
    g.font = `bold 11px ${MONO}`;
    g.fillText(`${e.sensors.length}/${s.k}`, xa + 2, TOP + 9);
    g.font = `12px ${MONO}`;
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
  window.addEventListener("resize", () => { drawTimeline(); drawHeat(); });
  setInterval(drawTimeline, 1000); // slide "now"
  const loop = (ts: number) => { if (!document.hidden) drawReplay(ts / 1000); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

// ---------------------------------------------------------------- v5 panels (live data)

function fitCanvas(cv: HTMLCanvasElement, cssH: number) {
  const cssW = cv.clientWidth || 800, dpr = window.devicePixelRatio || 1;
  if (cv.width !== Math.round(cssW * dpr) || cv.height !== Math.round(cssH * dpr)) { cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr); cv.style.height = `${cssH}px`; }
  const g = cv.getContext("2d")!; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cssW, cssH);
  return { g, w: cssW, h: cssH };
}

const REASONS: [string, string][] = [["no-quorum", "a lone phone: nobody agreed in time"], ["handling", "tilted or hand sway, not the building"], ["not-registered", "no ENS name at that time (as-of rule)"]];
function renderRefusals(s: VizState) {
  const el = document.getElementById("refusals"); if (!el) return;
  const n = new Map<string, number>();
  for (const r of s.res.rejected) { const k = String(r.reason).startsWith("not-registered") ? "not-registered" : String(r.reason); n.set(k, (n.get(k) ?? 0) + 1); }
  const rows = [...REASONS, ...[...n.keys()].filter((k) => !REASONS.some(([r]) => r === k)).map((k) => [k, ""] as [string, string])];
  const max = Math.max(1, ...n.values()), total = s.res.rejected.length;
  el.innerHTML = `<div class="refuse-total"><b>${total}</b> refused · <span class="ok">${s.res.events.length} confirmed</span></div>` +
    rows.map(([k, d]) => { const v = n.get(k) ?? 0; return `<div class="rbar"><div class="rhead"><span class="mono">${esc(k)}</span><b class="mono">${v}</b></div><div class="rtrack"><i style="width:${(v / max) * 100}%"></i></div><span class="muted small">${esc(d)}</span></div>`; }).join("");
}

function renderSync(s: VizState) {
  const el = document.getElementById("syncPanel"); if (!el) return;
  const lab = document.getElementById("syncLabel");
  if (!s.sync || !s.sync.corrections.length) {
    if (lab) lab.textContent = "Clock alignment";
    el.innerHTML = '<p class="muted small">No sound-sync chirp in this window. Phone clocks are used, corrected by the internet reference when online.</p>';
    return;
  }
  if (lab) lab.textContent = `Sound sync${s.sync.chirp !== undefined ? ` · chirp #${s.sync.chirp}` : ""} · ${hhmmss(s.sync.refMs)}`;
  const max = Math.max(1, ...s.sync.corrections.map(([, v]) => Math.abs(v)));
  el.innerHTML = s.sync.corrections.map(([k, v]) => `<div class="srow"><span class="mono">${esc(k)}</span><span class="strack"><i style="${v === 0 ? "" : `${v > 0 ? "left:50%" : `right:50%`};width:${(Math.abs(v) / max) * 50}%`}"></i></span><b class="mono">${v === 0 ? "0 ms · reference" : `${v > 0 ? "−" : "+"}${Math.abs(Math.round(v)).toLocaleString("en-IN")} ms`}</b></div>`).join("") +
    '<p class="muted small">One 3-tone chirp aligns every phone\'s clock. No internet needed.</p>';
}

function drawHeat() {
  const s = state, cv = document.getElementById("heat") as HTMLCanvasElement | null; if (!s || !cv) return;
  const lanes = [...new Set([...s.phones.map((p) => p.label), ...s.triggers.map((t) => t.sensor)])];
  const ROW = 22, TOP = 6, AXIS = 22, LEFT = 130, H = TOP + Math.max(1, lanes.length) * ROW + AXIS;
  const { g, w } = fitCanvas(cv, H);
  const t0 = s.sinceMs, t1 = NOW(), span = Math.max(60_000, t1 - t0);
  const bucket = Math.max(60_000, Math.ceil(span / 60 / 60_000) * 60_000), cols = Math.ceil(span / bucket), cw = (w - LEFT - 8) / cols;
  const cnt = new Map<string, number>(); let max = 1;
  for (const t of s.triggers) { if (t.tMs < t0 || t.tMs > t1) continue; const k = `${t.sensor}|${Math.floor((t.tMs - t0) / bucket)}`; const v = (cnt.get(k) ?? 0) + 1; cnt.set(k, v); max = Math.max(max, v); }
  const evCells = new Set(s.res.events.flatMap((e) => e.members.map((m) => `${m.sensor}|${Math.floor((m.tMs - t0) / bucket)}`)));
  g.font = `12px ${MONO}`; g.textBaseline = "middle";
  lanes.forEach((l, i) => {
    const y = TOP + i * ROW; g.fillStyle = C.muted; g.fillText(l.length > 15 ? l.slice(0, 14) + "…" : l, 6, y + ROW / 2);
    for (let c = 0; c < cols; c++) {
      const v = cnt.get(`${l}|${c}`) ?? 0, x = LEFT + c * cw;
      g.fillStyle = v ? `rgba(245,245,243,${0.12 + 0.8 * (v / max)})` : "#121212"; g.fillRect(x + 1, y + 2, Math.max(1, cw - 2), ROW - 4);
      if (evCells.has(`${l}|${c}`)) { g.strokeStyle = C.ok; g.lineWidth = 2; g.strokeRect(x + 1, y + 2, Math.max(1, cw - 2), ROW - 4); }
    }
  });
  g.fillStyle = C.muted; g.textAlign = "center";
  const every = Math.max(1, Math.round(cols / 6));
  for (let c = 0; c <= cols; c += every) g.fillText(new Date(t0 + c * bucket).toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" }), LEFT + c * cw, H - AXIS / 2);
  g.textAlign = "left";
}

// Event replay: the latest confirmed event. Each member's raw phone time slides to its sound-sync-corrected time,
// then the quorum window locks around them (loops every 8 s).
function drawReplay(t: number) {
  const s = state, cv = document.getElementById("replay") as HTMLCanvasElement | null; if (!s || !cv) return;
  const ev = [...s.res.events].sort((a, b) => a.tMs - b.tMs).at(-1);
  const members = ev ? [...ev.members].sort((a, b) => a.sensor.localeCompare(b.sensor)) : [];
  const LANE = 58, TOP = 30, BOT = 30, LEFT = 150, H = TOP + Math.max(3, members.length) * LANE + BOT;
  const { g, w } = fitCanvas(cv, H);
  const note = document.getElementById("replayNote");
  g.font = `13px ${MONO}`; g.textBaseline = "middle";
  if (!ev) { g.fillStyle = C.muted; g.fillText("No confirmed event in this window yet. Stomp near the phones, or replay the recorded session.", 16, H / 2); if (note) note.textContent = ""; return; }
  const raw = (id: string, tc: number) => s.rawT?.get(id) ?? tc;
  const pts = members.flatMap((m) => [m.tMs, raw(m.id, m.tMs)]);
  const lo = Math.min(...pts), hi = Math.max(...pts), pad = Math.max(400, (hi - lo) * 0.12);
  const a = lo - pad, b = hi + pad, X = (ms: number) => LEFT + ((ms - a) / (b - a)) * (w - LEFT - 20);
  const lt = t % 8, slide = Math.min(1, Math.max(0, (lt - 1.6) / 1.6)), ease = 1 - Math.pow(1 - slide, 3), lock = Math.min(1, Math.max(0, (lt - 3.6) / 0.6));
  const moved = members.some((m) => Math.abs(raw(m.id, m.tMs) - m.tMs) > 1);
  if (note) note.innerHTML = `${hhmmss(ev.tMs)} · ${ev.sensors.length} of ${s.k} phones · ${moved ? "raw phone clocks → sound-sync corrected" : "phone clocks"}`;
  // the quorum window
  const ts = members.map((m) => m.tMs), wa = X(Math.min(...ts)) - 8, wb = X(Math.min(...ts) + s.windowMs);
  g.globalAlpha = lock; g.fillStyle = "rgba(230,57,70,0.12)"; g.fillRect(wa, TOP - 10, Math.max(16, wb - wa), members.length * LANE + 4);
  g.strokeStyle = C.ok; g.lineWidth = 1.5; g.strokeRect(wa + 0.5, TOP - 10, Math.max(16, wb - wa), members.length * LANE + 4);
  const lab = `✓ ${ev.sensors.length} phones within ${s.windowMs} ms`, lw = g.measureText(lab).width;
  g.fillStyle = C.ok; g.fillText(lab, Math.min(wa + 6, w - 16 - lw), 12); g.globalAlpha = 1;
  members.forEach((m, i) => {
    const y = TOP + i * LANE + LANE / 2, r0 = raw(m.id, m.tMs), x = X(r0 + (m.tMs - r0) * ease);
    g.strokeStyle = "#1f1f1f"; g.lineWidth = 1; g.beginPath(); g.moveTo(LEFT, y); g.lineTo(w - 16, y); g.stroke();
    g.fillStyle = lock > 0.5 ? C.ok : C.text; g.fillText(m.sensor.length > 16 ? m.sensor.slice(0, 15) + "…" : m.sensor, 10, y - 8);
    g.fillStyle = C.muted; g.fillText(`${m.ppvMmS.toFixed(1)} mm/s`, 10, y + 10);
    if (moved && Math.abs(r0 - m.tMs) > 1) { g.setLineDash([3, 4]); g.strokeStyle = "#4a4a4a"; g.beginPath(); g.moveTo(X(r0), y); g.lineTo(x, y); g.stroke(); g.setLineDash([]); g.fillStyle = "#4a4a4a"; g.beginPath(); g.arc(X(r0), y, 3, 0, 7); g.fill(); }
    // the blow: a decaying spike at the reading
    const amp = Math.min(LANE * 0.42, 6 + Math.sqrt(m.ppvMmS) * 1.6);
    g.strokeStyle = lock > 0.5 ? C.ok : C.text; g.lineWidth = 1.6; g.beginPath();
    for (let k = -6; k <= 60; k++) { const px = x + k * 1.6, d = k < 0 ? 0 : Math.exp(-k / 14) * Math.sin(k * 0.9 + t * 6); const py = y - d * amp; k === -6 ? g.moveTo(px, py) : g.lineTo(px, py); }
    g.stroke();
    g.fillStyle = lock > 0.5 ? C.ok : C.text; g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill();
  });
  g.fillStyle = C.muted; g.textAlign = "right"; g.fillText(lt < 1.6 ? "raw phone time" : lt < 3.6 ? "aligning clocks…" : "aligned · quorum checked", w - 16, H - 12); g.textAlign = "left";
}
