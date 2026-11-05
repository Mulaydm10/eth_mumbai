// Prototype 0: one phone. Read the accelerometer, measure the delivered rate, compute PPV,
// detect impacts with STA/LTA and label each one "structural" or "handling". Nothing leaves the phone.
import { StaLta, VelocityTracker, defaultBand, dominantHz, lowFreqRatio, measuredRateHz, type Sample } from "@tw/core";

// ---- Generic Sensor API typing (not in TS's DOM lib) ----
interface GenericSensor extends EventTarget {
  x: number | null;
  y: number | null;
  z: number | null;
  timestamp: number | null;
  start(): void;
  stop(): void;
}
declare const LinearAccelerationSensor: { new (o?: { frequency?: number }): GenericSensor } | undefined;

// ---- Tunables (Prototype 0; tuned on real phones next) ----
const TRIGGER_RATIO = 4; // STA/LTA ratio to open an event
const MIN_PPV_MMS = 0.3; // ignore events weaker than this (noise floor)
const EVENT_MS = 1200; // window collected after a trigger
const REFRACTORY_MS = 1500; // no new event this soon after the last
const HANDLING_LOWF = 0.5; // >50% energy below 3 Hz = phone handled / swayed, not floor vibration
const HANDLING_PPV = 40; // > 40 mm/s on a floor is implausible for building vibration; likely the phone moved

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const ui = {
  start: $<HTMLButtonElement>("start"),
  status: $("status"),
  api: $("api"),
  rate: $("rate"),
  vel: $("vel"),
  ppv: $("ppv"),
  fdom: $("fdom"),
  ratio: $("ratio"),
  plot: $<HTMLCanvasElement>("plot"),
  events: $("events"),
  clear: $<HTMLButtonElement>("clear"),
  exportBtn: $<HTMLButtonElement>("export"),
};

interface DetectedEvent {
  t: number;
  ppv: number;
  fDom: number;
  lowF: number;
  label: "structural" | "handling";
}

let running = false;
let stopFn: (() => void) | null = null;
let wakeLock: { release(): Promise<void> } | null = null;

const raw: Sample[] = []; // full session (for CSV)
const stamps: number[] = []; // recent timestamps for rate
const plotBuf: { t: number; a: number }[] = [];
const velBuf: { t: number; v: number }[] = [];
const events: DetectedEvent[] = [];

let tracker: VelocityTracker | null = null;
let trig: StaLta | null = null;
let fs = 0;
let open: { t0: number; peak: number; axis: number[][] } | null = null;
let lastEventT = -Infinity;

function setStatus(msg: string, err = false) {
  ui.status.textContent = msg;
  ui.status.classList.toggle("err", err);
}

async function acquireWakeLock() {
  try {
    const wl = (navigator as unknown as { wakeLock?: { request(t: "screen"): Promise<{ release(): Promise<void> }> } }).wakeLock;
    if (wl) wakeLock = await wl.request("screen");
  } catch {
    /* not fatal: user keeps screen on manually */
  }
}
document.addEventListener("visibilitychange", () => {
  if (running && document.visibilityState === "visible") void acquireWakeLock();
  if (running && document.visibilityState === "hidden") setStatus("Paused: keep this screen on and the tab in front.", true);
});

function onSample(s: Sample) {
  raw.push(s);
  stamps.push(s.t);
  if (stamps.length > 240) stamps.shift();

  // Initialise filters once the real delivered rate is known (it varies by phone).
  if (!tracker) {
    if (stamps.length < 90) {
      setStatus(`Measuring sample rate… (${stamps.length}/90)`);
      return;
    }
    fs = measuredRateHz(stamps);
    if (fs < 10) {
      setStatus(`Sensor too slow (${fs.toFixed(1)} Hz). This phone may not support it.`, true);
      return;
    }
    tracker = new VelocityTracker(defaultBand(fs));
    trig = new StaLta(0.15, 5, fs);
    setStatus("Running. Warming up for ~3 s, then tap or stomp near the phone.");
  }

  const { accBand, velMmS } = tracker.push(s);
  const ratio = trig!.push(accBand);
  plotBuf.push({ t: s.t, a: accBand });
  velBuf.push({ t: s.t, v: velMmS });
  while (plotBuf.length && s.t - plotBuf[0]!.t > 10_000) plotBuf.shift();
  while (velBuf.length && s.t - velBuf[0]!.t > 2_000) velBuf.shift();

  // Event state machine
  if (!open && ratio > TRIGGER_RATIO && s.t - lastEventT > REFRACTORY_MS) {
    open = { t0: s.t, peak: 0, axis: [[], [], []] };
  }
  if (open) {
    open.peak = Math.max(open.peak, velMmS);
    open.axis[0]!.push(s.x);
    open.axis[1]!.push(s.y);
    open.axis[2]!.push(s.z);
    if (s.t - open.t0 >= EVENT_MS) closeEvent();
  }
  ui.ratio.textContent = ratio.toFixed(1);
}

function closeEvent() {
  const o = open!;
  open = null;
  if (o.peak < MIN_PPV_MMS) return;
  // Use the axis with the most energy for the frequency features (phone orientation unknown).
  const energy = o.axis.map((a) => a.reduce((acc, v) => acc + v * v, 0));
  const best = o.axis[energy.indexOf(Math.max(...energy))]!;
  const fDom = dominantHz(best, fs);
  const lowF = lowFreqRatio(best, fs);
  const label: DetectedEvent["label"] = lowF > HANDLING_LOWF || o.peak > HANDLING_PPV ? "handling" : "structural";
  const ev = { t: o.t0, ppv: o.peak, fDom, lowF, label };
  events.unshift(ev);
  lastEventT = o.t0;
  renderEvents();
  if (navigator.vibrate && label === "structural") navigator.vibrate(60);
}

