// Prototype 1 (web app, many phones): each phone detects impacts locally (PPV, STA/LTA, structural vs handling)
// and writes every detected event to Arkiv, signed by its own in-browser key. The dashboard reads Arkiv and
// computes the multi-phone quorum.
import { StaLta, VelocityTracker, defaultBand, dominantHz, lowFreqRatio, measuredRateHz, type Sample } from "@tw/core";
import { ensPublic, walletClientFor, writePhoneHead, writeSensor, writeSync, writeTrigger, SEPOLIA_RPC, type ArkivWallet, type TriggerInput } from "@tw/chain";
import { createWalletClient, http as viemHttp } from "viem";
import { sepolia } from "viem/chains";
import { listenForSync, playSyncSignal } from "./sound";
import { initLang, t } from "./i18n";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Hex } from "viem";

// ---- Identity, site and wallet (the key never leaves this phone) ----
const params = new URLSearchParams(location.search);
const ACCESS_KEY = (import.meta.env.VITE_ARKIV_ACCESS_KEY as string | undefined) ?? "";
const EXPLORER = "https://rabdi.explorer.arkiv.network";
function lsGet(k: string) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode: key lives for this tab only */
  }
}
let pk = lsGet("tw.key") as Hex | null;
if (!pk) {
  pk = generatePrivateKey();
  lsSet("tw.key", pk);
}
const account = privateKeyToAccount(pk);
const wallet: ArkivWallet = walletClientFor(pk, ACCESS_KEY);
const defaultName = `phone-${account.address.slice(2, 6).toLowerCase()}`;

// ---- Generic Sensor API typing (not in TS's DOM lib) ----
interface GenericSensor extends EventTarget {
  x: number | null;
  y: number | null;
  z: number | null;
  timestamp: number | null;
  start(): void;
  stop(): void;
}
declare const Accelerometer: { new (o?: { frequency?: number }): GenericSensor } | undefined; // raw, includes gravity

// ---- Tunables (Prototype 0; tuned on real phones next) ----
const TRIGGER_RATIO = 4; // STA/LTA ratio to open an event
const MIN_PPV_MMS = 0.3; // ignore events weaker than this (noise floor)
const EVENT_MS = 1200; // window collected after a trigger
const REFRACTORY_MS = 1500; // no new event this soon after the last
const HANDLING_LOWF = 0.5; // >50% energy below 3 Hz = phone handled / swayed, not floor vibration
const HANDLING_TILT_DEG = 15; // orientation changed by >15° (real test: stomps rattle up to ~10°, handling was 13°+) = phone picked up / flipped (a floor does not tilt a lying phone)
const HANDLING_ACC = 30; // >30 m/s² (~3 g) band-passed: dropped or shaken, not floor vibration

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
  site: $<HTMLInputElement>("site"),
  name: $<HTMLInputElement>("name"),
  chain: $("chain"),
  clock: $("clock"),
  outbox: $("outbox"),
  syncBtn: $<HTMLButtonElement>("syncBtn"),
  syncStatus: $("syncStatus"),
  dashLink: $<HTMLAnchorElement>("dashLink"),
};

ui.site.value = params.get("site") ?? lsGet("tw.site") ?? "demo";
ui.name.value = params.get("name") ?? lsGet("tw.name") ?? defaultName;
// ENS-safe labels: a-z 0-9 -, 3-32 chars (they become <phone>.<site>.tremorwitness.eth).
const ensSafe = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
const syncLinks = () => {
  ui.site.value = ensSafe(ui.site.value) || "demo";
  ui.name.value = ensSafe(ui.name.value) || defaultName;
  lsSet("tw.site", ui.site.value.trim());
  lsSet("tw.name", ui.name.value.trim());
  ui.dashLink.href = `/dashboard.html?site=${encodeURIComponent(ui.site.value.trim())}`;
};
ui.site.addEventListener("change", syncLinks);
ui.name.addEventListener("change", syncLinks);
syncLinks();
ui.chain.innerHTML = `Wallet: <a href="${EXPLORER}/address/${account.address}" target="_blank" rel="noopener">${account.address}</a>`;

interface DetectedEvent {
  t: number; // performance-clock ms
  wallMs: number;
  ppv: number;
  fDom: number;
  lowF: number;
  tilt: number;
  peakAcc: number;
  label: "structural" | "handling";
  write: "queued" | "sending" | "ok" | "error";
  note?: string;
}