function renderEvents() {
  ui.events.innerHTML = events
    .slice(0, 50)
    .map((e) => {
      const time = new Date(performance.timeOrigin + e.t).toLocaleTimeString();
      const cls = e.label === "structural" ? "struct" : "handling";
      return `<li>${time} · <b>${e.ppv.toFixed(2)} mm/s</b> · ${e.fDom.toFixed(1)} Hz · low-f ${(e.lowF * 100).toFixed(0)}%<span class="tag ${cls}">${e.label}</span></li>`;
    })
    .join("");
}

// ---- Rendering loop (decoupled from the sensor callback) ----
function draw() {
  if (running) {
    const r = measuredRateHz(stamps);
    ui.rate.textContent = r ? `${r.toFixed(1)} Hz` : "–";
    const v = velBuf.at(-1)?.v ?? 0;
    ui.vel.textContent = `${v.toFixed(2)} mm/s`;
    ui.ppv.textContent = `${Math.max(0, ...velBuf.map((p) => p.v)).toFixed(2)} mm/s`;
    if (plotBuf.length > 8 && fs) ui.fdom.textContent = `${dominantHz(raw.slice(-Math.round(fs)).map((p) => p.z), fs).toFixed(1)} Hz`;
    plot();
  }
  requestAnimationFrame(draw);
}

function plot() {
  const c = ui.plot;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth * dpr;
  const h = c.clientHeight * dpr;
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, w, h);
  if (plotBuf.length < 2) return;
  const tEnd = plotBuf.at(-1)!.t;
  const max = Math.max(0.05, ...plotBuf.map((p) => p.a));
  g.strokeStyle = "#f2a541";
  g.lineWidth = 1.5 * dpr;
  g.beginPath();
  plotBuf.forEach((p, i) => {
    const x = w - ((tEnd - p.t) / 10_000) * w;
    const y = h - (p.a / max) * (h - 8) - 4;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  });
  g.stroke();
  g.fillStyle = "#8b93a3";
  g.font = `${11 * dpr}px system-ui`;
  g.fillText(`max ${max.toFixed(3)} m/s²`, 6 * dpr, 14 * dpr);
}

// ---- Sensor start/stop ----
async function startGeneric(): Promise<boolean> {
  if (typeof LinearAccelerationSensor === "undefined") return false;
  try {
    const perm = await navigator.permissions.query({ name: "accelerometer" as PermissionName });
    if (perm.state === "denied") return false;
  } catch {
    /* permissions API may not know "accelerometer"; try anyway */
  }
  return new Promise((resolve) => {
    try {
      const sensor = new LinearAccelerationSensor({ frequency: 60 });
      let ok = false;
      sensor.addEventListener("reading", () => {
        if (!ok) {
          ok = true;
          resolve(true);
        }
        onSample({ t: sensor.timestamp ?? performance.now(), x: sensor.x ?? 0, y: sensor.y ?? 0, z: sensor.z ?? 0 });
      });
      sensor.addEventListener("error", () => resolve(false));
      sensor.start();
      stopFn = () => sensor.stop();
      ui.api.textContent = "Generic Sensor";
      setTimeout(() => resolve(ok), 1500);
    } catch {
      resolve(false);
    }
  });
}

async function startDeviceMotion(): Promise<boolean> {
  const DME = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
  if (!DME) return false;
  if (DME.requestPermission) {
    const r = await DME.requestPermission();
    if (r !== "granted") return false;
  }
  const h = (e: DeviceMotionEvent) => {
    const a = e.acceleration;
    if (!a) return;
    onSample({ t: e.timeStamp, x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 });
  };
  window.addEventListener("devicemotion", h);
  stopFn = () => window.removeEventListener("devicemotion", h);
  ui.api.textContent = "DeviceMotion";
  return true;
}

ui.start.addEventListener("click", async () => {
  if (running) {
    stopFn?.();
    stopFn = null;
    running = false;
    await wakeLock?.release().catch(() => {});
    ui.start.textContent = "Start sensor";
    ui.start.classList.remove("running");
    setStatus(`Stopped. ${raw.length} samples, ${events.length} events recorded.`);
    return;
  }
  if (!window.isSecureContext) {
    setStatus("Motion sensors need HTTPS. Open the https:// link.", true);
    return;
  }
  tracker = null;
  trig = null;
  stamps.length = 0;
  setStatus("Starting sensor…");
  const ok = (await startGeneric()) || (await startDeviceMotion());
  if (!ok) {
    setStatus("No motion sensor available or permission denied.", true);
    return;
  }
  running = true;
  ui.start.textContent = "Stop";
  ui.start.classList.add("running");
  await acquireWakeLock();
});

ui.clear.addEventListener("click", () => {
  events.length = 0;
  renderEvents();
});

ui.exportBtn.addEventListener("click", () => {
  const lines = ["t_ms,x,y,z"];
  for (const s of raw) lines.push(`${s.t.toFixed(2)},${s.x},${s.y},${s.z}`);
  lines.push("", "event_t_ms,ppv_mm_s,f_dom_hz,low_f_ratio,label");
  for (const e of [...events].reverse()) lines.push(`${e.t.toFixed(2)},${e.ppv.toFixed(3)},${e.fDom.toFixed(2)},${e.lowF.toFixed(3)},${e.label}`);
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tremor-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
  a.click();
});

requestAnimationFrame(draw);