// ---- Arkiv writes: one at a time, in order (avoids nonce races) ----
// ---- Outbox (store-and-forward): every Arkiv write is saved on the phone first and uploaded in order.
// With no signal (basement, outage) events keep accumulating offline and upload when the phone is back online.
type OutItem =
  | { id: string; kind: "sensor"; payload: Parameters<typeof writeSensor>[1]; tries: number }
  | { id: string; kind: "trigger"; payload: TriggerInput; tries: number }
  | { id: string; kind: "sync"; payload: Parameters<typeof writeSync>[1]; tries: number };
const outbox: OutItem[] = (() => {
  try {
    return JSON.parse(lsGet("tw.outbox") ?? "[]") as OutItem[];
  } catch {
    return [];
  }
})();
const saveOutbox = () => lsSet("tw.outbox", JSON.stringify(outbox));
const evById = new Map<string, DetectedEvent>();
let outSeq = 0;
function post(item: Omit<OutItem, "id" | "tries">, ev?: DetectedEvent) {
  const id = `${Date.now()}-${outSeq++}`;
  outbox.push({ ...item, id, tries: 0 } as OutItem);
  saveOutbox();
  if (ev) evById.set(id, ev);
  void flush();
}
let flushing = false;
async function flush() {
  if (flushing) return;
  flushing = true;
  try {
    while (outbox.length) {
      const it = outbox[0]!;
      const ev = evById.get(it.id);
      if (ev) (ev.write = "sending"), renderEvents();
      try {
        let key = "";
        if (it.kind === "sensor") await writeSensor(wallet, it.payload);
        else if (it.kind === "sync") await writeSync(wallet, it.payload);
        else key = String(((await writeTrigger(wallet, it.payload)) as { entityKey?: string }).entityKey ?? "");
        outbox.shift();
        saveOutbox();
        if (ev) (ev.write = "ok"), (ev.note = key);
      } catch (e) {
        it.tries++;
        // Offline or flaky network: keep it and retry later. A write that fails 6 times while online is dropped.
        if (navigator.onLine && it.tries >= 6) {
          outbox.shift();
          if (ev) (ev.write = "error"), (ev.note = shortErr(e));
        } else if (ev) (ev.write = "queued"), (ev.note = navigator.onLine ? shortErr(e) : "offline: will upload later");
        saveOutbox();
        break;
      } finally {
        renderEvents();
      }
    }
  } finally {
    flushing = false;
    ui.outbox.textContent = outbox.length ? `${outbox.length} waiting to upload${navigator.onLine ? "" : " (offline: kept on this phone)"}` : "All events uploaded to Arkiv.";
  }
}
setInterval(() => void flush(), 10_000);
window.addEventListener("online", () => {
  void flush();
  if (running && !ensName) void ensureEnsName();
});
window.addEventListener("offline", () => void flush());

async function ensureGas() {
  try {
    const r = await fetch("/api/drip", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: account.address }) });
    const j = (await r.json()) as { ok: boolean; funded?: boolean; error?: string };
    if (!j.ok) setChainNote(`Gas top-up failed: ${j.error ?? r.status}`, true);
    else if (j.funded) setChainNote("Gas topped up from the team faucet.");
  } catch (e) {
    setChainNote(`Gas top-up unreachable: ${String(e)}`, true);
  }
}
let ensName = "";
// T14: joining a site needs a committee invite (from the invite QR). Keep it for this session's registration attempts.
const inviteParam = params.get("inv") ?? sessionStorage.getItem("tw.inv") ?? "";
if (params.get("inv")) sessionStorage.setItem("tw.inv", params.get("inv")!);
async function ensureEnsName() {
  setChainNote("Registering this phone's ENS name…");
  try {
    const r = await fetch("/api/ens-register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ site: ui.site.value.trim(), label: ui.name.value.trim(), address: account.address, invite: inviteParam }),
    });
    const j = (await r.json()) as { ok: boolean; name?: string; error?: string };
    if (!j.ok) return setChainNote(`ENS registration failed: ${j.error ?? r.status}. Readings will not count until this phone has a name.`, true);
    ensName = j.name ?? "";
    // T3: a little Sepolia gas so this phone can write its own ENS head record.
    void fetch("/api/drip", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: account.address, chain: "sepolia" }) }).catch(() => undefined);
    setChainNote(`ENS: <a href="https://sepolia.app.ens.domains/${ensName}" target="_blank" rel="noopener"><b>${ensName}</b></a> → this phone (non-transferable, expires in 30 days)`);
  } catch (e) {
    setChainNote(`ENS registration unreachable: ${String(e)}`, true);
  }
}
function setChainNote(msg: string, err = false) {
  ui.chain.innerHTML = `Wallet: <a href="${EXPLORER}/address/${account.address}" target="_blank" rel="noopener">${account.address}</a><br>${err ? '<span class="bad">' : ""}${msg}${err ? "</span>" : ""}`;
}

let running = false;
let stopListen: (() => void) | null = null;
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
let open: { t0: number; peak: number; peakAcc: number; gBefore: [number, number, number]; axis: number[][] } | null = null;
let lastEventT = -Infinity;

// Sensor timestamps use a per-phone clock (Chrome Android: time since boot), NOT wall time. Map them to wall time
// with the smallest observed (Date.now() - sensorT): the minimum removes callback latency. Needed so two phones'
// events land in the same quorum window.
let clockOffset = Infinity;
// Phone clocks (Date.now) can be seconds apart (network time). Real test: two phones were 3.3 s apart, which broke the
// 2 s quorum window. So we also measure this phone's offset to one reference clock (/api/time) and stamp events in it.
let refOffset = 0; // ms to add to this phone's Date.now() to get reference time
let refRtt = Infinity;
const toWall = (t: number) => t + clockOffset + refOffset;
async function syncClock() {
  let best: { off: number; rtt: number } | null = null;
  for (let i = 0; i < 8; i++) {
    try {
      const t0 = Date.now();
      const r = await fetch(`/api/time?n=${i}-${t0}`, { cache: "no-store" });
      const t1 = Date.now();
      const { t } = (await r.json()) as { t: number };
      const rtt = t1 - t0;
      const off = t + rtt / 2 - t1; // Cristian: server time at the midpoint of the round trip
      if (!best || rtt < best.rtt) best = { off, rtt };
    } catch {
      /* keep trying */
    }
  }
  if (best) {
    refOffset = Math.round(best.off);
    refRtt = best.rtt;
    ui.clock.textContent = `Clock synced: this phone is ${refOffset >= 0 ? "behind" : "ahead"} by ${Math.abs(refOffset)} ms (±${Math.ceil(refRtt / 2)} ms)`;
  } else {
    ui.clock.textContent = "Clock sync unavailable: using this phone's own clock (quorum may miss events).";
  }
}

// Gravity / orientation: low-pass of the raw accelerometer. A phone lying on a vibrating floor keeps its tilt;
// a phone that is picked up, flipped or shaken does not.
let grav: [number, number, number] = [0, 0, 0];
let gravInit = false;
const GRAV_ALPHA = 0.05; // ~0.5 Hz at 50 Hz
function tiltDeg(a: [number, number, number], b: [number, number, number]) {
  const na = Math.hypot(...a);
  const nb = Math.hypot(...b);
  if (na < 1 || nb < 1) return 0;
  const c = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (na * nb);
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

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
  if (raw.length > 60 * 60 * 20) raw.splice(0, raw.length - 60 * 60 * 15); // cap memory (~20 min at 60 Hz)
  stamps.push(s.t);
  if (stamps.length > 240) stamps.shift();
  clockOffset = Math.min(clockOffset, Date.now() - s.t);
  if (!gravInit) {
    grav = [s.x, s.y, s.z];
    gravInit = true;
  } else if (!open) {
    // Freeze the gravity estimate during an event so the vibration itself doesn't bend it.
    grav = [grav[0] + GRAV_ALPHA * (s.x - grav[0]), grav[1] + GRAV_ALPHA * (s.y - grav[1]), grav[2] + GRAV_ALPHA * (s.z - grav[2])];
  }

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
    const rate = fs;
    post({ kind: "sensor", payload: { site: ui.site.value.trim(), sensor: ui.name.value.trim(), startedMs: Date.now(), rateHz: rate, api: ui.api.textContent ?? "", ua: navigator.userAgent } });
  }

  const { accBand, velMmS } = tracker.push(s);
  const ratio = trig!.push(accBand);
  plotBuf.push({ t: s.t, a: accBand });
  velBuf.push({ t: s.t, v: velMmS });
  while (plotBuf.length && s.t - plotBuf[0]!.t > 10_000) plotBuf.shift();
  while (velBuf.length && s.t - velBuf[0]!.t > 2_000) velBuf.shift();

  // Event state machine
  if (!open && ratio > TRIGGER_RATIO && s.t - lastEventT > REFRACTORY_MS) {
    open = { t0: s.t, peak: 0, peakAcc: 0, gBefore: [...grav] as [number, number, number], axis: [[], [], []] };
  }
  if (open) {
    open.peak = Math.max(open.peak, velMmS);
    open.peakAcc = Math.max(open.peakAcc, accBand);
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
  // Remove each axis's mean (gravity) first, then use the axis with the most energy for frequency features.
  const centred = o.axis.map((a) => {
    const m = a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
    return a.map((v) => v - m);
  });
  const energy = centred.map((a) => a.reduce((acc, v) => acc + v * v, 0));
  const best = centred[energy.indexOf(Math.max(...energy))]!;
  const fDom = dominantHz(best, fs);
  const lowF = lowFreqRatio(best, fs);
  // Orientation after the event: mean of the last 200 ms of raw samples.
  const tail = raw.slice(-Math.max(3, Math.round(fs * 0.2)));
  const gAfter: [number, number, number] = [0, 1, 2].map((i) => tail.reduce((acc, s) => acc + [s.x, s.y, s.z][i]!, 0) / tail.length) as [number, number, number];
  const tilt = tiltDeg(o.gBefore, gAfter);
  const handling = tilt > HANDLING_TILT_DEG || o.peakAcc > HANDLING_ACC || lowF > HANDLING_LOWF;
  const label: DetectedEvent["label"] = handling ? "handling" : "structural";
  const wallMs = toWall(o.t0);
  const ev: DetectedEvent = { t: o.t0, wallMs, ppv: o.peak, fDom, lowF, tilt, peakAcc: o.peakAcc, label, write: "queued" };
  events.unshift(ev);
  lastEventT = o.t0;
  renderEvents();
  if (navigator.vibrate && label === "structural") navigator.vibrate(60);

  // Waveform excerpt: 300 ms before the trigger to the end of the window.
  const win = raw.filter((s) => s.t >= o.t0 - 300 && s.t <= o.t0 + EVENT_MS);
  const site = ui.site.value.trim();
  const sensor = ui.name.value.trim();
  const rate = fs;
  // T1: per-phone reading number (persisted), so a deleted reading leaves a visible gap.
  const seqKey = `tw.seq.${site}.${sensor}`;
  const seq = Number(lsGet(seqKey) ?? "0") + 1;
  lsSet(seqKey, String(seq));
  if (seq % 5 === 0) void publishHead(site, sensor, seq);
  post(
    {
      kind: "trigger",
      payload: {
        seq,
        site,
        sensor,
        tMs: wallMs,
        ppvMmS: ev.ppv,
        fDomHz: fDom,
        lowF,
        rateHz: rate,
        label,
        wave: { fs: rate, x: win.map((s) => s.x), y: win.map((s) => s.y), z: win.map((s) => s.z), tiltDeg: tilt, peakAcc: o.peakAcc, api: ui.api.textContent ?? "", refOffsetMs: refOffset, refRttMs: refRtt },
      },
    },
    ev,
  );
}

// ---- T3: publish this phone's reading head on its OWN ENS record (EAC lets it write only that key). ----
const sepoliaWallet = createWalletClient({ account, chain: sepolia, transport: viemHttp(SEPOLIA_RPC) });
let headBusy = false;
async function publishHead(site: string, sensor: string, seq: number) {
  if (!ensName || headBusy || !navigator.onLine) return;
  headBusy = true;
  try {
    await writePhoneHead(sepoliaWallet, ensPublic(), site, sensor, { seq, tMs: Date.now() });
    ui.clock.dataset.head = String(seq);
    setChainNote(`ENS: <b>${ensName}</b> · head #${seq} published on this phone's own ENS record`);
  } catch {
    /* best-effort: readings still go to Arkiv; next publish retries */
  } finally {
    headBusy = false;
  }
}

function shortErr(e: unknown) {
  const m = String((e as { shortMessage?: string; message?: string })?.shortMessage ?? (e as Error)?.message ?? e);
  return m.length > 140 ? `${m.slice(0, 140)}…` : m;
}

function renderEvents() {
  ui.events.innerHTML = events
    .slice(0, 50)
    .map((e) => {
      const time = new Date(e.wallMs).toLocaleTimeString();
      const cls = e.label === "structural" ? "struct" : "handling";
      const w =
        e.write === "ok"
          ? `<span class="w ok">✓ on Arkiv</span>`
          : e.write === "error"
            ? `<span class="w bad" title="${(e.note ?? "").replace(/"/g, "'")}">✗ ${e.note ?? "write failed"}</span>`
            : `<span class="w">${e.write}…</span>`;
      return `<li>${time} · <b>${e.ppv.toFixed(2)} mm/s</b> · ${e.fDom.toFixed(1)} Hz · tilt ${e.tilt.toFixed(0)}° · ${e.peakAcc.toFixed(1)} m/s²<span class="tag ${cls}">${e.label}</span>${w}</li>`;
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
  if (typeof Accelerometer === "undefined") return false;
  try {
    const perm = await navigator.permissions.query({ name: "accelerometer" as PermissionName });
    if (perm.state === "denied") return false;
  } catch {
    /* permissions API may not know "accelerometer"; try anyway */
  }
  return new Promise((resolve) => {
    try {
      const sensor = new Accelerometer({ frequency: 60 });
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
      ui.api.textContent = "Accelerometer";
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
    const a = e.accelerationIncludingGravity;
    if (!a) return;
    onSample({ t: e.timeStamp, x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 });
  };
  window.addEventListener("devicemotion", h);
  stopFn = () => window.removeEventListener("devicemotion", h);
  ui.api.textContent = "DeviceMotion+g";
  return true;
}

ui.start.addEventListener("click", async () => {
  if (running) {
    stopFn?.();
    stopFn = null;
    stopListen?.();
    stopListen = null;
    {
      const site = ui.site.value.trim();
      const sensor = ui.name.value.trim();
      const seq = Number(lsGet(`tw.seq.${site}.${sensor}`) ?? "0");
      if (seq > 0) void publishHead(site, sensor, seq);
    }
    running = false;
    await wakeLock?.release().catch(() => {});
    ui.start.textContent = t("start");
    ui.site.disabled = false;
    ui.name.disabled = false;
    ui.start.classList.remove("running");
    setStatus(`Stopped. ${raw.length} samples, ${events.length} events recorded.`);
    return;
  }
  if (!window.isSecureContext) {
    setStatus("Motion sensors need HTTPS. Open the https:// link.", true);
    return;
  }
  tracker = null;
  clockOffset = Infinity;
  gravInit = false;
  raw.length = 0;
  trig = null;
  stamps.length = 0;
  setStatus("Starting sensor…");
  const ok = (await startGeneric()) || (await startDeviceMotion());
  if (!ok) {
    setStatus("No motion sensor available or permission denied.", true);
    return;
  }
  running = true;
  ui.start.textContent = t("stop");
  ui.start.classList.add("running");
  await acquireWakeLock();
  ui.site.disabled = true;
  ui.name.disabled = true;
  // Offline clock sync by sound: listen on the mic for the sync signal any phone can play.
  try {
    stopListen?.();
    stopListen = await listenForSync(
      (perfMs) => Date.now() - (performance.now() - perfMs) + refOffset,
      (wallMs) => {
        ui.syncStatus.textContent = `Heard sync sound at ${new Date(wallMs).toLocaleTimeString()} — anchor saved (aligns phones even offline).`;
        post({ kind: "sync", payload: { site: ui.site.value.trim(), sensor: ui.name.value.trim(), tMs: wallMs, method: "sound" } });
        if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
      },
    );
    ui.syncStatus.textContent = "Listening for the sync sound…";
  } catch {
    ui.syncStatus.textContent = "Microphone not allowed: sound sync off (internet sync still works).";
  }
  await syncClock();
  // Phone clocks drift and network time can step: re-sync every 2 minutes while sensing.
  const resync = setInterval(() => (running ? void syncClock() : clearInterval(resync)), 120_000);
  void ensureGas();
  void ensureEnsName();
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

ui.syncBtn.addEventListener("click", () => {
  void playSyncSignal();
  ui.syncStatus.textContent = "Playing sync sound… every running phone nearby should hear it.";
});
void flush();

// ---- Demo vibration source: a spare phone's vibration motor, pulsed on a fixed schedule (5 × 700 ms, every 4 s). ----
const shakerBtn = document.getElementById("shakerBtn") as HTMLButtonElement;
const shakerStatus = document.getElementById("shakerStatus")!;
shakerBtn.addEventListener("click", () => {
  if (running) {
    shakerStatus.textContent = "This phone is sensing: stop it first (a source phone must not also count as a sensor).";
    return;
  }
  if (!navigator.vibrate) {
    shakerStatus.textContent = "This browser can't vibrate (iPhone?). Use an Android phone as the source.";
    return;
  }
  const pattern: number[] = [];
  for (let i = 0; i < 5; i++) pattern.push(700, 3300);
  navigator.vibrate(pattern);
  shakerBtn.disabled = true;
  let n = 0;
  shakerStatus.textContent = "Pulse 1 of 5…";
  const t = setInterval(() => {
    n++;
    if (n >= 5) {
      clearInterval(t);
      shakerBtn.disabled = false;
      shakerStatus.textContent = "Done: 5 pulses. Check the dashboard for confirmed events.";
    } else shakerStatus.textContent = `Pulse ${n + 1} of 5…`;
  }, 4000);
});

initLang();
